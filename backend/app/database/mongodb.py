import os
from pymongo import MongoClient
import mongomock
from dotenv import load_dotenv

load_dotenv()

USE_MOCK = os.getenv("USE_MOCK_DB", "true").lower() == "true"
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")

if USE_MOCK:
    client = mongomock.MongoClient()
else:
    client = MongoClient(MONGO_URI)

db = client["interview_prep_db"]
users_collection = db["users"]
interviews_collection = db["interviews"]
