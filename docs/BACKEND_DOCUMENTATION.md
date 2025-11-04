# Mini-Amazon Backend - Documentación Técnica

## Índice

1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Modelo de Datos](#modelo-de-datos)
4. [Seguridad y Autenticación](#seguridad-y-autenticación)
5. [API Endpoints](#api-endpoints)
6. [Instalación y Despliegue](#instalación-y-despliegue)
7. [Uso de la API](#uso-de-la-api)
8. [Migraciones de Base de Datos](#migraciones-de-base-de-datos)

---

## Introducción

Mini-Amazon Backend es una API REST desarrollada con **FastAPI** que proporciona funcionalidad completa de e-commerce, incluyendo autenticación de usuarios, gestión de productos, carrito de compras, procesamiento de órdenes y sistema de reviews.

### Características Principales

- ✅ **Autenticación JWT** con tokens seguros
- ✅ **Encriptación de contraseñas** con bcrypt
- ✅ **Base de datos relacional** con PostgreSQL
- ✅ **Migraciones automáticas** con Alembic
- ✅ **Documentación interactiva** con Swagger UI
- ✅ **Dockerización completa** con Docker Compose
- ✅ **CORS configurado** para integración con frontend

### Stack Tecnológico

- **Framework**: FastAPI 0.115+
- **Base de datos**: PostgreSQL 15
- **ORM**: SQLAlchemy 2.0
- **Migraciones**: Alembic 1.14
- **Autenticación**: JWT (python-jose)
- **Encriptación**: bcrypt (passlib)
- **Servidor**: Uvicorn
- **Containerización**: Docker & Docker Compose

---

## Arquitectura del Sistema

### Estructura de Directorios

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Aplicación FastAPI principal
│   ├── config.py            # Configuración y variables de entorno
│   ├── database.py          # Configuración de SQLAlchemy
│   ├── auth.py              # Utilidades de autenticación JWT
│   ├── schemas.py           # Schemas Pydantic
│   ├── models/
│   │   └── __init__.py      # Modelos SQLAlchemy
│   └── routers/
│       ├── __init__.py
│       ├── auth.py          # Endpoints de autenticación
│       ├── products.py      # Endpoints de productos
│       ├── categories.py    # Endpoints de categorías
│       ├── reviews.py       # Endpoints de reviews
│       ├── favorites.py     # Endpoints de favoritos
│       └── orders.py        # Endpoints de órdenes
├── alembic/
│   ├── versions/            # Migraciones de base de datos
│   └── env.py              # Configuración de Alembic
├── alembic.ini             # Configuración de Alembic
├── main.py                 # Punto de entrada
├── requirements.txt        # Dependencias Python
├── Dockerfile              # Imagen Docker
├── .env.example            # Variables de entorno ejemplo
├── .env                    # Variables de entorno (no en git)
└── seed_data.py           # Script de inicialización de datos
```

### Flujo de Peticiones

```
Cliente (Frontend)
    ↓
CORS Middleware
    ↓
FastAPI Router
    ↓
Authentication Dependency (si requerido)
    ↓
Endpoint Handler
    ↓
SQLAlchemy ORM
    ↓
PostgreSQL Database
```

---

## Modelo de Datos

### Diagrama Entidad-Relación

```
┌──────────────┐         ┌──────────────┐
│    User      │         │   Category   │
├──────────────┤         ├──────────────┤
│ id (PK)      │         │ id (PK)      │
│ email        │         │ name         │
│ hashed_pwd   │         │ description  │
│ full_name    │         └──────┬───────┘
│ is_active    │                │
│ created_at   │                │
└──────┬───────┘                │
       │                        │
       │ 1:N          N:1       │
       │                        │
┌──────┴───────┐         ┌──────┴───────┐
│    Order     │         │   Product    │
├──────────────┤         ├──────────────┤
│ id (PK)      │    ┌────│ id (PK)      │
│ user_id (FK) │    │    │ sku          │
│ order_number │    │    │ titulo       │
│ status       │    │    │ categoria_id │
│ subtotal     │    │    │ marca        │
│ shipping_cost│    │    │ precio       │
│ discount     │    │    │ rating       │
│ total        │    │    │ stock        │
│ coupon_code  │    │    │ descripcion  │
│ ...          │    │    │ imagenes     │
└──────┬───────┘    │    │ vendidos     │
       │            │    │ destacado    │
       │ 1:N        │    │ specs        │
       │            │    └──────┬───────┘
┌──────┴───────┐   │           │
│  OrderItem   │   │           │ 1:N
├──────────────┤   │           │
│ id (PK)      │   │    ┌──────┴───────┐
│ order_id (FK)│───┘    │    Review    │
│ product_id   │────────│──────────────│
│ quantity     │    N:1 │ id (PK)      │
│ price        │        │ product_id   │
└──────────────┘        │ user_id (FK) │
                        │ rating       │
┌──────────────┐        │ comment      │
│   Favorite   │        │ created_at   │
├──────────────┤        └──────────────┘
│ id (PK)      │
│ user_id (FK) │───┐    ┌──────────────┐
│ product_id   │───┼────│    Coupon    │
└──────────────┘   │    ├──────────────┤
                   │    │ id (PK)      │
┌──────────────┐   │    │ code         │
│ShippingMethod│   │    │ discount_type│
├──────────────┤   │    │ discount_val │
│ id (PK)      │   │    │ min_purchase │
│ name         │   │    │ is_active    │
│ description  │   │    │ expires_at   │
│ cost         │   │    └──────────────┘
│ estimated_dys│   │
└──────────────┘   │    ┌──────────────┐
                   └────│   Locality   │
                        ├──────────────┤
                        │ id (PK)      │
                        │ name         │
                        │ region       │
                        │ country      │
                        └──────────────┘
```

### Descripción de Entidades

#### **User** (Usuario)

- Almacena información de usuarios registrados
- Contraseñas hasheadas con bcrypt
- Relaciones: Orders (1:N), Reviews (1:N), Favorites (1:N)

#### **Category** (Categoría)

- Categorías de productos
- Relación: Products (1:N)

#### **Product** (Producto)

- Información completa de productos
- Incluye imágenes (JSON array), specs (JSON object)
- Relaciones: Category (N:1), Reviews (1:N), OrderItems (1:N), Favorites (1:N)

#### **Review** (Reseña)

- Reviews de productos por usuarios
- Rating de 1-5 estrellas
- Relaciones: User (N:1), Product (N:1)

#### **Order** (Orden/Pedido)

- Pedidos de usuarios
- Incluye información de envío y pagos
- Estados: pending, confirmed, shipped, delivered, cancelled
- Relaciones: User (N:1), OrderItems (1:N)

#### **OrderItem** (Ítem de Orden)

- Líneas de productos en una orden
- Almacena precio al momento de compra
- Relaciones: Order (N:1), Product (N:1)

#### **Favorite** (Favorito)

- Productos favoritos de usuarios
- Relaciones: User (N:1), Product (N:1)

#### **Coupon** (Cupón)

- Cupones de descuento
- Tipos: percentage (porcentaje) o fixed (monto fijo)
- Validación de fecha de expiración y compra mínima

#### **ShippingMethod** (Método de Envío)

- Opciones de envío disponibles
- Incluye costo y tiempo estimado

#### **Locality** (Localidad)

- Localidades/comunas para envío
- Asociadas a regiones

---

## Seguridad y Autenticación

### Sistema de Autenticación JWT

#### Flujo de Registro

1. Usuario envía email y contraseña al endpoint `/api/auth/register`
2. Sistema valida que el email no exista
3. Contraseña se hashea con bcrypt (12 rounds)
4. Usuario se crea en la base de datos
5. Se retorna información del usuario (sin contraseña)

#### Flujo de Login

1. Usuario envía credenciales a `/api/auth/login`
2. Sistema valida email y contraseña
3. Se genera JWT token con expiración de 30 minutos
4. Token se retorna al cliente
5. Cliente incluye token en header `Authorization: Bearer <token>`

#### Protección de Endpoints

```python
# Endpoint protegido ejemplo
@router.get("/favorites")
async def get_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # current_user es el usuario autenticado
    favorites = db.query(Favorite).filter(
        Favorite.user_id == current_user.id
    ).all()
    return favorites
```

### Encriptación de Contraseñas

- **Algoritmo**: bcrypt
- **Rounds**: 12 (por defecto en passlib)
- **Salt**: Generado automáticamente por bcrypt
- **Nunca** se almacenan contraseñas en texto plano

### Configuración JWT

```python
# En .env
SECRET_KEY=your-secret-key-minimum-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

⚠️ **IMPORTANTE**: Cambiar `SECRET_KEY` en producción a un valor aleatorio seguro.

**Generar una clave segura de 32 caracteres:**

```powershell
# PowerShell (Windows)
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Bash/Linux/Mac
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## API Endpoints

### Base URL

```
http://localhost:8000
```

### Documentación Interactiva

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Autenticación

#### POST `/api/auth/register`

Registrar nuevo usuario

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "full_name": "Juan Pérez"
}
```

**Response:** `201 Created`

```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "Juan Pérez",
  "is_active": true,
  "created_at": "2025-11-03T10:30:00Z"
}
```

#### POST `/api/auth/login`

Iniciar sesión

**Request Body (Form Data):**

```
username: user@example.com
password: securepassword123
```

**Response:** `200 OK`

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### GET `/api/auth/me`

Obtener información del usuario actual (🔒 requiere autenticación)

**Headers:**

```
Authorization: Bearer <token>
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "Juan Pérez",
  "is_active": true,
  "created_at": "2025-11-03T10:30:00Z"
}
```

### Productos

#### GET `/api/products`

Listar productos con filtros opcionales

**Query Parameters:**

- `skip`: Offset para paginación (default: 0)
- `limit`: Límite de resultados (default: 100, max: 100)
- `categoria`: Filtrar por nombre de categoría
- `search`: Buscar en título de producto
- `destacado`: Filtrar productos destacados (true/false)

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "sku": "SKU-1001",
    "titulo": "Sesshōmaru (Figura de colección 15 cm)",
    "categoria_id": 1,
    "marca": "Inuyasha",
    "precio": 59990,
    "rating": 5.0,
    "stock": 0,
    "descripcion": "Figura coleccionable...",
    "imagenes": ["img/prod1001-1.png"],
    "vendidos": 120,
    "destacado": true,
    "specs": { "Tipo": "Figura de colección" },
    "created_at": "2025-11-03T10:30:00Z"
  }
]
```

#### GET `/api/products/{product_id}`

Obtener producto por ID

**Response:** `200 OK` (mismo formato que arriba)

#### GET `/api/products/sku/{sku}`

Obtener producto por SKU

#### POST `/api/products`

Crear producto (🔒 requiere autenticación)

**Request Body:**

```json
{
  "sku": "SKU-1050",
  "titulo": "Nuevo Producto",
  "categoria_id": 1,
  "marca": "Marca",
  "precio": 29990,
  "stock": 50,
  "descripcion": "Descripción del producto",
  "imagenes": ["img/prod.png"],
  "destacado": false,
  "specs": {}
}
```

#### PUT `/api/products/{product_id}`

Actualizar producto (🔒 requiere autenticación)

#### DELETE `/api/products/{product_id}`

Eliminar producto (🔒 requiere autenticación)

### Categorías

#### GET `/api/categories`

Listar todas las categorías

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "name": "Juguetes",
    "description": null,
    "created_at": "2025-11-03T10:30:00Z"
  }
]
```

#### POST `/api/categories`

Crear categoría

### Reviews

#### GET `/api/reviews/product/{product_id}`

Obtener reviews de un producto

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "product_id": 1,
    "user_id": 1,
    "rating": 5,
    "comment": "Excelente producto",
    "created_at": "2025-11-03T10:30:00Z"
  }
]
```

#### POST `/api/reviews`

Crear review (🔒 requiere autenticación)

**Request Body:**

```json
{
  "product_id": 1,
  "rating": 5,
  "comment": "Excelente producto"
}
```

#### DELETE `/api/reviews/{review_id}`

Eliminar review (🔒 requiere autenticación, solo propia)

### Favoritos

#### GET `/api/favorites`

Obtener favoritos del usuario (🔒 requiere autenticación)

#### POST `/api/favorites`

Agregar a favoritos (🔒 requiere autenticación)

**Request Body:**

```json
{
  "product_id": 1
}
```

#### DELETE `/api/favorites/{product_id}`

Eliminar de favoritos (🔒 requiere autenticación)

### Órdenes

#### GET `/api/orders`

Listar órdenes del usuario (🔒 requiere autenticación)

#### GET `/api/orders/{order_id}`

Obtener orden específica (🔒 requiere autenticación)

#### POST `/api/orders`

Crear nueva orden (🔒 requiere autenticación)

**Request Body:**

```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 59990
    }
  ],
  "shipping_method": "Envío Estándar",
  "shipping_address": "Calle Falsa 123",
  "shipping_locality": "Santiago",
  "shipping_region": "Región Metropolitana",
  "coupon_code": "DESCUENTO10"
}
```

**Response:** `201 Created`

```json
{
  "id": 1,
  "user_id": 1,
  "order_number": "ORD-20251103103000-ABC123",
  "status": "pending",
  "subtotal": 119980,
  "shipping_cost": 0,
  "discount": 11998,
  "total": 107982,
  "coupon_code": "DESCUENTO10",
  "items": [...],
  "created_at": "2025-11-03T10:30:00Z"
}
```

#### PATCH `/api/orders/{order_id}/status`

Actualizar estado de orden (🔒 requiere autenticación)

**Request Body:**

```json
{
  "status": "confirmed"
}
```

Estados válidos: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`

