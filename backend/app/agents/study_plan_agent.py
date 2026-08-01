from pydantic import BaseModel, Field
from typing import List
from ..services.llm_service import generate_structured_json

class StudyPlanSchema(BaseModel):
    weak_skills: List[str] = Field(description="Skills that need improvement")
    resources: List[str] = Field(description="Recommended books, websites, or courses")
    plan: str = Field(description="Actionable study plan")

def generate_study_plan(feedback: dict, job_role: str) -> dict:
    prompt = f"""
    You are an expert Career Coach. Based on the candidate's interview feedback and target role, generate a comprehensive study plan.
    Target Role: {job_role}
    Feedback: {feedback}
    """
    
    result = generate_structured_json(prompt, StudyPlanSchema)
    return result
