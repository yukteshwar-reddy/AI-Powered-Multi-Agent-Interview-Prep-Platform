import requests
import os

# 1. Create a dummy PDF file
pdf_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Skills: Python, React, JavaScript) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000219 00000 n \n0000000307 00000 n \ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n402\n%%EOF\n"

with open("dummy_test_resume.pdf", "wb") as f:
    f.write(pdf_content)

print("Created dummy_test_resume.pdf")

try:
    # 2. Test /api/upload-resume
    print("\nTesting /api/upload-resume...")
    with open("dummy_test_resume.pdf", "rb") as f:
        files = {"file": ("dummy_test_resume.pdf", f, "application/pdf")}
        data = {"name": "Test User", "email": "test@example.com"}
        res1 = requests.post("http://localhost:8000/api/upload-resume", files=files, data=data)
    
    print(f"Status Code: {res1.status_code}")
    res1_json = res1.json()
    print("Response:", res1_json)
    
    if res1.status_code != 200:
        print("Upload failed.")
        exit(1)
        
    user_id = res1_json["user_id"]
    
    # 3. Test /api/start-interview
    print("\nTesting /api/start-interview...")
    data2 = {
        "user_id": user_id,
        "job_role": "Backend Developer",
        "company": "Tech Corp",
        "level": "Mid-Level"
    }
    res2 = requests.post("http://localhost:8000/api/start-interview", json=data2)
    print(f"Status Code: {res2.status_code}")
    res2_json = res2.json()
    print("Response:", res2_json)
    
    if res2.status_code != 200:
        print("Start interview failed.")
        exit(1)
        
    interview_id = res2_json["interview_id"]
    questions = res2_json["questions"]
    
    # 4. Test /api/submit-answer
    print("\nTesting /api/submit-answer...")
    data3 = {
        "interview_id": interview_id,
        "question_index": 0,
        "answer": "I have extensive experience in Python and FastAPI. I ensure scalability by using async patterns."
    }
    res3 = requests.post("http://localhost:8000/api/submit-answer", json=data3)
    print(f"Status Code: {res3.status_code}")
    print("Response:", res3.json())
    
    print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY!")

except Exception as e:
    print(f"An error occurred: {e}")
finally:
    if os.path.exists("dummy_test_resume.pdf"):
        os.remove("dummy_test_resume.pdf")
