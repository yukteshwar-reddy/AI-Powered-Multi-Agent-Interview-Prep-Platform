from pydantic import BaseModel, Field
from typing import List
from ..services.llm_service import generate_structured_json
from ..database.mongodb import users_collection
import pypdf

class ResumeSchema(BaseModel):
    skills: List[str] = Field(description="List of technical and soft skills")
    projects: List[str] = Field(description="List of project names or summaries")
    experience: List[str] = Field(description="List of work experience items")

def extract_text_from_pdf(pdf_path: str) -> str:
    text = ""
    try:
        reader = pypdf.PdfReader(pdf_path)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text

def parse_resume(pdf_path: str, user_id: str):
    resume_text = extract_text_from_pdf(pdf_path)
    
    prompt = f"""
    You are an expert HR recruiter. Analyze the following resume text and extract the key skills, projects, and work experience.
    Resume Text:
    {resume_text}
    """
    
    parsed_data = generate_structured_json(prompt, ResumeSchema)
    
    # Update DB
    users_collection.update_one(
        {"user_id": user_id},
        {"$set": {
            "resume_text": resume_text,
            "skills": parsed_data.get("skills", []),
            "projects": parsed_data.get("projects", []),
            "experience": parsed_data.get("experience", [])
        }},
        upsert=True
    )
    
    return parsed_data
