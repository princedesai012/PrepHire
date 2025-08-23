# backend/app/services/gemini_service.py

import requests
import json
import os

def call_gemini_api(prompt):
    """
    Helper function to call the Gemini API.
    Handles the API request and response parsing.
    """
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable not set.")
        return None

    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={api_key}"

    try:
        response = requests.post(api_url, headers={'Content-Type': 'application/json'}, data=json.dumps(payload))
        response.raise_for_status()
        result = response.json()

        # --- THIS IS THE CORRECTED LINE ---
        if result.get('candidates') and result['candidates'][0].get('content') and result['candidates'][0]['content'].get('parts'):
            return result['candidates'][0]['content']['parts'][0]['text']
        else:
            # Check for a block reason
            if result.get('promptFeedback', {}).get('blockReason'):
                reason = result['promptFeedback']['blockReason']
                print(f"Gemini API call blocked. Reason: {reason}")
                return f"My response was blocked due to: {reason}. Please try a different prompt."
            print("Unexpected Gemini API response structure:", result)
            return None

    except requests.exceptions.RequestException as e:
        print(f"Error calling Gemini API: {e}")
        return None