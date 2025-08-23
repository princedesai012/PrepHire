# backend/test_connection.py
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def test_gemini_connection():
    """A simple script to test the connection to the Gemini API."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ ERROR: Could not find GEMINI_API_KEY in your .env file.")
        return

    # Use the exact same URL as your application
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={api_key}"
    
    # A simple payload to send
    payload = {
        "contents": [{"parts": [{"text": "Hello"}]}]
    }
    
    print(f"Attempting to connect to Google API...")
    
    try:
        response = requests.post(url, json=payload, timeout=10) # 10-second timeout
        
        # Check if the request was successful
        response.raise_for_status() 
        
        print("✅ SUCCESS: Connection to Gemini API was successful!")
        print("Response Status Code:", response.status_code)
        
    except requests.exceptions.Timeout:
        print("❌ FAILURE: The request timed out. The server is likely unreachable or a firewall is blocking the connection.")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ FAILURE: An error occurred while trying to connect.")
        print(f"Error details: {e}")

if __name__ == "__main__":
    test_gemini_connection()