from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import json
import bcrypt
import os
from dotenv import load_dotenv
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

# Utility: Load users from local mock DB
def load_users():
    try:
        with open("users.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

# Utility: Save users to DB
def save_users(users):
    with open("users.json", "w") as f:
        json.dump(users, f, indent=2)

# ----------------------- Routes -----------------------

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    username = data.get("username")

    users = load_users()

    if any(user["email"] == email for user in users):
        return jsonify({"message": "Email already registered"}), 409

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    users.append({
        "username": username,
        "email": email,
        "password": hashed_pw,
        "google_signup": False
    })

    save_users(users)
    return jsonify({"message": "Signup successful"}), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    users = load_users()
    user = next((u for u in users if u["email"] == email), None)

    if not user or not user.get("password"):
        return jsonify({"message": "Invalid email or password"}), 401

    if user.get("google_signup"):
        return jsonify({"message": "Please login using Google"}), 403

    if not bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
        return jsonify({"message": "Invalid email or password"}), 401

    token = create_access_token(identity=email)
    return jsonify({"access_token": token, "message": "Login successful"}), 200

@app.route("/api/google-signup", methods=["POST"])
def google_signup():
    token = request.json.get("token")
    if not token:
        return jsonify({"message": "Missing token"}), 400

    try:
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
        
        # Additional validation checks
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            return jsonify({"message": "Invalid issuer"}), 401
            
        if idinfo['aud'] != GOOGLE_CLIENT_ID:
            return jsonify({"message": "Invalid audience"}), 401

        email = idinfo["email"]
        name = idinfo.get("name", email.split('@')[0])  # Fallback to email prefix if no name
        picture = idinfo.get("picture", "")  # Optionally store profile picture

        users = load_users()
        user = next((u for u in users if u["email"] == email), None)

        if not user:
            users.append({
                "username": name,
                "email": email,
                "password": "",
                "google_signup": True,
                "profile_picture": picture,  # Store profile picture if available
                "verified": True  # Mark as verified since Google verified the email
            })
            save_users(users)
        elif not user.get("google_signup"):
            return jsonify({"message": "Email already registered with password"}), 409

        token = create_access_token(identity=email)
        return jsonify({
            "access_token": token,
            "message": "Google signup/login successful",
            "user": {
                "email": email,
                "name": name,
                "picture": picture
            }
        })

    except ValueError as e:
        return jsonify({"message": f"Invalid Google token: {str(e)}"}), 401
    except Exception as e:
        return jsonify({"message": f"Authentication error: {str(e)}"}), 500

@app.route("/api/user", methods=["GET"])
@jwt_required()
def get_user_info():
    current_email = get_jwt_identity()
    users = load_users()
    user = next((u for u in users if u["email"] == current_email), None)

    if user:
        return jsonify({
            "email": user["email"],
            "username": user["username"],
            "profile_picture": user.get("profile_picture", "")
        }), 200
    else:
        return jsonify({"message": "User not found"}), 404


@app.route("/api/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({"message": f"Welcome, {current_user}. You're authenticated!"})

@app.route("/api/auth/verify-token", methods=["GET"])
@jwt_required()
def verify_token():
    return jsonify({"message": "Token is valid"}), 200

@app.route("/api/logout", methods=["POST"])
@jwt_required()
def logout():
    # Optional: blacklist token logic
    return jsonify({"message": "Logged out"}), 200


@app.route("/")
def home():
    return "✅ AI Resume Analyzer Backend is Running"

# ----------------------- Run -----------------------

if __name__ == "__main__":
    app.run(debug=True)
