from pydantic import BaseModel, Field
from ..services.llm_service import generate_structured_json

class EvaluationSchema(BaseModel):
    score: int = Field(description="Score out of 10")
    feedback: str = Field(description="Detailed feedback and reasoning")

def evaluate_technical(question: str, answer: str) -> dict:
    prompt = f"""You are a Technical Evaluator. Assess the following answer for technical correctness and depth.
    Question: {question}
    Answer: {answer}
    Provide a score out of 10 and detailed feedback."""
    return generate_structured_json(prompt, EvaluationSchema)

def evaluate_communication(question: str, answer: str) -> dict:
    prompt = f"""You are a Communication Evaluator. Assess the following answer for clarity, articulation, and structure.
    Question: {question}
    Answer: {answer}
    Provide a score out of 10 and detailed feedback."""
    return generate_structured_json(prompt, EvaluationSchema)

def evaluate_problem_solving(question: str, answer: str) -> dict:
    prompt = f"""You are a Problem Solving Evaluator. Assess the following answer for reasoning, approach, and decision making.
    Question: {question}
    Answer: {answer}
    Provide a score out of 10 and detailed feedback."""
    return generate_structured_json(prompt, EvaluationSchema)

def evaluate_confidence(question: str, answer: str) -> dict:
    prompt = f"""You are a Confidence Evaluator. Assess the following answer for confidence and tone.
    Question: {question}
    Answer: {answer}
    Provide a score out of 10 and detailed feedback."""
    return generate_structured_json(prompt, EvaluationSchema)

def evaluate_detail(question: str, answer: str) -> dict:
    prompt = f"""You are a Detail Evaluator. Assess the following answer for missing points, completeness, and examples.
    Question: {question}
    Answer: {answer}
    Provide a score out of 10 and detailed feedback."""
    return generate_structured_json(prompt, EvaluationSchema)

def multi_agent_evaluate(question: str, answer: str) -> dict:
    # In a real setup, these could run asynchronously in parallel
    technical = evaluate_technical(question, answer)
    communication = evaluate_communication(question, answer)
    problem_solving = evaluate_problem_solving(question, answer)
    confidence = evaluate_confidence(question, answer)
    detail = evaluate_detail(question, answer)

    return {
        "technical_score": technical.get("score", 0),
        "technical_feedback": technical.get("feedback", ""),
        "communication_score": communication.get("score", 0),
        "communication_feedback": communication.get("feedback", ""),
        "problem_solving_score": problem_solving.get("score", 0),
        "problem_solving_feedback": problem_solving.get("feedback", ""),
        "confidence_score": confidence.get("score", 0),
        "confidence_feedback": confidence.get("feedback", ""),
        "detail_score": detail.get("score", 0),
        "detail_feedback": detail.get("feedback", "")
    }
