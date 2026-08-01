from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import upload, interview, feedback

app = FastAPI(title="AI Multi-Agent Interview Prep API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api")
app.include_router(interview.router, prefix="/api")
app.include_router(feedback.router, prefix="/api")

@app.get("/")
def health_check():
    return {"status": "ok", "message": "AI Interview Prep API is running."}
