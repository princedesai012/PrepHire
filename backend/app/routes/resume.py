from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.services.nlp import (
    resume_pipeline, 
    le, 
    extract_text, 
    clean_resume, 
    extract_resume_details
)
import logging

resume_bp = Blueprint('resume_bp', __name__)

@resume_bp.route("/analyze-resume", methods=["POST"])
# @jwt_required() # Uncomment this line to protect the resume analysis endpoint
def analyze_resume():
    try:
        if 'resume' not in request.files:
            return jsonify({"error": "No resume file provided"}), 400
            
        file = request.files["resume"]
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        raw_text = extract_text(file)
        cleaned = clean_resume(raw_text)
        
        if not cleaned.strip():
            return jsonify({"error": "Could not extract meaningful text from the resume. Please ensure it's not empty or corrupted."}), 400

        prediction = resume_pipeline.predict([cleaned])
        label = le.inverse_transform(prediction)[0]

        extracted = extract_resume_details(cleaned)

        return jsonify({
            "category": label,
            "ats_score": extracted["ats_score"],
            "skills": extracted["skills"],
            "experience": extracted["experience"],
            "education": extracted["education"],
            "recommendations": extracted["recommendations"]
        }), 200

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        logging.error(f"Error during resume analysis: {e}", exc_info=True)
        return jsonify({"error": "An internal server error occurred during resume analysis."}), 500