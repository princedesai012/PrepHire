import os
from pymongo import MongoClient
from app.config import Config

# Establish connection and get collections immediately upon import
try:
    client = MongoClient(Config.MONGO_URI)
    db = client["PrepHire"]
    users_collection = db["users"]
    sessions_collection = db["sessions"]
    print("Connected to MongoDB successfully.")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")
    # You might want to re-raise the exception to prevent the app from starting
    raise

# You can remove the old init_db function, or keep it as a no-op
# to avoid changing app/__init__.py, but the above code is sufficient.
# def init_db():
#     pass