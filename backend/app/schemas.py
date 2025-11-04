from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime


# ========== User Schemas ==========
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=72, description="Password (6-72 characters)")


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# ========== Category Schemas ==========
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ========== Product Schemas ==========
class ProductBase(BaseModel):
    sku: str
    titulo: str
    categoria_id: int
    marca: Optional[str] = None
    precio: float
    stock: int = 0
    descripcion: Optional[str] = None
    imagenes: List[str] = []
    destacado: bool = False
    specs: dict = {}


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    titulo: Optional[str] = None
    categoria_id: Optional[int] = None
    marca: Optional[str] = None
    precio: Optional[float] = None
    stock: Optional[int] = None
    descripcion: Optional[str] = None
    imagenes: Optional[List[str]] = None
    destacado: Optional[bool] = None
    specs: Optional[dict] = None


class ProductResponse(ProductBase):
    id: int
    rating: float
    vendidos: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ========== Review Schemas ==========
class ReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    product_id: int


class ReviewResponse(ReviewBase):
    id: int
    product_id: int
    user_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ========== Coupon Schemas ==========
class CouponBase(BaseModel):
    code: str
    description: Optional[str] = None
    discount_type: str  # "percentage" or "fixed"
    discount_value: float
    min_purchase: float = 0
    is_active: bool = True
    expires_at: Optional[datetime] = None


class CouponCreate(CouponBase):
    pass


class CouponResponse(CouponBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class CouponValidate(BaseModel):
    code: str
    subtotal: float


# ========== Order Schemas ==========
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemResponse(OrderItemBase):
    id: int
    order_id: int
    
    model_config = ConfigDict(from_attributes=True)


class OrderBase(BaseModel):
    shipping_method: Optional[str] = None
    shipping_address: Optional[str] = None
    shipping_locality: Optional[str] = None
    shipping_region: Optional[str] = None
    coupon_code: Optional[str] = None


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]


class OrderResponse(OrderBase):
    id: int
    user_id: int
    order_number: str
    status: str
    subtotal: float
    shipping_cost: float
    discount: float
    total: float
    items: List[OrderItemResponse]
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


# ========== Favorite Schemas ==========
class FavoriteCreate(BaseModel):
    product_id: int


class FavoriteResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ========== Shipping Schemas ==========
class ShippingMethodBase(BaseModel):
    name: str
    description: Optional[str] = None
    cost: float
    estimated_days: Optional[str] = None
    is_active: bool = True


class ShippingMethodCreate(ShippingMethodBase):
    pass


class ShippingMethodResponse(ShippingMethodBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class LocalityBase(BaseModel):
    name: str
    region: Optional[str] = None
    country: str = "Chile"


class LocalityCreate(LocalityBase):
    pass


class LocalityResponse(LocalityBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ========== Generic Response ==========
class Message(BaseModel):
    message: str
