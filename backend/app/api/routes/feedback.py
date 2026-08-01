from fastapi import APIRouter, HTTPException
from ...database.mongodb import interviews_collection
from ...agents.evaluation_agents import multi_agent_evaluate
from ...agents.feedback_agent import generate_feedback
from ...agents.study_plan_agent import generate_study_plan

router = APIRouter()

@router.get("/feedback/{interview_id}")
async def get_feedback(interview_id: str):
    interview = interviews_collection.find_one({"interview_id": interview_id})
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
        
    questions = interview.get("questions", [])
    answers = interview.get("answers", [])
    scores_dict = interview.get("scores", {})
    
    # Evaluate any question that hasn't been evaluated yet
    updated_scores = dict(scores_dict)
    has_new_evaluations = False
    
    for i, question in enumerate(questions):
        str_i = str(i)
        if str_i not in updated_scores:
            answer_text = answers[i] if i < len(answers) else ""
            evaluation = multi_agent_evaluate(question, answer_text)
            updated_scores[str_i] = evaluation
            has_new_evaluations = True
            
    if has_new_evaluations:
        interviews_collection.update_one(
            {"interview_id": interview_id},
            {"$set": {"scores": updated_scores}}
        )
        
    # Convert scores dictionary to list of evaluations
    evaluations = list(updated_scores.values())
    
    # 1. Generate Final Feedback
    feedback = generate_feedback(evaluations)
    
    # 2. Generate Study Plan
    study_plan = generate_study_plan(feedback, interview.get("job_role", "Unknown Role"))
    
    # Save back to DB
    interviews_collection.update_one(
        {"interview_id": interview_id},
        {"$set": {
            "feedback": feedback,
            "study_plan": study_plan
        }}
    )
    
    # Remove _id from response for JSON serialization safety if we returned the whole object
    return {
        "status": "success",
        "feedback": feedback,
        "study_plan": study_plan,
        "questions": questions,
        "answers": answers,
        "scores": updated_scores
    }
