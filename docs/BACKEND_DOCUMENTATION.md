# 📘 Documentación Backend - Mini Amazon Vue

## Resumen Ejecutivo

Backend profesional para e-commerce desarrollado con **FastAPI** que implementa:

- 🔐 **Autenticación JWT** con tokens seguros
- 🔒 **Encriptación de contraseñas con bcrypt**
- 📊 Base de datos relacional con **PostgreSQL**
- 🚀 API REST con 25+ endpoints documentados

---

## 🔐 Seguridad - La Prioridad #1

### Autenticación JWT (JSON Web Tokens)

**¿Qué es JWT?**

- Sistema de autenticación **stateless** (sin sesiones en servidor)
- Token firmado criptográficamente
- Incluye información del usuario encriptada
- Imposible de falsificar sin la clave secreta

**Características de nuestra implementación:**

```python
SECRET_KEY: Clave secreta de 32+ caracteres (configurable)
ALGORITHM: HS256 (HMAC con SHA-256)
EXPIRATION: 30 minutos
```

**Flujo de Autenticación:**

```
1. Usuario → Login (email + password)
2. Backend → Valida con bcrypt
3. Backend → Genera token JWT firmado
4. Cliente → Guarda token
5. Cliente → Envía token en cada request: Authorization: Bearer <token>
6. Backend → Valida firma del token
7. Backend → Permite/Deniega acceso
```

**Ejemplo de Token:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiZXhwIjoxNzAwMDAwMDAwfQ.signature
```

### Encriptación de Contraseñas con bcrypt

**¿Por qué bcrypt?**

- ✅ **Imposible de revertir** - Es un hash unidireccional
- ✅ **Resistente a ataques** - Incluso con supercomputadoras
- ✅ **Salt automático** - Cada contraseña tiene un salt único
- ✅ **Configurable** - 12 rounds por defecto (muy seguro)

**Cómo funciona:**

```python
# Usuario registra con: "mipassword123"
# bcrypt genera:
"$2b$12$LQVz9kR5eF7xHa8KpYt5K.A7x8ZHq2Nv3Ij4mK8pL6nM9oP0qR1sT"

# Partes del hash:
$2b       → Algoritmo bcrypt versión 2b
$12       → 12 rounds (2^12 = 4096 iteraciones)
LQVz9...  → Salt generado aleatoriamente (22 caracteres)
...qR1sT  → Hash de la contraseña con el salt
```

**Proceso de Login:**

```python
1. Usuario envía: email + password en texto plano
2. Backend busca usuario por email
3. Backend obtiene hashed_password de la BD
4. bcrypt compara:
   - password ingresado
   - hashed_password almacenado
5. Si coincide → Genera JWT token
6. Si no coincide → Error 401 Unauthorized
```

**Ventajas de seguridad:**

- 🚫 Ni administradores pueden ver contraseñas reales
- 🚫 Si hackean la BD, las contraseñas son inútiles
- 🚫 Cada contraseña tiene salt único (rainbow tables inútiles)
- 🚫 Ataques de fuerza bruta son extremadamente lentos

---

## 🏗️ Arquitectura

### Stack Tecnológico

**Core:**

- FastAPI 0.115+ (Framework web Python)
- PostgreSQL 15 (Base de datos)
- SQLAlchemy 2.0 (ORM)
- Alembic (Migraciones)

**Seguridad:**

- python-jose (JWT tokens)
- passlib + bcrypt (Encriptación contraseñas)

**Deployment:**

- Docker + Docker Compose
- Uvicorn (ASGI server)

### Estructura del Proyecto

```
backend/
├── app/
│   ├── main.py              # App FastAPI principal
│   ├── config.py            # Variables de entorno
│   ├── database.py          # Conexión SQLAlchemy
│   ├── auth.py              # Utilidades JWT + bcrypt
│   ├── schemas.py           # Schemas Pydantic
│   ├── models/              # Modelos SQLAlchemy
│   │   └── __init__.py
│   └── routers/             # Endpoints organizados
│       ├── auth.py          # Login, Register, Me
│       ├── products.py      # CRUD productos
│       ├── orders.py        # Gestión pedidos
│       ├── favorites.py     # Favoritos (protegido)
│       └── reviews.py       # Reseñas
├── alembic/                 # Migraciones BD
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── seed_data.py            # Datos iniciales
```

---

## 📊 Base de Datos

### Modelo Relacional

**Entidades Principales:**

1. **User** - Usuarios con contraseñas hasheadas
2. **Product** - Catálogo de productos
3. **Category** - Categorías
4. **Order** - Pedidos de usuarios
5. **OrderItem** - Items dentro de pedidos
6. **Review** - Reseñas con rating
7. **Favorite** - Productos favoritos (requiere auth)
8. **Coupon** - Cupones de descuento
9. **ShippingMethod** - Métodos de envío
10. **Locality** - Localidades para envío

### Tabla Users (Ejemplo de Seguridad)

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,  -- ¡bcrypt hash, NO texto plano!
    full_name VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Ejemplo de datos reales:**

```
id: 1
email: "juan@ejemplo.com"
hashed_password: "$2b$12$LQVz9kR5eF7xHa8KpYt5K.A7x8ZHq2Nv3Ij4mK8pL6nM9oP0qR1sT"
full_name: "Juan Pérez"
is_active: true
```

---

## 🛣️ API Endpoints

### Autenticación (Sin protección)

#### POST `/api/auth/register`

Crear nuevo usuario

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "Usuario Ejemplo"
}
```

