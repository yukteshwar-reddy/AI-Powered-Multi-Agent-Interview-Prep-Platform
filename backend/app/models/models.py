from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class User(BaseModel):
    user_id: str
    name: str
    email: str
    resume_text: str = ""
    skills: List[str] = []
    projects: List[str] = []
    experience: List[str] = []

class Interview(BaseModel):
    interview_id: str
    user_id: str
    job_role: str
    company: str = ""
    level: str = ""
    questions: List[str] = []
    answers: List[str] = []
    scores: Dict[str, Any] = {}
    feedback: Dict[str, Any] = {}