---

## Instalación y Despliegue

### Opción 1: Docker Compose (Recomendado)

#### Requisitos

- Docker Desktop
- Docker Compose

#### Pasos

1. **Clonar el repositorio**

```bash
git clone <repo-url>
cd Mini-Amazon-Vue
```

2. **Configurar variables de entorno**

```bash
# Copiar archivo de ejemplo
cp backend/.env.example backend/.env

# Editar .env y cambiar SECRET_KEY
```

3. **Iniciar servicios**

```bash
docker-compose up -d
```

4. **Verificar servicios**

```bash
docker-compose ps
```

Deberías ver:

- `miniamazon-db` (PostgreSQL) en puerto 5432
- `miniamazon-backend` (FastAPI) en puerto 8000

5. **Verificar API**

```bash
curl http://localhost:8000/health
```

Respuesta esperada:

```json
{ "status": "healthy", "service": "mini-amazon-api" }
```

6. **Poblar base de datos**

```bash
docker-compose exec backend python seed_data.py
```

7. **Acceder a documentación**

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

#### Comandos Útiles

```bash
# Ver logs
docker-compose logs -f backend

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (¡cuidado! borra la BD)
docker-compose down -v

# Reconstruir imágenes
docker-compose build

# Ejecutar migraciones manualmente
docker-compose exec backend alembic upgrade head

# Acceder a shell de PostgreSQL
docker-compose exec db psql -U miniamazon -d miniamazon
```

