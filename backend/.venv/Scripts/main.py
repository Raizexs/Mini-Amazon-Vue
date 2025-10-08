from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from pathlib import Path
import json, uuid, os

# ---------- Utilidades de datos ----------
DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

def load_json(name: str, default):
    p = DATA_DIR / name
    if not p.exists():
        return default
    try:
        with p.open("r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return default

def save_json(name: str, data: Any):
    p = DATA_DIR / name
    with p.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def get_products_list():
    raw = load_json("productos.json", [])
    return raw if isinstance(raw, list) else raw.get("productos", [])

def get_categories_list():
    raw = load_json("categorias.json", [])
    return raw if isinstance(raw, list) else raw.get("categorias", [])

def normalize_id(x): return str(x)

# ---------- Modelos ----------
class ReviewIn(BaseModel):
    productId: str
    autor: str = Field(..., min_length=2, max_length=60)
    rating: int = Field(..., ge=1, le=5)
    comentario: str = Field(..., min_length=2, max_length=500)

class Review(ReviewIn):
    id: str
    fecha: str

class OrderItem(BaseModel):
    id: str
    titulo: str
    qty: int = Field(..., ge=1)
    precio: int = Field(..., ge=0)

class ShippingAddress(BaseModel):
    region: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    depto: Optional[str] = None
    notes: Optional[str] = None

class ShippingMethod(BaseModel):
    id: str
    nombre: Optional[str] = None
    dias: Optional[str] = None
    costo: int = 0

class Shipping(BaseModel):
    method: Optional[ShippingMethod] = None
    free: bool = False
    address: Optional[ShippingAddress] = None
    retiro: Optional[bool] = None

class Totals(BaseModel):
    subtotal: int
    discount: int = 0
    shipping: int = 0
    iva: int
    total: int

class Customer(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str

class Payment(BaseModel):
    method: str
    last4: Optional[str] = None

class OrderIn(BaseModel):
    items: List[OrderItem]
    totals: Totals
    shipping: Shipping
    customer: Customer
    payment: Payment
    coupon: Optional[Dict[str, Any]] = None

class Order(OrderIn):
    id: str
    createdAt: str
    status: str = "created"

# ---------- App ----------
app = FastAPI(title="Mini-Amazon API", version="1.0.0")

# CORS (Vite default http://localhost:5173)
origins = os.getenv("CORS_ALLOW_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Rutas ----------
@app.get("/api/health")
def health(): return {"ok": True}

# Productos
@app.get("/api/products")
def list_products():
    return get_products_list()

@app.get("/api/products/{pid}")
def get_product(pid: str):
    pid = normalize_id(pid)
    for p in get_products_list():
        if normalize_id(p.get("id")) == pid:
            return p
    raise HTTPException(404, "Producto no encontrado")

# Categorías (o deducidas si no hay archivo)
@app.get("/api/categories")
def list_categories():
    cats = get_categories_list()
    if cats:
        return cats
    # deducir
    seen = {}
    for p in get_products_list():
        key = p.get("categoria") or p.get("catName") or "otros"
        seen[str(key)] = {"id": str(key), "name": str(key)}
    return list(seen.values())

# Reseñas
@app.get("/api/reviews")
def get_reviews(product_id: str = Query(..., alias="productId")):
    allr = load_json("reviews.json", [])
    return [r for r in allr if str(r.get("productId")) == str(product_id)]

@app.post("/api/reviews", response_model=Review)
def post_review(body: ReviewIn):
    allr = load_json("reviews.json", [])
    rev = Review(
        id=str(uuid.uuid4()),
        fecha=datetime.utcnow().isoformat(),
        **body.model_dump()
    )
    allr.insert(0, rev.model_dump())
    save_json("reviews.json", allr)
    return rev

# Envíos / Localidades / Cupones
@app.get("/api/envios")
def list_envios():
    fb = [
        {"id":"retiro","nombre":"Retiro en tienda","costo":0,"dias":"0-1 días"},
        {"id":"domicilio","nombre":"Envío a domicilio","costo":4990,"dias":"24-48h"},
    ]
    return load_json("envios.json", fb)

@app.get("/api/localidades")
def list_localidades():
    fb = { "Región Metropolitana": ["Santiago","Puente Alto","Maipú"] }
    return load_json("localidades.json", fb)

@app.get("/api/coupons/validate")
def validate_coupon(code: str):
    code = (code or "").strip().upper()
    allc = load_json("cupones.json", [])
    if not isinstance(allc, list): allc = allc.get("cupones", [])
    for c in allc:
        if str(c.get("code","")).upper() == code:
            return {"valid": True, "type": c.get("type"), "value": c.get("value")}
    # fallback de demo
    demo = {"DESC5000":("amount",5000), "DESC5":("percent",5), "ENVIOGRATIS":("free_shipping", True)}
    if code in demo:
        t,v = demo[code]
        return {"valid": True, "type": t, "value": v}
    return {"valid": False}

# Órdenes
@app.get("/api/orders", response_model=List[Order])
def list_orders():
    return load_json("orders.json", [])

@app.post("/api/orders", response_model=Order)
def create_order(body: OrderIn):
    all_orders = load_json("orders.json", [])
    order = Order(
        id="O"+datetime.utcnow().strftime("%Y%m%d%H%M%S%f"),
        createdAt=datetime.utcnow().isoformat(),
        **body.model_dump()
    )
    all_orders.insert(0, order.model_dump())
    save_json("orders.json", all_orders)
    return order