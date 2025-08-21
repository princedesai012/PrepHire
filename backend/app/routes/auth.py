from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
import bcrypt
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app.config import Config
from app.services.db import users_collection
from app.utils.jwt_utils import TOKEN_BLOCKLIST
from flask_mail import Message
from app import mail # Import the mail object from your app factory
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
auth_bp = Blueprint('auth_bp', __name__)

# ---------------- SIGNUP ----------------
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


# ---------------- LOGIN ----------------
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

    # ✅ Create both access & refresh tokens
    access_token = create_access_token(identity=email)
    refresh_token = create_refresh_token(identity=email)

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "message": "Login successful",
        "username": user["username"]
    }), 200


# ---------------- GOOGLE SIGNUP/LOGIN ----------------
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

        # ✅ Create both tokens
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)

        return jsonify({
            "access_token": access_token,
            "refresh_token": refresh_token,
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


# ---------------- VERIFY TOKEN ----------------
@auth_bp.route("/verify-token", methods=["GET"])
@jwt_required()
def verify_token():
    try:
        current_email = get_jwt_identity()
        return jsonify({"valid": True, "email": current_email}), 200
    except Exception as e:
        return jsonify({"valid": False, "message": str(e)}), 401


# ---------------- REFRESH TOKEN ----------------
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_email = get_jwt_identity()
    new_access_token = create_access_token(identity=current_email)
    return jsonify({"access_token": new_access_token}), 200


# ---------------- LOGOUT ----------------
@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    TOKEN_BLOCKLIST.add(jti)
    return jsonify({"message": "Successfully logged out"}), 200


# ---------------- GET USER INFO ----------------
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
    
s = URLSafeTimedSerializer(Config.SECRET_KEY_RESET)
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")
    if not email:
        return jsonify({"message": "Email is required"}), 400

    user = users_collection.find_one({"email": email})
    
    # Send a generic message even if the email doesn't exist for security
    if user:
        # Create a temporary token valid for 1 hour
        token = s.dumps(email, salt='password-reset-salt')
        
        # The URL below should point to your frontend's reset password page
        reset_url = f"http://localhost:3000/reset-password?token={token}"
        
        msg = Message("Password Reset Request for PrepHire", recipients=[email])
        msg.body = f"Hello,\n\nTo reset your password, visit the following link:\n{reset_url}\n\nIf you did not request a password reset, please ignore this email."
        
        mail.send(msg)

    return jsonify({"message": "If the email is valid, a password reset link has been sent."}), 200

# ---------------- RESET PASSWORD ----------------
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    token = data.get("token")
    new_password = data.get("newPassword")

    if not token or not new_password:
        return jsonify({"message": "Token and new password are required"}), 400

    try:
        # Load the email from the token, with a 1-hour expiration
        email = s.loads(token, salt='password-reset-salt', max_age=3600)
    except SignatureExpired:
        return jsonify({"message": "The token has expired"}), 401
    except (BadTimeSignature, ValueError):
        return jsonify({"message": "Invalid token"}), 401

    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Hash and update the new password
    hashed_pw = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    users_collection.update_one({"email": email}, {"$set": {"password": hashed_pw}})

    return jsonify({"message": "Password has been reset successfully"}), 200
