from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Application settings - Configuration structure with type validation
    
    IMPORTANT: 
    - This file defines the STRUCTURE and TYPES of configuration variables
    - Actual VALUES are read from the .env file (environment variables)
    - The values below are FALLBACKS only used if .env doesn't exist
    - In production, ALL values should come from .env file
    
    The application automatically reads from .env thanks to Pydantic BaseSettings
    """
    
    # ==================== DATABASE CONFIGURATION ====================
    # Real value should be in .env file
    # Example: DATABASE_URL=postgresql://user:password@host:5432/dbname
    DATABASE_URL: str
    
    # ==================== JWT AUTHENTICATION ====================
    # Real value MUST be in .env file (keep secret!)
    # Example: SECRET_KEY=your-super-secret-key-min-32-characters-long
    SECRET_KEY: str
    
    # JWT algorithm (can use default or override in .env)
    ALGORITHM: str = "HS256"
    
    # Token expiration time in minutes (can override in .env)
    # Example: ACCESS_TOKEN_EXPIRE_MINUTES=60
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # ==================== CORS CONFIGURATION ====================
    # Frontend URL for CORS (override in .env for production)
    # Example: FRONTEND_URL=https://yourdomain.com
    FRONTEND_URL: str = "http://localhost:5173"
    
    # ==================== API SERVER ====================
    # Server host and port (can override in .env)
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    
    class Config:
        """
        Pydantic configuration
        - env_file: Automatically reads from .env file
        - case_sensitive: Variable names must match exactly
        """
        env_file = ".env"
        case_sensitive = True


# Single instance of settings to be imported throughout the application
# Usage: from app.config import settings
settings = Settings()
