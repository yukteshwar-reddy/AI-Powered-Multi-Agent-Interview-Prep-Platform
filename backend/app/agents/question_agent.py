from pydantic import BaseModel, Field
from typing import List
from ..services.llm_service import generate_structured_json

class QuestionSchema(BaseModel):
    questions: List[str] = Field(description="List of interview questions")

def generate_questions(resume_skills: List[str], projects: List[str], job_role: str, interview_topics: List[str], count: int = 5):
    prompt = f"""
    You are an expert technical interviewer.
    Generate {count} personalized interview questions using:
    1. User resume skills: {', '.join(resume_skills)}
    2. User projects: {', '.join(projects)}
    3. Target role: {job_role}
    4. Key Topics: {', '.join(interview_topics)}

    Generate a mix of technical and behavioral questions. Keep the questions realistic and concise.
    """
    
    result = generate_structured_json(prompt, QuestionSchema)
    return result.get("questions", [])
