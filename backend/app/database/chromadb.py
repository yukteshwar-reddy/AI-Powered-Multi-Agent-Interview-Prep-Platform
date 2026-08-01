import chromadb
import os

CHROMA_DB_DIR = os.getenv("CHROMA_DB_DIR", "./chroma_db")

# Initialize ChromaDB persistent client
chroma_client = chromadb.PersistentClient(path=CHROMA_DB_DIR)

# Collections
resume_collection = chroma_client.get_or_create_collection(name="resume_embeddings")
job_collection = chroma_client.get_or_create_collection(name="job_embeddings")
interview_qa_collection = chroma_client.get_or_create_collection(name="interview_qa")
company_questions_collection = chroma_client.get_or_create_collection(name="company_questions")