**Proceso interno:**

1. Valida que email no exista
2. **Hashea contraseña con bcrypt** (12 rounds)
3. Guarda usuario en BD
4. Retorna datos de usuario (sin contraseña)

**Response:** `201 Created`

```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "Usuario Ejemplo",
  "is_active": true,
  "created_at": "2025-11-04T10:30:00Z"
}
```

#### POST `/api/auth/login`

Iniciar sesión

**Request (form-data):**

```
username: user@example.com
password: password123
```

**Proceso interno:**

1. Busca usuario por email
2. **Valida contraseña con bcrypt.verify()**
3. Si válida → **Genera token JWT firmado**
4. Token incluye: email, expiración
5. Token firmado con SECRET_KEY

**Response:** `200 OK`

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### GET `/api/auth/me`

Obtener info del usuario actual

**Headers:**

```
Authorization: Bearer eyJhbGciOiJI...
```

**Proceso interno:**

1. Extrae token del header
2. **Valida firma del token con JWT**
3. Decodifica payload
4. Obtiene email del usuario
5. Busca usuario en BD
6. Retorna info (sin contraseña)

**Response:** `200 OK`

```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "Usuario Ejemplo",
  "is_active": true
}
```

### Productos (Públicos)

#### GET `/api/products`

Listar productos

**Query params opcionales:**

- `skip`: Paginación (offset)
- `limit`: Cantidad (max 100)
- `categoria`: Filtrar por categoría
- `search`: Buscar en título
- `destacado`: true/false

**Response:** Lista de productos

#### GET `/api/products/{product_id}`

Ver detalle de producto

### Favoritos (🔒 Protegidos con JWT)

#### GET `/api/favorites`

Obtener favoritos del usuario

**Requiere:** Header `Authorization: Bearer <token>`

**Proceso:**

1. JWT valida token
2. Extrae user_id del token
3. Busca favoritos WHERE user_id = token.user_id
4. Retorna solo favoritos del usuario autenticado

#### POST `/api/favorites`

Agregar producto a favoritos

**Requiere:** JWT token válido

**Request:**

```json
{
  "product_id": 5
}
```

#### DELETE `/api/favorites/{product_id}`

Eliminar de favoritos

**Requiere:** JWT token válido

### Órdenes (🔒 Protegidos con JWT)

#### GET `/api/orders`

Ver pedidos del usuario

**Requiere:** JWT token

**Retorna:** Solo órdenes del usuario autenticado

#### POST `/api/orders`

Crear nuevo pedido

**Requiere:** JWT token

**Request:**

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
  "shipping_address": "Calle 123",
  "shipping_locality": "Santiago",
  "shipping_region": "RM",
  "coupon_code": "DESCUENTO10"
}
```

**Response:** Orden creada con totales calculados

---

## 🔒 Sistema de Permisos

### Endpoints Públicos (Sin token JWT)

- `GET /api/products` - Ver productos
- `GET /api/categories` - Ver categorías
- `GET /api/reviews/product/{id}` - Ver reseñas
- `POST /api/auth/register` - Registrarse
- `POST /api/auth/login` - Login

### Endpoints Protegidos (Requieren JWT)

- `GET /api/auth/me` - Info usuario actual
- `GET /api/favorites` - Ver favoritos
- `POST /api/favorites` - Agregar favorito
- `DELETE /api/favorites/{id}` - Quitar favorito
- `GET /api/orders` - Ver mis pedidos
- `POST /api/orders` - Crear pedido
- `POST /api/reviews` - Crear reseña
- `DELETE /api/reviews/{id}` - Borrar mi reseña

### Implementación de Protección

```python
# En cada endpoint protegido:
@router.get("/favorites")
async def get_favorites(
    current_user: User = Depends(get_current_user),  # ← Valida JWT aquí
    db: Session = Depends(get_db)
):
    # current_user ya está autenticado
    favorites = db.query(Favorite).filter(
        Favorite.user_id == current_user.id
    ).all()
    return favorites
