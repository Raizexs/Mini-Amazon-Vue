from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import auth, products, categories, reviews, favorites, orders
from fastapi.staticfiles import StaticFiles
import os

# Define path to frontend public images
# Assuming backend is at root/backend and frontend is at root/frontend
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
IMG_DIR = os.path.join(BASE_DIR, "frontend", "public", "img")

app = FastAPI(
    title="Mini-Amazon API",
    description="""
    Backend API for Mini-Amazon e-commerce application.
    
    ## Features
    
    * **Authentication**: JWT-based user authentication with bcrypt password hashing
    * **Products**: Complete CRUD operations for products
    * **Categories**: Product category management
    * **Reviews**: User product reviews with rating system
    * **Favorites**: User favorite products management
    * **Orders**: Complete order processing with cart and checkout
    
    ## Security
    
    * Passwords encrypted with bcrypt
    * JWT tokens for secure authentication
    * Protected endpoints requiring authentication
    
    ## Documentation
    
    * Interactive API docs available at `/docs` (Swagger UI)
    * Alternative docs at `/redoc` (ReDoc)
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
if os.path.exists(IMG_DIR):
    app.mount("/img", StaticFiles(directory=IMG_DIR), name="img")
else:
    print(f"WARNING: Image directory not found at {IMG_DIR}")

# Include routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(reviews.router)
app.include_router(favorites.router)
app.include_router(orders.router)


@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint - API health check
    """
    return {
        "message": "Mini-Amazon API",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health", tags=["Root"])
async def health_check():
    """
    Health check endpoint for monitoring
    """
    return {
        "status": "healthy",
        "service": "mini-amazon-api"
    }
