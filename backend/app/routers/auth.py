from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth

from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserResponse, Token, Message
from ..auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user
)
from ..config import settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Initialize Firebase Admin SDK (only once)
import os
try:
    firebase_admin.get_app()
except ValueError:
    # App not initialized, initialize it with service account
    cred_path = os.path.join(os.path.dirname(__file__), '..', '..', 'firebase-credentials.json')
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        # Fallback for development without credentials
        firebase_admin.initialize_app()
    

class FirebaseLoginRequest(BaseModel):
    firebase_token: str


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user
    
    - **email**: Valid email address
    - **password**: Password (min 6 characters)
    - **full_name**: Optional full name
    """
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user with hashed password
    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        is_active=True
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login with email and password to get access token
    
    - **username**: Email address (OAuth2 uses 'username' field)
    - **password**: User password
    
    Returns JWT access token
    """
    # Find user by email (OAuth2PasswordRequestForm uses 'username' field)
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information
    
    Requires valid JWT token in Authorization header
    """
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    full_name: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user information
    
    Requires valid JWT token in Authorization header
    """
    if full_name:
        current_user.full_name = full_name
    
    db.commit()
    db.refresh(current_user)
    
    return current_user


@router.post("/firebase-login")
async def firebase_login(
    request: FirebaseLoginRequest,
    db: Session = Depends(get_db)
):
    """
    Login or register user using Firebase ID token
    
    This endpoint:
    1. Verifies the Firebase ID token
    2. Extracts user info (email, name) from the token
    3. Creates a new user if not exists, or retrieves existing user
    4. Issues a JWT token for backend API access
    
    - **firebase_token**: Firebase ID token from client
    
    Returns JWT access token and user info
    """
    try:
        # Verify Firebase ID token
        # In production, this will verify the token signature
        # For development without service account, we'll do basic validation
        try:
            decoded_token = firebase_auth.verify_id_token(request.firebase_token)
            email = decoded_token.get('email')
            name = decoded_token.get('name', '')
            firebase_uid = decoded_token.get('uid')
        except Exception as firebase_error:
            # If Firebase verification fails (e.g., no service account in dev)
            # You can implement a fallback or raise an error
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid Firebase token: {str(firebase_error)}"
            )
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email not found in Firebase token"
            )
        
        # Check if user exists
        user = db.query(User).filter(User.email == email).first()
        
        # Create new user if doesn't exist
        if not user:
            # Generate a random password (user won't use it, only Firebase auth)
            import secrets
            random_password = secrets.token_urlsafe(32)
            hashed_password = get_password_hash(random_password)
            
            user = User(
                email=email,
                hashed_password=hashed_password,
                full_name=name if name else email.split('@')[0],
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # Create JWT access token for backend API
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email},
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat() if user.created_at else None
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing Firebase login: {str(e)}"
        )
