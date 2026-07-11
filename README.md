# EduGenie - AI-Powered Educational Assistant 🚀

EduGenie is a premium, interactive AI-powered educational assistant built using **FastAPI**, **Google Gemini 1.5 Pro**, **LaMini-Flan-T5**, **HTML**, and **CSS**. It simplifies learning by providing intelligent question answering, concept explanation, quiz generation, text summarization, and personalized learning roadmaps.

---

## 🌟 Key Features

- **Concept Explainer**: Explains any scientific, academic, or general topic at three selectable levels:
  - *Beginner* (Simple language and child-friendly analogies)
  - *Intermediate* (Student depth, structured scientific definitions)
  - *Advanced* (Academic definitions and deep mechanism discussions)
- **Interactive Quiz Generator**: Dynamically generates multiple-choice quizzes. It includes a custom client-side runner where users can click options, get immediate color-coded correct/incorrect feedback, read detailed explanations, and review their final score ring.
- **AI Q&A**: Resolves queries using either the advanced cloud-based **Gemini 1.5 Pro** or a local **LaMini-Flan-T5** model executing directly on your CPU.
- **Text Summarizer**: Distills long chapters or research papers into high-level summaries, bullet-point notes, and key vocabulary definitions.
- **Study Roadmap Planner**: Formulates study timelines, milestone steps, and recommended study resources for any learning goal.
- **Premium Glassmorphic Design**: Clean SPA styled with backdrop filters, glowing gradients, responsive panels, and smooth transitions.

---

## 🛠️ Project Structure

```text
edugenie/
├── requirements.txt      # Python dependencies
├── .env.example          # Environment variables template
├── .env                  # Private config (Git ignored)
├── .gitignore            # Excluded files for GitHub
├── run.py                # Server launcher script
├── app/
│   ├── __init__.py       # Package definition
│   ├── config.py         # Configuration settings loader
│   ├── main.py           # FastAPI server & route handlers
│   ├── schemas.py        # Pydantic schemas (Data validation)
│   ├── ai.py             # LLM Prompts & local model pipelines
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css # Premium Glassmorphism styling
│   │   └── js/
│   │       └── app.js    # Client-side routing & Quiz engine
│   └── templates/
│       └── index.html    # Single-page dashboard template
└── tests/
    ├── __init__.py
    └── test_api.py       # pytest integration tests
```

---

## ⚡ Setup & Run Instructions

### Prerequisites
- Python 3.10+ (Recommended: Python 3.13)
- Command line interface (PowerShell / Command Prompt / Terminal)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/edugenie.git
cd edugenie
```

### 2. Create and Activate Virtual Environment
```powershell
# Windows PowerShell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment keys
Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```
Open `.env` and add your Google Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(If no API Key is added, the app operates in a fully functional **Demo Mode** using simulated answers).*

### 5. Start the Application
Run the startup script:
```bash
python run.py
```
Open your browser and navigate to:
**[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

## 🧪 Testing

We run automated endpoint checks via `pytest`. To run tests:
```bash
pytest tests/test_api.py
```
All endpoints are mocked for unit testing, making it safe to test without requiring API keys or model weight downloads.
