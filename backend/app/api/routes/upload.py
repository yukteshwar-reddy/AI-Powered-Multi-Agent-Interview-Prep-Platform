from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from ...database.mongodb import users_collection
from ...agents.resume_agent import parse_resume
import os
import uuid
import shutil

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...), name: str = Form(...), email: str = Form(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    user_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{user_id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # Initial user document
        users_collection.insert_one({
            "user_id": user_id,
            "name": name,
            "email": email,
            "resume_text": "",
            "skills": [],
            "projects": [],
            "experience": []
        })
        
        # Process the resume
        parsed_data = parse_resume(file_path, user_id)
        
        return {
            "status": "success",
            "user_id": user_id,
            "parsed_data": parsed_data
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
