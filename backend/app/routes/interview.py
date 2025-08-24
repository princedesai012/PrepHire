# app/routes/interview.py
import uuid
from flask import Blueprint, request, jsonify
from ..services.gemini_service import call_gemini_api
from ..services.db import sessions_collection
# ✨ NEW: Add imports for file parsing
import PyPDF2
import docx
import io

# Create a Blueprint for interview-related routes
interview_bp = Blueprint('interview', __name__)

# ✨ NEW: Helper function to parse resume text from a file
def parse_resume(file_storage):
    """Parses the text content from an uploaded resume file (PDF or DOCX)."""
    filename = file_storage.filename
    text = ""
    try:
        if filename.endswith('.pdf'):
            # Read the PDF file in-memory
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_storage.read()))
            for page in pdf_reader.pages:
                text += page.extract_text()
        elif filename.endswith('.docx'):
            # Read the DOCX file in-memory
            doc = docx.Document(io.BytesIO(file_storage.read()))
            for para in doc.paragraphs:
                text += para.text + '\n'
        return text
    except Exception as e:
        print(f"Error parsing resume file {filename}: {e}")
        return None # Return None on failure

# ✨ MODIFIED: This route now handles file uploads
@interview_bp.route('/start-interview', methods=['POST'])
def start_interview():
    """
    API endpoint to start a new interview. Handles both form-data and JSON.
    If resume-based, it parses the resume and includes it in the prompt.
    """
    # Use request.form for text fields and request.files for the file
    data = request.form
    resume_based = data.get('resumeBased', 'false').lower() == 'true'
    session_id = str(uuid.uuid4())
    
    initial_prompt = ""

    if resume_based:
        if 'resumeFile' not in request.files:
            return jsonify({'error': 'Resume file is required.'}), 400

        resume_file = request.files['resumeFile']
        resume_text = parse_resume(resume_file)

        if resume_text is None or not resume_text.strip():
            return jsonify({'error': 'Failed to parse text from the uploaded resume.'}), 500

        # This new prompt includes the actual resume content
        initial_prompt = (
            f"You are an AI interviewer named Alex. You are starting a mock interview based on the candidate's resume. "
            f"The total interview duration is {data.get('duration')} minutes.\n\n"
            f"Here is the candidate's resume content:\n---BEGIN RESUME---\n{resume_text}\n---END RESUME---\n\n"
            f"Start the interview by asking a classic opening question that invites the candidate to talk about their background, "
            f"such as 'Tell me about yourself' or 'Can you walk me through your resume?'"
        )
    else:
        # This part remains the same for role-based interviews
        initial_prompt = (
            f"You are an AI interviewer named Alex conducting a mock interview for a "
            f"{data.get('selectedRole')} position in the {data.get('selectedDomain')} domain. "
            f"The total interview duration is {data.get('duration')} minutes. "
            f"Start the interview by asking a classic opening question like 'Tell me about yourself.'"
        )
    
    try:
        ai_response = call_gemini_api(initial_prompt)
        if ai_response is None:
            return jsonify({'error': 'Failed to get a response from the AI service.'}), 500

        session_data = {
            '_id': session_id,
            # Use a generic starting message for the user role in history
            'history': [{'role': 'user', 'text': 'Interview Started'}, {'role': 'model', 'text': ai_response}],
            'settings': {
                'selectedDomain': data.get('selectedDomain'),
                'selectedRole': data.get('selectedRole'),
                'duration': data.get('duration'),
                'resumeBased': resume_based
            },
        }
        sessions_collection.insert_one(session_data)

        return jsonify({'sessionId': session_id, 'question': ai_response})
    except Exception as e:
        print(f"Error starting interview: {e}")
        return jsonify({'error': 'Failed to start interview.'}), 500


# --- UNCHANGED: Your advanced /answer route is already perfect ---
@interview_bp.route('/answer', methods=['POST'])
def handle_answer():
    data = request.json
    session_id = data.get('sessionId')
    answer = data.get('answer')

    session = sessions_collection.find_one({'_id': session_id})
    if not session:
        return jsonify({'error': 'Session not found.'}), 404

    session['history'].append({'role': 'user', 'text': answer})

    conversation_history = ""
    for msg in session['history']:
        if msg['role'] == 'user':
            conversation_history += f"Candidate: {msg['text']}\n"
        elif msg['role'] == 'model':
            conversation_history += f"Interviewer: {msg['text']}\n"

    prompt = (
        f"You are an expert AI interviewer named Alex conducting a mock interview for a "
        f"{session['settings']['selectedRole']} position. Your personality is professional, adaptable, and encouraging. "
        f"Your primary goal is to assess the candidate's skills across different topics, not to get stuck on one detail.\n\n"
        f"**Your Rules of Engagement:**\n"
        f"1. **ASK INSIGHTFUL QUESTIONS:** Ask open-ended questions that encourage the candidate to share details.\n"
        f"2. **DO NOT GET STUCK:** If the candidate gives a very short, evasive, or uncooperative answer (e.g., 'yes', 'no', 'MERN stack' with no details), try to rephrase or ask for an example ONCE. If they still provide no detail, **you must gracefully pivot to a completely new topic or skill area.** For example, move from a technical question to a behavioral one.\n"
        f"3. **RESPECT THE CANDIDATE'S WISHES:** If the candidate asks to change the topic or end the interview, **you must honor their request immediately and politely.** Do not challenge them or ask why.\n"
        f"4. **MAINTAIN CHARACTER:** You are Alex, the interviewer. Do not break character. Ask the question directly.\n\n"
        f"**Conversation History:**\n{conversation_history}\n"
        f"Based on the rules and the history, ask the very next single question directly to the candidate."
    )

    try:
        ai_response = call_gemini_api(prompt)
        if ai_response is None:
            return jsonify({'error': 'Failed to get a response from the AI service.'}), 500

        session['history'].append({'role': 'model', 'text': ai_response})
        sessions_collection.update_one({'_id': session_id}, {'$set': {'history': session['history']}})

        return jsonify({'question': ai_response})
    except Exception as e:
        print(f"Error getting next question: {e}")
        return jsonify({'error': 'Failed to get next question.'}), 500

# --- UNCHANGED: Your /end-interview route is fine ---
@interview_bp.route('/end-interview', methods=['POST'])
def end_interview():
    # ... (This function remains exactly the same) ...
    data = request.json
    session_id = data.get('sessionId')
    session = sessions_collection.find_one({'_id': session_id})
    if not session:
        return jsonify({'error': 'Session not found.'}), 404
    prompt = f"The following is a transcript of a mock interview for a {session['settings']['selectedRole']} role in the {session['settings']['selectedDomain']} domain. Please provide a detailed critique of the candidate's performance. Include a summary of strengths and weaknesses, and provide a numerical score from 1-100 for the following categories: Communication, Technical Knowledge, Problem-Solving, and Cultural Fit.\n\nInterview Transcript:\n"
    for msg in session['history']:
        sender = 'Candidate' if msg['role'] == 'user' else 'Interviewer'
        prompt += f"{sender}: {msg['text']}\n"
    prompt += "\nCritique:"
    try:
        ai_response = call_gemini_api(prompt)
        sessions_collection.delete_one({'_id': session_id})
        return jsonify({'results': ai_response})
    except Exception as e:
        print(f"Error generating results: {e}")
        return jsonify({'error': 'Failed to generate results.'}), 500