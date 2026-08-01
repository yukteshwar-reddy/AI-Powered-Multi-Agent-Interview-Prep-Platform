from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import uuid
from ...database.mongodb import users_collection, interviews_collection
from ...agents.job_agent import analyze_job_role
from ...agents.question_agent import generate_questions
from ...agents.evaluation_agents import multi_agent_evaluate

router = APIRouter()

class StartInterviewRequest(BaseModel):
    user_id: str
    job_role: str
    company: str = ""
    level: str = ""

class SubmitAnswerRequest(BaseModel):
    interview_id: str
    question_index: int
    answer: str

@router.post("/start-interview")
async def start_interview(request: StartInterviewRequest):
    user = users_collection.find_one({"user_id": request.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # 1. Analyze Job Role
    job_analysis = analyze_job_role(request.job_role, request.company, request.level)
    
    # 2. Generate Questions based on resume and job
    questions = generate_questions(
        resume_skills=user.get("skills", []),
        projects=user.get("projects", []),
        job_role=request.job_role,
        interview_topics=job_analysis.get("interview_topics", []),
        count=5
    )
    
    interview_id = str(uuid.uuid4())
    
    # 3. Store in DB
    interview_data = {
        "interview_id": interview_id,
        "user_id": request.user_id,
        "job_role": request.job_role,
        "company": request.company,
        "level": request.level,
        "questions": questions,
        "answers": ["" for _ in questions],
        "scores": {},
        "feedback": {}
    }
    
    interviews_collection.insert_one(interview_data)
    
    return {
        "status": "success",
        "interview_id": interview_id,
        "questions": questions
    }

@router.post("/submit-answer")
async def submit_answer(request: SubmitAnswerRequest):
    interview = interviews_collection.find_one({"interview_id": request.interview_id})
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
        
    # Update DB
    answers_key = f"answers.{request.question_index}"
    
    interviews_collection.update_one(
        {"interview_id": request.interview_id},
        {"$set": {
            answers_key: request.answer
        }}
    )
    
    return {
        "status": "success"
    }
