import os
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.schemas import (
    QARequest, QAResponse, ExplainRequest, ExplainResponse,
    QuizRequest, QuizResponse, SummarizeRequest, SummarizeResponse,
    RecommendRequest, RecommendResponse, HealthStatus
)
from app.ai import (
    ask_question_ai, explain_concept_ai, generate_quiz_ai,
    summarize_text_ai, recommend_path_ai, get_gemini_client,
    is_lamini_loaded
)

app = FastAPI(
    title="EduGenie",
    description="EduGenie is an AI-powered educational assistant simplifying learning.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base directories
CSS_DIR = os.path.join(settings.base_dir, "css")
JS_DIR = os.path.join(settings.base_dir, "js")
TEMPLATES_DIR = settings.base_dir

# Mount static files
app.mount("/css", StaticFiles(directory=CSS_DIR), name="css")
app.mount("/js", StaticFiles(directory=JS_DIR), name="js")

# Templates configuration
templates = Jinja2Templates(directory=TEMPLATES_DIR)

# ==========================================
# Frontend Routes
# ==========================================
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    """
    Renders the EduGenie unified web dashboard.
    """
    return templates.TemplateResponse(
        request=request,
        name="index.html", 
        context={"title": "EduGenie - AI Educational Assistant"}
    )

# ==========================================
# Backend REST API Routes
# ==========================================
@app.post("/api/qa", response_model=QAResponse)
async def ask_question(request: QARequest):
    """
    Intelligent Question Answering endpoint. Supports Gemini and local LaMini model.
    """
    return await ask_question_ai(request.question, request.model)

@app.post("/api/explain", response_model=ExplainResponse)
async def explain_concept(request: ExplainRequest):
    """
    Concept Explanation endpoint. Adapts details to learning levels.
    """
    return await explain_concept_ai(request.concept, request.level)

@app.post("/api/quiz", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    """
    Interactive Quiz Generation endpoint.
    """
    if request.num_questions < 1 or request.num_questions > 10:
        raise HTTPException(status_code=400, detail="Number of questions must be between 1 and 10.")
    return await generate_quiz_ai(request.topic, request.num_questions)

@app.post("/api/summarize", response_model=SummarizeResponse)
async def summarize_text(request: SummarizeRequest):
    """
    Educational Text Summarization endpoint.
    """
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    return await summarize_text_ai(request.text)

@app.post("/api/recommend", response_model=RecommendResponse)
async def recommend_path(request: RecommendRequest):
    """
    Personalized Learning Recommendations / Roadmap planner endpoint.
    """
    if not request.goal.strip():
        raise HTTPException(status_code=400, detail="Learning goal cannot be empty.")
    return await recommend_path_ai(request.goal)

@app.get("/api/health", response_model=HealthStatus)
async def health_check():
    """
    Returns the loaded status of models and server configurations.
    """
    gemini_client = get_gemini_client()
    return HealthStatus(
        status="healthy",
        gemini_configured=(gemini_client is not None),
        lamini_loaded=is_lamini_loaded(),
        lamini_model_id=settings.lamini_model_id
    )
