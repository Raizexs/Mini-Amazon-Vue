"""
Script to seed the database with initial data from JSON files
Run this after running migrations: python seed_data.py
"""
import json
from pathlib import Path
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Category, Product, ShippingMethod, Locality, Coupon
from datetime import datetime, timedelta

# Create all tables
from app.database import Base
Base.metadata.create_all(bind=engine)


def load_json(filename: str):
    """Load data from JSON file"""
    # Try multiple possible paths for the JSON files
    possible_paths = [
        Path("/app/frontend_data") / filename,  # Docker mounted volume
        Path(__file__).parent.parent / "frontend" / "public" / "data" / filename,  # Local dev
        Path(__file__).parent / "data" / filename,  # Fallback to backend/data
    ]
    
    for json_path in possible_paths:
        if json_path.exists():
            with open(json_path, "r", encoding="utf-8") as f:
                return json.load(f)
    
    raise FileNotFoundError(f"Could not find {filename} in any of the expected locations: {possible_paths}")


def seed_categories(db: Session):
    """Seed categories"""
    print("Seeding categories...")
    categories_data = load_json("categorias.json")
    
    for cat_name in categories_data:
        existing = db.query(Category).filter(Category.name == cat_name).first()
        if not existing:
            category = Category(name=cat_name)
            db.add(category)
    
    db.commit()
    print(f"✓ {len(categories_data)} categories seeded")


def seed_products(db: Session):
    """Seed products"""
    print("Seeding products...")
    products_data = load_json("productos.json")
    
    # Get category mapping
    categories = {cat.name: cat.id for cat in db.query(Category).all()}
    
    added = 0
    for prod_data in products_data:
        existing = db.query(Product).filter(Product.sku == prod_data["id"]).first()
        if not existing:
            categoria_id = categories.get(prod_data["categoria"])
            if not categoria_id:
                print(f"Warning: Category '{prod_data['categoria']}' not found for product {prod_data['id']}")
                continue
            
            product = Product(
                sku=prod_data["id"],
                titulo=prod_data["titulo"],
                categoria_id=categoria_id,
                marca=prod_data.get("marca"),
                precio=prod_data["precio"],
                rating=prod_data.get("rating", 0),
                stock=prod_data.get("stock", 0),
                descripcion=prod_data.get("descripcion"),
                imagenes=prod_data.get("imagenes", []),
                vendidos=prod_data.get("vendidos", 0),
                destacado=prod_data.get("destacado", False),
                specs=prod_data.get("specs", {})
            )
            db.add(product)
            added += 1
    
    db.commit()
    print(f"✓ {added} products seeded")


def seed_shipping_methods(db: Session):
    """Seed shipping methods"""
    print("Seeding shipping methods...")
    envios_data = load_json("envios.json")
    
    added = 0
    for envio in envios_data:
        existing = db.query(ShippingMethod).filter(
            ShippingMethod.name == envio["name"]
        ).first()
        
        if not existing:
            shipping = ShippingMethod(
                name=envio["name"],
                description=envio.get("name", ""),
                cost=envio["cost"],
                estimated_days="",
                is_active=True
            )
            db.add(shipping)
            added += 1
    
    db.commit()
    print(f"✓ {added} shipping methods seeded")


def seed_localities(db: Session):
    """Seed localities"""
    print("Seeding localities...")
    localities_data = load_json("localidades.json")
    
    added = 0
    for region_data in localities_data:
        region_name = region_data["region"]
        for city in region_data["cities"]:
            existing = db.query(Locality).filter(
                Locality.name == city,
                Locality.region == region_name
            ).first()
            
            if not existing:
                locality = Locality(
                    name=city,
                    region=region_name,
                    country="Chile"
                )
                db.add(locality)
                added += 1
    
    db.commit()
    print(f"✓ {added} localities seeded")


def seed_coupons(db: Session):
    """Seed coupons"""
    print("Seeding coupons...")
    coupons_data = load_json("cupones.json")
    
    added = 0
    for cup in coupons_data:
        existing = db.query(Coupon).filter(Coupon.code == cup["code"]).first()
        
        if not existing:
            # Determine discount type
            cup_type = cup.get("type", "fixed")
            if cup_type == "percent":
                discount_type = "percentage"
            else:
                discount_type = "fixed"
            
            # Skip ship type for now (not supported in current model)
            if cup_type == "ship":
                continue
            
            coupon = Coupon(
                code=cup["code"],
                description=f"Cupón de descuento {cup['code']}",
                discount_type=discount_type,
                discount_value=cup["value"],
                min_purchase=0,
                is_active=True,
                expires_at=datetime.now() + timedelta(days=90)  # Valid for 90 days
            )
            db.add(coupon)
            added += 1
    
    db.commit()
    print(f"✓ {added} coupons seeded")


def main():
    """Main seeding function"""
    print("=" * 50)
    print("Mini-Amazon Database Seeding")
    print("=" * 50)
    
    db = SessionLocal()
    
    try:
        seed_categories(db)
        seed_products(db)
        seed_shipping_methods(db)
        seed_localities(db)
        seed_coupons(db)
        
        print("=" * 50)
        print("✓ Database seeding completed successfully!")
        print("=" * 50)
    except Exception as e:
        print(f"✗ Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
