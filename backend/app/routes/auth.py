from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
import bcrypt
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app.config import Config
from app.services.db import users_collection
from app.utils.jwt_utils import TOKEN_BLOCKLIST

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    username = data.get("username")

    if not email or not password or not username:
        return jsonify({"message": "Email, password, and username are required"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"message": "Email already registered"}), 409

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    user = {
        "username": username,
        "email": email,
        "password": hashed_pw,
        "google_signup": False
    }

    users_collection.insert_one(user)
    return jsonify({"message": "Signup successful"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"message": "Invalid email or password"}), 401
    
    if user.get("google_signup"):
        return jsonify({"message": "Please login using Google"}), 403

    if not user.get("password"):
        return jsonify({"message": "Invalid email or password"}), 401

    if not bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
        return jsonify({"message": "Invalid email or password"}), 401

    token = create_access_token(identity=email)
    return jsonify({"access_token": token, "message": "Login successful", "username": user["username"]}), 200

@auth_bp.route("/google-signup", methods=["POST"])
def google_signup():
    token = request.json.get("token")
    if not token:
        return jsonify({"message": "Missing token"}), 400

    try:
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), Config.GOOGLE_CLIENT_ID)
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com'] or idinfo['aud'] != Config.GOOGLE_CLIENT_ID:
            return jsonify({"message": "Invalid issuer or audience"}), 401

        email = idinfo["email"]
        name = idinfo.get("name", email.split('@')[0])
        picture = idinfo.get("picture", "")

        user = users_collection.find_one({"email": email})

        if not user:
            users_collection.insert_one({
                "username": name,
                "email": email,
                "password": "",
                "google_signup": True,
                "profile_picture": picture,
                "verified": True
            })
        elif not user.get("google_signup"):
            return jsonify({"message": "Email already registered with password. Please log in with email/password."}), 409

        jwt_token = create_access_token(identity=email)
        return jsonify({
            "access_token": jwt_token,
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

@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    TOKEN_BLOCKLIST.add(jti)
    return jsonify({"message": "Successfully logged out"}), 200

@auth_bp.route("/user", methods=["GET"])
@jwt_required()
def get_user_info():
    current_email = get_jwt_identity()
    user = users_collection.find_one({"email": current_email})

    if user:
        user_info = {
            "email": user["email"],
            "username": user["username"],
            "google_signup": user.get("google_signup", False),
            "profile_picture": user.get("profile_picture", "")
        }
        return jsonify(user_info), 200
    else:
        return jsonify({"message": "User not found"}), 404