from pydantic import BaseModel, Field
from typing import List
from ..services.llm_service import generate_structured_json

class JobAnalysisSchema(BaseModel):
    required_skills: List[str] = Field(description="Core technical and soft skills required for the role")
    interview_topics: List[str] = Field(description="Key topics that will likely be asked in the interview")

def analyze_job_role(job_role: str, company: str, level: str):
    prompt = f"""
    You are a technical hiring manager. Analyze the target job role and determine the required skills and common interview topics.
    Role: {job_role}
    Company: {company}
    Level: {level}
    """
    
    analysis = generate_structured_json(prompt, JobAnalysisSchema)
    return analysis
