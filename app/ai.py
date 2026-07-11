import os
import logging
from typing import Optional
from google import genai
from google.genai import types

from app.config import settings
from app.schemas import (
    QAResponse, ExplainResponse, QuizResponse, 
    SummarizeResponse, RecommendResponse, KeyTerm,
    QuizQuestion, RoadmapStep
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Lazy-loaded LaMini pipeline
_lamini_pipeline = None

# Lazy-loaded Gemini client
_gemini_client = None

def get_gemini_client() -> Optional[genai.Client]:
    """Initializes and returns the Gemini client if API key is configured."""
    global _gemini_client
    if _gemini_client is None:
        # Check setting first, then environment variable
        api_key = settings.gemini_api_key or os.environ.get("GEMINI_API_KEY")
        if api_key and api_key != "your_gemini_api_key_here":
            try:
                _gemini_client = genai.Client(api_key=api_key)
                logger.info("Google Gemini Client successfully initialized.")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini Client: {e}")
        else:
            logger.warning("GEMINI_API_KEY is not set. Gemini features will run in mock/demo mode.")
    return _gemini_client

def get_lamini_pipeline():
    """Lazy-loads the LaMini-Flan-T5 model pipeline for local NLP tasks."""
    global _lamini_pipeline
    if _lamini_pipeline is None:
        logger.info(f"Loading local LaMini model: {settings.lamini_model_id}...")
        try:
            import torch
            from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
            
            # Use GPU if available, else CPU
            device = 0 if torch.cuda.is_available() else -1
            device_str = "cuda" if device == 0 else "cpu"
            logger.info(f"Using device: {device_str} for local LaMini model.")
            
            tokenizer = AutoTokenizer.from_pretrained(settings.lamini_model_id)
            model = AutoModelForSeq2SeqLM.from_pretrained(settings.lamini_model_id)
            
            _lamini_pipeline = pipeline(
                "text2text-generation",
                model=model,
                tokenizer=tokenizer,
                device=device
            )
            logger.info("Local LaMini model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load LaMini pipeline: {e}")
            raise e
    return _lamini_pipeline

def is_lamini_loaded() -> bool:
    """Checks if the LaMini pipeline has already been initialized in memory."""
    return _lamini_pipeline is not None

# ==========================================
# AI Core Pipeline Implementation
# ==========================================

async def ask_question_ai(question: str, model_choice: str) -> QAResponse:
    """
    Answers a general or academic question using the selected model.
    """
    if model_choice.lower() == "lamini":
        try:
            nlp = get_lamini_pipeline()
            # LaMini expects simple questions/prompts
            res = nlp(f"Answer this question: {question}", max_length=256)
            answer = res[0]['generated_text']
            return QAResponse(answer=answer, model_used=f"LaMini ({settings.lamini_model_id})")
        except Exception as e:
            logger.error(f"LaMini Q&A Error: {e}")
            return QAResponse(
                answer="Could not retrieve an answer using local model. Ensure model dependencies are fully installed.",
                model_used="LaMini",
                success=False,
                error=str(e)
            )
    else:
        # Default to Gemini
        client = get_gemini_client()
        if not client:
            from app.mock_data import generate_dynamic_qa
            return generate_dynamic_qa(question)
        try:
            # We use gemini-1.5-pro for complex educational reasoning, with gemini-1.5-flash fallback
            model_name = "gemini-1.5-pro"
            prompt = f"Answer the following question clearly and in an educational tone:\n\n{question}"
            
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            return QAResponse(answer=response.text, model_used=model_name)
        except Exception as e:
            logger.error(f"Gemini API Error: {e}")
            return QAResponse(
                answer="An error occurred while calling the Gemini API. Please check your network connection or API Key quotas.",
                model_used="Gemini 1.5 Pro",
                success=False,
                error=str(e)
            )

async def explain_concept_ai(concept: str, level: str) -> ExplainResponse:
    """
    Explains a concept dynamically adjusted for different learning levels.
    """
    client = get_gemini_client()
    if not client:
        from app.mock_data import generate_dynamic_explain
        return generate_dynamic_explain(concept, level)

    try:
        prompt = (
            f"Explain the concept of '{concept}' in detail.\n"
            f"The target learning audience is: {level.upper()} learner.\n"
            f"Requirements:\n"
            f"- For BEGINNER: Use extremely simple words, short sentences, and engaging descriptions.\n"
            f"- For INTERMEDIATE: Include typical high-school level depth, structured points, and standard scientific/technical terms.\n"
            f"- For ADVANCED: Use university-level terminology, explore deep mechanisms, theories, and nuances.\n"
            f"- Provide a relatable analogy to visualize the concept.\n"
            f"- Extract 2-5 key vocabulary terms and define them."
        )
        
        response = client.models.generate_content(
            model="gemini-1.5-pro",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ExplainResponse,
            )
        )
        
        # Parse Pydantic from JSON text returned by Gemini
        data = ExplainResponse.model_validate_json(response.text)
        return data
    except Exception as e:
        logger.error(f"Gemini Explain Concept Error: {e}")
        return ExplainResponse(
            concept=concept,
            level=level,
            explanation="Failed to generate explanation due to an API error.",
            analogy="N/A",
            key_terms=[],
            success=False,
            error=str(e)
        )