### Opción 2: Instalación Local

#### Requisitos

- Python 3.11+
- PostgreSQL 15+
- pip

#### Pasos

1. **Instalar PostgreSQL**

- Descargar e instalar desde https://www.postgresql.org/download/
- Crear base de datos:

```sql
CREATE DATABASE miniamazon;
CREATE USER miniamazon WITH PASSWORD 'miniamazon123';
GRANT ALL PRIVILEGES ON DATABASE miniamazon TO miniamazon;
```

2. **Configurar Python**

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Windows CMD:
.\venv\Scripts\activate.bat
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

3. **Configurar variables de entorno**

```bash
cp .env.example .env
# Editar .env con configuración local
```

Ejemplo `.env` local:

```
DATABASE_URL=postgresql://miniamazon:miniamazon123@localhost:5432/miniamazon
SECRET_KEY=your-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:5173
API_HOST=0.0.0.0
API_PORT=8000
```

4. **Ejecutar migraciones**

```bash
alembic upgrade head
```

5. **Poblar base de datos**

```bash
python seed_data.py
```

6. **Iniciar servidor**

```bash
# Desarrollo (con hot-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Producción
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

7. **Verificar**

- API: http://localhost:8000
- Docs: http://localhost:8000/docs

---

## Uso de la API

### Ejemplo: Flujo Completo de Usuario

#### 1. Registro de Usuario

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123",
    "full_name": "Juan Pérez"
  }'
```

