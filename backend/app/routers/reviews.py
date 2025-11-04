from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from ..database import get_db
from ..models import Review, Product, User
from ..schemas import ReviewResponse, ReviewCreate
from ..auth import get_current_user

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])


@router.get("/product/{product_id}", response_model=List[ReviewResponse])
async def get_product_reviews(product_id: int, db: Session = Depends(get_db)):
    """
    Get all reviews for a specific product
    
    - **product_id**: Product ID
    """
    # Check if product exists
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    reviews = db.query(Review).filter(Review.product_id == product_id).all()
    return reviews


@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(
    review: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new review for a product (requires authentication)
    
    - **product_id**: Product ID
    - **rating**: Rating from 1 to 5
    - **comment**: Optional review comment
    - Requires valid JWT token
    """
    # Check if product exists
    product = db.query(Product).filter(Product.id == review.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Check if user already reviewed this product
    existing_review = db.query(Review).filter(
        Review.product_id == review.product_id,
        Review.user_id == current_user.id
    ).first()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this product"
        )
    
    # Create review
    new_review = Review(
        product_id=review.product_id,
        user_id=current_user.id,
        rating=review.rating,
        comment=review.comment
    )
    
    db.add(new_review)
    db.commit()
    
    # Update product rating
    avg_rating = db.query(func.avg(Review.rating)).filter(
        Review.product_id == review.product_id
    ).scalar()
    
    product.rating = round(float(avg_rating), 2) if avg_rating else 0.0
    db.commit()
    
    db.refresh(new_review)
    return new_review


@router.delete("/{review_id}")
async def delete_review(
    review_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a review (requires authentication)
    
    - **review_id**: Review ID
    - User can only delete their own reviews
    - Requires valid JWT token
    """
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    # Check if user owns this review
    if review.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this review"
        )
    
    product_id = review.product_id
    
    db.delete(review)
    db.commit()
    
    # Update product rating
    avg_rating = db.query(func.avg(Review.rating)).filter(
        Review.product_id == product_id
    ).scalar()
    
    product = db.query(Product).filter(Product.id == product_id).first()
    if product:
        product.rating = round(float(avg_rating), 2) if avg_rating else 0.0
        db.commit()
    
    return {"message": "Review deleted successfully"}
