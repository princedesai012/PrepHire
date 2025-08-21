# app/routes/interview.py
import uuid
from flask import Blueprint, request, jsonify
from ..services.gemini_service import call_gemini_api
from services.db import sessions_collection  # CORRECTED IMPORT STATEMENT

# Create a Blueprint for interview-related routes
interview_bp = Blueprint('interview', __name__)

@interview_bp.route('/start-interview', methods=['POST'])
def start_interview():
    """
    API endpoint to start a new interview.
    Generates the first question based on user settings and stores it in MongoDB.
    """
    data = request.json
    selected_domain = data.get('selectedDomain')
    selected_role = data.get('selectedRole')
    duration = data.get('duration')
    resume_based = data.get('resumeBased', False)

    # Use a UUID for a more robust session ID
    session_id = str(uuid.uuid4())

    if resume_based:
        initial_prompt = f"You are an AI interviewer conducting a mock interview for a {selected_role} position based on a resume. The total interview duration is {duration} minutes. Start the interview by asking a classic first interview question, such as 'Tell me about yourself' or 'Walk me through your resume.'"
    else:
        initial_prompt = f"You are an AI interviewer conducting a mock interview for a {selected_role} position in the {selected_domain} domain. The total interview duration is {duration} minutes. Start the interview by asking a classic first interview question, such as 'Tell me about yourself.'"

    try:
        ai_response = call_gemini_api(initial_prompt)

        # Create the session document to be inserted into MongoDB
        session_data = {
            '_id': session_id,
            'history': [{'role': 'user', 'text': initial_prompt}, {'role': 'model', 'text': ai_response}],
            'settings': data,
        }
        
        # Insert the new session document into the sessions collection
        sessions_collection.insert_one(session_data)

        return jsonify({
            'sessionId': session_id,
            'question': ai_response,
        })
    except Exception as e:
        print(f"Error starting interview: {e}")
        return jsonify({'error': 'Failed to start interview.'}), 500

@interview_bp.route('/answer', methods=['POST'])
def handle_answer():
    """
    API endpoint to continue the interview.
    Receives a user's answer and updates the session in MongoDB.
    """
    data = request.json
    session_id = data.get('sessionId')
    answer = data.get('answer')

    # Find the session document in MongoDB
    session = sessions_collection.find_one({'_id': session_id})
    if not session:
        return jsonify({'error': 'Session not found.'}), 404

    # Add the user's answer to the session history
    session['history'].append({'role': 'user', 'text': answer})

    # Construct a prompt for the next question based on conversation history
    prompt = f"Based on the following conversation, what is a good follow-up question for an interview? The interview is for a {session['settings']['selectedRole']} role in the {session['settings']['selectedDomain']} domain.\n\nConversation history:\n"
    for msg in session['history']:
        sender = 'You' if msg['role'] == 'user' else 'Interviewer'
        prompt += f"{sender}: {msg['text']}\n"
    prompt += "\nNext question:"

    try:
        ai_response = call_gemini_api(prompt)

        # Add the AI's response to the session history
        session['history'].append({'role': 'model', 'text': ai_response})
        
        # Update the session document in MongoDB
        sessions_collection.update_one({'_id': session_id}, {'$set': {'history': session['history']}})

        return jsonify({'question': ai_response})
    except Exception as e:
        print(f"Error getting next question: {e}")
        return jsonify({'error': 'Failed to get next question.'}), 500

@interview_bp.route('/end-interview', methods=['POST'])
def end_interview():
    """
    API endpoint to end the interview and generate results.
    """
    data = request.json
    session_id = data.get('sessionId')

    # Find the session document in MongoDB
    session = sessions_collection.find_one({'_id': session_id})
    if not session:
        return jsonify({'error': 'Session not found.'}), 404

    # Construct a prompt to analyze the interview conversation
    prompt = f"The following is a transcript of a mock interview for a {session['settings']['selectedRole']} role in the {session['settings']['selectedDomain']} domain. Please provide a detailed critique of the candidate's performance. Include a summary of strengths and weaknesses, and provide a numerical score from 1-100 for the following categories: Communication, Technical Knowledge, Problem-Solving, and Cultural Fit.\n\nInterview Transcript:\n"
    for msg in session['history']:
        sender = 'Candidate' if msg['role'] == 'user' else 'Interviewer'
        prompt += f"{sender}: {msg['text']}\n"
    prompt += "\nCritique:"

    try:
        ai_response = call_gemini_api(prompt)
        
        # Clean up the session by deleting the document from MongoDB
        sessions_collection.delete_one({'_id': session_id})

        return jsonify({'results': ai_response})
    except Exception as e:
        print(f"Error generating results: {e}")
        return jsonify({'error': 'Failed to generate results.'}), 500