#### 2. Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=juan@example.com&password=password123"
```

Respuesta:

```json
{
  "access_token": "eyJhbGciOiJI...",
  "token_type": "bearer"
}
```

#### 3. Ver Productos

```bash
curl http://localhost:8000/api/products?categoria=Juguetes
```

#### 4. Agregar a Favoritos

```bash
curl -X POST http://localhost:8000/api/favorites \
  -H "Authorization: Bearer eyJhbGciOiJI..." \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1}'
```

#### 5. Crear Orden

```bash
curl -X POST http://localhost:8000/api/orders \
  -H "Authorization: Bearer eyJhbGciOiJI..." \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "product_id": 1,
        "quantity": 1,
        "price": 59990
      }
    ],
    "shipping_method": "Envío Estándar",
    "shipping_address": "Calle Falsa 123",
    "shipping_locality": "Santiago",
    "shipping_region": "RM",
    "coupon_code": "DESCUENTO10"
  }'
```

#### 6. Ver Órdenes

```bash
curl http://localhost:8000/api/orders \
  -H "Authorization: Bearer eyJhbGciOiJI..."
```

---

## Migraciones de Base de Datos

### ¿Qué es Alembic?

Alembic es una herramienta de migraciones de base de datos para SQLAlchemy. Permite:

- Versionado de esquemas de BD
- Aplicar cambios de forma incremental
- Rollback de migraciones
- Generación automática de migraciones

### Comandos Comunes

#### Crear nueva migración (manual)

```bash
alembic revision -m "add user table"
```

Esto crea un archivo en `alembic/versions/` donde puedes definir upgrade() y downgrade().

#### Crear migración automática

```bash
alembic revision --autogenerate -m "add product specs column"
```

Alembic detecta cambios en modelos y genera la migración automáticamente.

#### Aplicar migraciones

```bash
# Aplicar todas las migraciones pendientes
alembic upgrade head

