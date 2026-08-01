import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
import requests

load_dotenv("backend/.env")
api_key = os.getenv("GEMINI_API_KEY")
print(f"Key loaded: {bool(api_key)}")

# Try standard requests to see what models are available
try:
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
    response = requests.get(url)
    if response.status_code == 200:
        models = [m['name'] for m in response.json().get('models', []) if 'generateContent' in m.get('supportedGenerationMethods', [])]
        print("Available models:")
        for m in models:
            print("-", m)
    else:
        print("Error fetching models:", response.status_code, response.text)
except Exception as e:
    print("Request failed:", e)

# Test ChatGoogleGenerativeAI
try:
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
    print("Testing gemini-1.5-flash...")
    print(llm.invoke("Hello").content)
except Exception as e:
    print("Failed gemini-1.5-flash:", e)

try:
    llm2 = ChatGoogleGenerativeAI(model="gemini-1.5-pro")
    print("Testing gemini-1.5-pro...")
    print(llm2.invoke("Hello").content)
except Exception as e:
    print("Failed gemini-1.5-pro:", e)
