import os
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from pydantic import BaseModel
import json

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "gemini").lower()

def get_llm():
    if LLM_PROVIDER == "openai":
        return ChatOpenAI(model="gpt-4o", temperature=0.7)
    else:
        # Default to Groq Llama 3.3
        return ChatGroq(model="llama-3.3-70b-versatile", temperature=0.7)

def generate_structured_json(prompt_text: str, schema: BaseModel = None):
    llm = get_llm()
    # If the LLM provider supports structured output natively (like Gemini/OpenAI with Langchain with_structured_output)
    if schema:
        structured_llm = llm.with_structured_output(schema)
        response = structured_llm.invoke(prompt_text)
        return response.model_dump()
    else:
        # Fallback to json mode
        messages = [
            ("system", "You are a helpful assistant. Always return valid JSON only. Do not include markdown formatting like ```json."),
            ("human", prompt_text)
        ]
        response = llm.invoke(messages)
        text = response.content.strip()
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
        return json.loads(text.strip())
