from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import random
import string

from ..database import get_db
from ..models import Order, OrderItem, Product, User, Coupon
from ..schemas import OrderResponse, OrderCreate
from ..auth import get_current_user

router = APIRouter(prefix="/api/orders", tags=["Orders"])


def generate_order_number():
    """Generate a unique order number"""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"ORD-{timestamp}-{random_str}"


@router.get("/", response_model=List[OrderResponse])
async def get_user_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all orders for the current user (requires authentication)
    
    - Requires valid JWT token
    """
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    return orders


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific order by ID (requires authentication)
    
    - **order_id**: Order ID
    - User can only access their own orders
    - Requires valid JWT token
    """
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return order


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new order (requires authentication)
    
    - **items**: List of order items with product_id, quantity, price
    - **shipping_method**: Shipping method name
    - **shipping_address**: Full shipping address
    - **shipping_locality**: Locality/city
    - **shipping_region**: Region/state
    - **coupon_code**: Optional discount coupon code
    - Requires valid JWT token
    """
    if not order_data.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one item"
        )
    
    # Calculate subtotal and validate products
    subtotal = 0.0
    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID {item.product_id} not found"
            )
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for product {product.titulo}"
            )
        subtotal += item.price * item.quantity
    
    # Apply coupon discount
    discount = 0.0
    if order_data.coupon_code:
        coupon = db.query(Coupon).filter(
            Coupon.code == order_data.coupon_code,
            Coupon.is_active == True
        ).first()
        
        if not coupon:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid coupon code"
            )
        
        if coupon.expires_at and coupon.expires_at < datetime.now():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Coupon has expired"
            )
        
        if subtotal < coupon.min_purchase:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Minimum purchase of ${coupon.min_purchase} required for this coupon"
            )
        
        if coupon.discount_type == "percentage":
            discount = subtotal * (coupon.discount_value / 100)
        else:  # fixed
            discount = coupon.discount_value
    
    # Calculate shipping cost (simplified - you can make this more sophisticated)
    shipping_cost = 5000.0 if subtotal < 50000 else 0.0  # Free shipping over $50,000
    
    # Calculate total
    total = subtotal - discount + shipping_cost
    
    # Generate order number
    order_number = generate_order_number()
    
    # Create order
    new_order = Order(
        user_id=current_user.id,
        order_number=order_number,
        status="pending",
        subtotal=subtotal,
        shipping_cost=shipping_cost,
        discount=discount,
        total=total,
        coupon_code=order_data.coupon_code,
        shipping_method=order_data.shipping_method,
        shipping_address=order_data.shipping_address,
        shipping_locality=order_data.shipping_locality,
        shipping_region=order_data.shipping_region
    )
    
    db.add(new_order)
    db.flush()  # Get order ID without committing
    
    # Create order items and update product stock
    for item in order_data.items:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price
        )
        db.add(order_item)
        
        # Update product stock and vendidos
        product = db.query(Product).filter(Product.id == item.product_id).first()
        product.stock -= item.quantity
        product.vendidos += item.quantity
    
    db.commit()
    db.refresh(new_order)
    
    return new_order


@router.patch("/{order_id}/status")
async def update_order_status(
    order_id: int,
    status: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update order status (requires authentication)
    
    - **order_id**: Order ID
    - **status**: New status (pending, confirmed, shipped, delivered, cancelled)
    - User can only update their own orders
    - Requires valid JWT token
    """
    valid_statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )
    
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    order.status = status
    db.commit()
    db.refresh(order)
    
    return order