```

**Función `get_current_user`:**

```python
def get_current_user(token: str):
    try:
        # 1. Decodifica y valida firma del JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")

        # 2. Verifica expiración
        if payload.get("exp") < now():
            raise HTTPException(401, "Token expirado")

        # 3. Busca usuario en BD
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(401, "Usuario no encontrado")

        return user
    except:
        raise HTTPException(401, "Token inválido")
```

---

## 🚀 Deployment

### Con Docker Compose (Recomendado)

```bash
# Iniciar todo
docker-compose up -d

# Poblar BD
docker-compose exec backend python seed_data.py

# Ver logs
docker-compose logs -f backend
```

### Variables de Entorno Importantes

**Archivo `.env`:**

```bash
# Base de datos
DATABASE_URL=postgresql://miniamazon:password@db:5432/miniamazon

# Seguridad JWT (¡CAMBIAR EN PRODUCCIÓN!)
SECRET_KEY=tu-clave-secreta-de-32-caracteres-minimo
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
FRONTEND_URL=http://localhost:5173
```

**⚠️ IMPORTANTE:**

- Generar SECRET_KEY seguro: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- Nunca subir `.env` a Git
- En producción usar HTTPS siempre

---

## 🧪 Testing

### Probar Autenticación con curl

```bash
# 1. Registrar usuario
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123","full_name":"Test User"}'

# 2. Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@test.com&password=pass123"

# Response: {"access_token":"eyJhbG...","token_type":"bearer"}

# 3. Usar token en endpoint protegido
curl -X GET http://localhost:8000/api/favorites \
  -H "Authorization: Bearer eyJhbG..."
```

### Ver contraseñas hasheadas en BD

```bash
# Conectar a PostgreSQL
docker-compose exec db psql -U miniamazon -d miniamazon

# Ver usuarios
SELECT id, email, hashed_password FROM users;

# Ejemplo de output:
# id |      email       |                     hashed_password
# ---+------------------+--------------------------------------------------------
#  1 | test@test.com    | $2b$12$LQVz9kR5eF7xHa8KpYt5K.A7x8ZHq2...
#  2 | juan@ejemplo.com | $2b$12$xY9pL3mN8qR2sT4vW6aB7cD8eF9g...
```

---

## 📚 Documentación Interactiva

### Swagger UI

**URL:** http://localhost:8000/docs

Permite:

- ✅ Ver todos los endpoints
- ✅ Probar requests directamente
- ✅ Ver schemas de request/response
- ✅ Autenticarse con JWT (botón "Authorize")

### ReDoc

**URL:** http://localhost:8000/redoc

Documentación alternativa más limpia.

---

## 💡 Mejores Prácticas Implementadas

### Seguridad

- ✅ Contraseñas hasheadas con bcrypt (nunca texto plano)
- ✅ Tokens JWT con expiración
- ✅ Validación de tokens en cada request protegido
- ✅ SECRET_KEY en variable de entorno (no en código)
- ✅ CORS configurado para frontend específico

### Base de Datos

- ✅ Migraciones con Alembic (versionado de esquema)
- ✅ Relaciones con claves foráneas
- ✅ Índices en campos frecuentes (email, sku)
- ✅ Constraints de unicidad (email único)

### API Design

- ✅ REST conventions (GET, POST, PUT, DELETE)
- ✅ Status codes apropiados (200, 201, 401, 404, 500)
- ✅ Paginación en listados
- ✅ Filtros opcionales
- ✅ Validación con Pydantic schemas

### Code Quality

- ✅ Separación en routers por funcionalidad
- ✅ Dependency injection con FastAPI
- ✅ Type hints en Python
- ✅ Manejo de errores centralizado
- ✅ Logging para debugging

---

## 🆘 Troubleshooting

### Error 401: Token inválido

- Verifica que el token no haya expirado (30 min)
- Verifica header: `Authorization: Bearer <token>`
- Haz login nuevamente para obtener token fresco

### Error 422: Validation error

- Revisa que el body del request cumpla con el schema
- Verifica tipos de datos (string, int, bool)
- Consulta `/docs` para ver schema esperado

### No puedo hacer login

- Verifica que el email exista en BD
- La contraseña se valida con bcrypt (case-sensitive)
- Revisa logs: `docker-compose logs backend`

### Olvidé mi contraseña

- Las contraseñas hasheadas con bcrypt NO se pueden recuperar
- Necesitas implementar sistema de "reset password"
- O crear nuevo usuario

---

## 📞 Recursos Adicionales

- **Guía Rápida**: `QUICK_START.md`
- **Guía de Presentación**: `PRESENTACION_15MIN.md`
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **JWT.io**: https://jwt.io (para decodificar tokens)
- **bcrypt**: https://github.com/pyca/bcrypt

---

**Desarrollado con seguridad en mente** 🛡️
