from pydantic import BaseModel, Field
from typing import List
from ..services.llm_service import generate_structured_json

class FeedbackSchema(BaseModel):
    strengths: List[str] = Field(description="List of strengths identified in the interview")
    weaknesses: List[str] = Field(description="List of weaknesses identified in the interview")
    improvements: List[str] = Field(description="List of actionable improvement tips")
    overall_score: float = Field(description="Overall score out of 10 based on the aggregated evaluations")

def generate_feedback(evaluations: List[dict]) -> dict:
    prompt = f"""
    You are an expert Interview Coach. Review the following multi-agent evaluations from a mock interview and generate a final feedback report.
    Evaluations Data:
    {evaluations}
    
    Provide strengths, weaknesses, actionable improvements, and calculate an overall score out of 10.
    """
    
    result = generate_structured_json(prompt, FeedbackSchema)
    return result