# Aplicar hasta una revisión específica
alembic upgrade <revision_id>

# Aplicar una migración adelante
alembic upgrade +1
```

#### Revertir migraciones

```bash
# Revertir última migración
alembic downgrade -1

# Revertir hasta una revisión
alembic downgrade <revision_id>

# Revertir todas
alembic downgrade base
```

#### Ver historial

```bash
# Ver migraciones actuales
alembic current

# Ver historial
alembic history

# Ver migraciones pendientes
alembic history --indicate-current
```

### Estructura de Migración

Archivo generado: `alembic/versions/xxxx_description.py`

```python
"""add product specs column

Revision ID: 123abc
Revises: 456def
Create Date: 2025-11-03 10:30:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = '123abc'
down_revision = '456def'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Aplicar cambios
    op.add_column('products',
        sa.Column('specs', sa.JSON(), nullable=True)
    )

def downgrade() -> None:
    # Revertir cambios
    op.drop_column('products', 'specs')
```

### Workflow de Desarrollo

1. **Modificar modelos** en `app/models/`
2. **Generar migración**: `alembic revision --autogenerate -m "descripcion"`
3. **Revisar migración** generada en `alembic/versions/`
4. **Aplicar**: `alembic upgrade head`
5. **Commit** del archivo de migración

### Buenas Prácticas

✅ **SÍ hacer:**

- Revisar migraciones autogeneradas antes de aplicar
- Usar mensajes descriptivos
- Probar downgrade antes de hacer commit
- Mantener migraciones pequeñas y focalizadas
- Hacer commit de archivos de migración

❌ **NO hacer:**

- Modificar migraciones ya aplicadas en producción
- Borrar archivos de migración
- Aplicar migraciones directamente en producción sin probar

---

## Troubleshooting

### Problema: Puerto 8000 ya en uso

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <pid> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

### Problema: Base de datos no conecta

1. Verificar que PostgreSQL esté corriendo
2. Verificar credenciales en `.env`
3. Verificar que la base de datos exista

```bash
# En Docker
docker-compose exec db psql -U miniamazon -d miniamazon

# Local
psql -U miniamazon -d miniamazon
```

### Problema: Migraciones fallan

```bash
# Ver estado actual
alembic current

# Ver historial
alembic history

# Marcar como aplicada manualmente (¡cuidado!)
alembic stamp head
```

### Problema: Dependencias no se instalan

```bash
# Limpiar caché de pip
pip cache purge

# Reinstalar
pip install --no-cache-dir -r requirements.txt
```

---

## Próximos Pasos y Mejoras

### Funcionalidades Futuras

- [ ] Sistema de notificaciones por email
- [ ] Paginación mejorada con cursores
- [ ] Búsqueda full-text en productos
- [ ] Sistema de recomendaciones
- [ ] Dashboard de administración
- [ ] Integración con pasarelas de pago
- [ ] Sistema de inventario avanzado
- [ ] Reportes y analytics

### Optimizaciones

- [ ] Cache con Redis
- [ ] Búsqueda con Elasticsearch
- [ ] CDN para imágenes
- [ ] Rate limiting
- [ ] Monitoring con Prometheus
- [ ] Logs centralizados

---

## Contacto y Soporte

Para preguntas o soporte:

- Documentación API: http://localhost:8000/docs
- Issues: [GitHub Issues]
- Email: soporte@miniamazon.com

---

**Fecha de última actualización**: 3 de Noviembre, 2025
**Versión del documento**: 1.0
**Versión de la API**: 1.0.0
