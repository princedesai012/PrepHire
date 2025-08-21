import requests
import json

def call_gemini_api(prompt):
    """
    Helper function to call the Gemini API.
    Handles the API request and response parsing.
    """
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    api_key = ""  # api key
    api_url = f"[https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=](https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=){api_key}"

    try:
        response = requests.post(api_url, headers={'Content-Type': 'application/json'}, data=json.dumps(payload))
        response.raise_for_status()  
        result = response.json()

        if result.get('candidates') and result['candidates'][0].get('content') and result['candidates'][0]['content'].get('parts'):
            return result['candidates'][0]['content']['parts'][0]['text']
        else:
            print("Unexpected Gemini API response structure:", result)
            return "An unexpected error occurred. Please try again."

    except requests.exceptions.RequestException as e:
        print(f"Error calling Gemini API: {e}")
        return "Failed to connect to the AI service. Please check your network and try again."
