import uvicorn
from dotenv import load_dotenv

load_dotenv()

from app.config import settings

if __name__ == "__main__":
    print("====================================================")
    print("                EDUGENIE BACKEND SERVER             ")
    print(f"   Listening on: http://{settings.host}:{settings.port}   ")
    print("====================================================")
    
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=True
    )