async def generate_quiz_ai(topic: str, num_questions: int) -> QuizResponse:
    """
    Generates a structured educational quiz.
    """
    client = get_gemini_client()
    if not client:
        from app.mock_data import generate_dynamic_quiz
        return generate_dynamic_quiz(topic, num_questions)

    try:
        prompt = (
            f"Generate a multiple-choice quiz about: '{topic}'.\n"
            f"Generate exactly {num_questions} questions.\n"
            f"Each question must have exactly 4 choices, a correct_index (from 0 to 3), "
            f"and a short explanation explaining why the correct answer is correct and why other options are incorrect."
        )
        
        response = client.models.generate_content(
            model="gemini-1.5-pro",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=QuizResponse,
            )
        )
        
        data = QuizResponse.model_validate_json(response.text)
        return data
    except Exception as e:
        logger.error(f"Gemini Quiz Generation Error: {e}")
        return QuizResponse(
            topic=topic,
            questions=[],
            success=False,
            error=str(e)
        )

async def summarize_text_ai(text: str) -> SummarizeResponse:
    """
    Summarizes a block of educational text.
    """
    client = get_gemini_client()
    if not client:
        from app.mock_data import generate_dynamic_summarize
        return generate_dynamic_summarize(text)

    try:
        prompt = (
            f"Analyze the following educational text and summarize it.\n"
            f"Requirements:\n"
            f"- Provide a clean high-level summary paragraph.\n"
            f"- Generate 3-6 key takeaways/bullet points.\n"
            f"- Identify 2-4 challenging or key vocabulary terms and define them for students.\n\n"
            f"Text to summarize:\n{text}"
        )
        
        response = client.models.generate_content(
            model="gemini-1.5-pro",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=SummarizeResponse,
            )
        )
        
        data = SummarizeResponse.model_validate_json(response.text)
        return data
    except Exception as e:
        logger.error(f"Gemini Summarization Error: {e}")
        return SummarizeResponse(
            summary="Failed to summarize text due to an API error.",
            key_points=[],
            vocabulary=[],
            success=False,
            error=str(e)
        )

async def recommend_path_ai(goal: str) -> RecommendResponse:
    """
    Generates a personalized step-by-step learning roadmap.
    """
    client = get_gemini_client()
    if not client:
        from app.mock_data import generate_dynamic_recommend
        return generate_dynamic_recommend(goal)

    try:
        prompt = (
            f"Create a structured step-by-step learning roadmap for a student with the goal: '{goal}'.\n"
            f"Requirements:\n"
            f"- Provide a motivating overview of the path.\n"
            f"- Define a sequence of 3 to 6 logical learning steps.\n"
            f"- For each step, include a title, detailed description, estimated timeframe (e.g., '2 weeks', '10 hours'), "
            f"and 2-4 recommended study materials, concepts, or online search keywords.\n"
            f"- Provide 3 general study tips/hacks for this domain."
        )
        
        response = client.models.generate_content(
            model="gemini-1.5-pro",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=RecommendResponse,
            )
        )
        
        data = RecommendResponse.model_validate_json(response.text)
        return data
    except Exception as e:
        logger.error(f"Gemini Recommendations Error: {e}")
        return RecommendResponse(
            goal=goal,
            overview="Failed to generate roadmap due to an API error.",
            roadmap=[],
            tips=[],
            success=False,
            error=str(e)
        )
