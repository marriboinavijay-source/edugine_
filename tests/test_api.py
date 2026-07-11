import pytest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

# Mock the AI service methods BEFORE importing the app to avoid running actual model loaders
with patch("app.ai.get_gemini_client"), patch("app.ai.get_lamini_pipeline"):
    from app.main import app

client = TestClient(app)

# Standard mock responses matching Pydantic schemas
MOCK_QA_RESPONSE = {
    "answer": "Photosynthesis is the process by which plants make food.",
    "model_used": "gemini-1.5-pro",
    "success": True,
    "error": None
}

MOCK_EXPLAIN_RESPONSE = {
    "concept": "Photosynthesis",
    "level": "intermediate",
    "explanation": "Plants absorb carbon dioxide and water to create sugar and oxygen.",
    "analogy": "A solar panel powering a kitchen.",
    "key_terms": [
        {"term": "Chlorophyll", "definition": "A green pigment."}
    ],
    "success": True,
    "error": None
}

MOCK_QUIZ_RESPONSE = {
    "topic": "Gravity",
    "questions": [
        {
            "question_text": "What is the approximate acceleration of gravity on Earth?",
            "options": ["9.8 m/s²", "5.2 m/s²", "12.0 m/s²", "1.6 m/s²"],
            "correct_index": 0,
            "explanation": "Gravity accelerates objects at 9.8 m/s² on Earth."
        }
    ],
    "success": True,
    "error": None
}

MOCK_SUMMARIZE_RESPONSE = {
    "summary": "This is a summary of the text.",
    "key_points": ["Point one", "Point two"],
    "vocabulary": [{"term": "Photosynthesis", "definition": "How plants eat."}],
    "success": True,
    "error": None
}

MOCK_RECOMMEND_RESPONSE = {
    "goal": "Learn Python",
    "overview": "Python is a popular programming language.",
    "roadmap": [
        {
            "step_number": 1,
            "title": "Syntax Basics",
            "description": "Learn variables and loops.",
            "estimated_duration": "Week 1",
            "resources": ["Official Python Tutorial"]
        }
    ],
    "tips": ["Practice writing code daily."],
    "success": True,
    "error": None
}

# ==========================================
# Unit Tests
# ==========================================

def test_read_root():
    """Test that the homepage HTML route loads successfully."""
    response = client.get("/")
    assert response.status_code == 200
    assert "EduGenie" in response.text

@patch("app.main.ask_question_ai", new_callable=AsyncMock)
def test_qa_endpoint(mock_qa):
    """Test that Q&A endpoint returns structured results."""
    mock_qa.return_value = MOCK_QA_RESPONSE
    
    payload = {"question": "What is photosynthesis?", "model": "gemini"}
    response = client.post("/api/qa", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["answer"] == MOCK_QA_RESPONSE["answer"]
    assert data["model_used"] == "gemini-1.5-pro"
    mock_qa.assert_called_once_with("What is photosynthesis?", "gemini")

@patch("app.main.explain_concept_ai", new_callable=AsyncMock)
def test_explain_endpoint(mock_explain):
    """Test that the Concept Explainer endpoint parses parameters and returns structured schemas."""
    mock_explain.return_value = MOCK_EXPLAIN_RESPONSE
    
    payload = {"concept": "Photosynthesis", "level": "intermediate"}
    response = client.post("/api/explain", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["concept"] == "Photosynthesis"
    assert data["level"] == "intermediate"
    assert len(data["key_terms"]) == 1
    mock_explain.assert_called_once_with("Photosynthesis", "intermediate")

@patch("app.main.generate_quiz_ai", new_callable=AsyncMock)
def test_quiz_endpoint(mock_quiz):
    """Test that the Quiz Generator endpoint responds correctly."""
    mock_quiz.return_value = MOCK_QUIZ_RESPONSE
    
    payload = {"topic": "Gravity", "num_questions": 5}
    response = client.post("/api/quiz", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["topic"] == "Gravity"
    assert len(data["questions"]) == 1
    assert data["questions"][0]["correct_index"] == 0
    mock_quiz.assert_called_once_with("Gravity", 5)

def test_quiz_endpoint_invalid_questions():
    """Test that the Quiz Generator validates the bounds of num_questions."""
    payload = {"topic": "Gravity", "num_questions": 12}  # Max is 10
    response = client.post("/api/quiz", json=payload)
    assert response.status_code == 400

@patch("app.main.summarize_text_ai", new_callable=AsyncMock)
def test_summarize_endpoint(mock_summarize):
    """Test that the Summarizer endpoint functions correctly."""
    mock_summarize.return_value = MOCK_SUMMARIZE_RESPONSE
    
    payload = {"text": "A long text about plants."}
    response = client.post("/api/summarize", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["summary"] == MOCK_SUMMARIZE_RESPONSE["summary"]
    mock_summarize.assert_called_once_with("A long text about plants.")

@patch("app.main.recommend_path_ai", new_callable=AsyncMock)
def test_recommend_endpoint(mock_recommend):
    """Test that the Roadmap Planner endpoint structures recommendation outputs."""
    mock_recommend.return_value = MOCK_RECOMMEND_RESPONSE
    
    payload = {"goal": "Learn Python"}
    response = client.post("/api/recommend", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["goal"] == "Learn Python"
    assert len(data["roadmap"]) == 1
    mock_recommend.assert_called_once_with("Learn Python")

def test_health_check_endpoint():
    """Test that health check endpoint returns active status flags."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "gemini_configured" in data
    assert "lamini_loaded" in data
