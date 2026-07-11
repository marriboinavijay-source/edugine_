import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Google Gemini API key
    gemini_api_key: str = ""
    
    # Local Hugging Face Model ID
    # Options: MBZUAI/LaMini-Flan-T5-248M or MBZUAI/LaMini-Flan-T5-78M
    lamini_model_id: str = "MBZUAI/LaMini-Flan-T5-248M"
    
    # Server configuration
    host: str = "127.0.0.1"
    port: int = 8000
    
    # Application directories
    base_dir: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
