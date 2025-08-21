import os
from dotenv import load_dotenv
from app import create_app

# Load environment variables from .env file
load_dotenv()

# Create the Flask application instance
app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    # In a production environment, set debug=False and use a production-ready WSGI server like Gunicorn
    app.run(debug=True, port=port)