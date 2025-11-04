from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import Product, Category
from ..schemas import ProductResponse, ProductCreate, ProductUpdate
from ..auth import get_current_user

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.get("/", response_model=List[ProductResponse])
async def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    categoria: Optional[str] = None,
    search: Optional[str] = None,
    destacado: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """
    Get list of products with optional filters
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **categoria**: Filter by category name
    - **search**: Search in product title
    - **destacado**: Filter featured products
    """
    query = db.query(Product)
    
    # Filter by category
    if categoria:
        category = db.query(Category).filter(Category.name == categoria).first()
        if category:
            query = query.filter(Product.categoria_id == category.id)
    
    # Search in title
    if search:
        query = query.filter(Product.titulo.ilike(f"%{search}%"))
    
    # Filter featured
    if destacado is not None:
        query = query.filter(Product.destacado == destacado)
    
    products = query.offset(skip).limit(limit).all()
    return products


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    """
    Get a specific product by ID
    
    - **product_id**: Product ID
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product


@router.get("/sku/{sku}", response_model=ProductResponse)
async def get_product_by_sku(sku: str, db: Session = Depends(get_db)):
    """
    Get a specific product by SKU
    
    - **sku**: Product SKU code
    """
    product = db.query(Product).filter(Product.sku == sku).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new product (requires authentication)
    
    - Requires valid JWT token
    """
    # Check if SKU already exists
    existing = db.query(Product).filter(Product.sku == product.sku).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="SKU already exists"
        )
    
    # Check if category exists
    category = db.query(Category).filter(Category.id == product.categoria_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    new_product = Product(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    
    return new_product


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update a product (requires authentication)
    
    - **product_id**: Product ID
    - Requires valid JWT token
    """
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Update only provided fields
    update_data = product.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    
    return db_product


@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Delete a product (requires authentication)
    
    - **product_id**: Product ID
    - Requires valid JWT token
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    db.delete(product)
    db.commit()
    
    return {"message": "Product deleted successfully"}
