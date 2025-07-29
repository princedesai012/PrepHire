from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import json
import bcrypt
import os
from dotenv import load_dotenv
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import pickle
import re
import docx
import PyPDF2
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from bson import ObjectId


# Load environment variables
load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))
db = client["PrepHire"]
users_collection = db["users"]
app = Flask(__name__)
CORS(app, supports_credentials=True)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

svc_model = pickle.load(open("clf.pkl", "rb"))
tfidf = pickle.load(open("tfidf.pkl", "rb"))
le = pickle.load(open("encoder.pkl", "rb"))



def clean_resume(txt):
    txt = re.sub(r'http\S+\s', ' ', txt)
    txt = re.sub('RT|cc', ' ', txt)
    txt = re.sub(r'#\S+\s', ' ', txt)
    txt = re.sub(r'[^\x00-\x7f]', ' ', txt)
    txt = re.sub(r'@\S+', '  ', txt)
    txt = re.sub(r'[!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~]', ' ', txt)
    txt = re.sub(r'\s+', ' ', txt)
    return txt


def extract_text(file):
    filename = secure_filename(file.filename)
    ext = filename.split(".")[-1].lower()
    if ext == "pdf":
        reader = PyPDF2.PdfReader(file)
        return ''.join([p.extract_text() for p in reader.pages if p.extract_text()])
    elif ext == "docx":
        doc = docx.Document(file)
        return '\n'.join([p.text for p in doc.paragraphs])
    elif ext == "txt":
        return file.read().decode("utf-8", errors="ignore")
    else:
        raise ValueError("Unsupported file format.")


import spacy
nlp = spacy.load("en_core_web_sm") 

def extract_resume_details(text):
    doc = nlp(text)

    skills_keywords = [
        "python", "java", "c++", "sql", "html", "css", "javascript",
        "react", "node", "mern", "ds", "ml", "nlp", "mongodb"
    ]
    
    # Extract skills
    skills_found = set()
    for token in doc:
        if token.text.lower() in skills_keywords:
            skills_found.add(token.text.upper())

    # Extract education
    education_keywords = ["b.tech", "m.tech", "bachelor", "master", "msc", "bsc", "engineering"]
    education = "Not Found"
    for sent in doc.sents:
        if any(edu in sent.text.lower() for edu in education_keywords):
            education = sent.text.strip()
            break

    # Estimate experience from years
    experience = "Not Found"
    matches = re.findall(r'(\d+)\+?\s*(?:years|yrs)', text.lower())
    if matches:
        experience = f"{max(map(int, matches))} Years"

    # Simulate ATS score (based on section keywords)
    ats_score = 50
    if "experience" in text.lower(): ats_score += 15
    if "skills" in text.lower(): ats_score += 15
    if "education" in text.lower(): ats_score += 10

    return {
        "skills": list(skills_found) or ["N/A"],
        "education": education,
        "experience": experience,
        "ats_score": f"{min(ats_score, 100)}%"
    }

# ----------------------- Routes -----------------------

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    username = data.get("username")

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

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({"email": email})
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
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com'] or idinfo['aud'] != GOOGLE_CLIENT_ID:
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
    user = users_collection.find_one({"email": current_email})

    if user:
        return jsonify({
            "email": user["email"],
            "username": user["username"]
        }), 200
    else:
        return jsonify({"message": "User not found"}), 404


@app.route("/api/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({"message": f"Welcome, {current_user}. You're authenticated!"})

@app.route("/api/analyze-resume", methods=["POST"])
# @jwt_required()  
def analyze_resume():
    try:
        file = request.files["resume"]
        raw_text = extract_text(file)                    #  Extract
        cleaned = clean_resume(raw_text)                 # Clean
        vectorized = tfidf.transform([cleaned]).toarray()  #  Vectorize
        prediction = svc_model.predict(vectorized)       #  Predict category
        label = le.inverse_transform(prediction)[0]

        extracted = extract_resume_details(cleaned)      #  NLP insights

        return jsonify({
            "category": label,
            "ats_score": extracted["ats_score"],
            "skills": extracted["skills"],
            "experience": extracted["experience"],
            "education": extracted["education"],
            "recommendations": [
                "Add more measurable achievements",
                "Include a certifications section",
                "Quantify work experience with numbers"
            ]
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route("/")
def home():
    return " AI Resume Analyzer Backend is Running"

# ----------------------- Run -----------------------

if __name__ == "__main__":
    app.run(debug=True)
