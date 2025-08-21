import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    MONGO_URI = os.getenv("MONGO_URI")
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")