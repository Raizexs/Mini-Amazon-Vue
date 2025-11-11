from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Favorite, Product, User
from ..schemas import FavoriteResponse, FavoriteCreate
from ..auth import get_current_user

router = APIRouter(prefix="/api/favorites", tags=["Favorites"])


@router.get("/", response_model=List[FavoriteResponse])
async def get_user_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all favorites for the current user (requires authentication)
    
    - Requires valid JWT token
    """
    favorites = db.query(Favorite).filter(Favorite.user_id == current_user.id).all()
    return favorites


@router.post("/", response_model=FavoriteResponse, status_code=status.HTTP_201_CREATED)
async def add_favorite(
    favorite: FavoriteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add a product to favorites (requires authentication)
    
    - **product_id**: Product ID to add to favorites
    - Requires valid JWT token
    """
    # Check if product exists
    product = db.query(Product).filter(Product.id == favorite.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Check if already in favorites
    existing = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.product_id == favorite.product_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product already in favorites"
        )
    
    new_favorite = Favorite(
        user_id=current_user.id,
        product_id=favorite.product_id
    )
    
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    
    return new_favorite


@router.delete("/{product_id}")
async def remove_favorite(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Remove a product from favorites (requires authentication)
    
    - **product_id**: Product ID to remove from favorites
    - Requires valid JWT token
    """
    favorite = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.product_id == product_id
    ).first()
    
    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite not found"
        )
    
    db.delete(favorite)
    db.commit()
    
    return {"message": "Favorite removed successfully"}


@router.get("/{product_id}/check")
async def check_favorite(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Check if a product is in the current user's favorites (requires authentication)
    
    - **product_id**: Product ID to check
    - Returns: { "is_favorite": boolean }
    """
    exists = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.product_id == product_id
    ).first()

    return {"is_favorite": bool(exists)}
