# 🎉 Mini-Amazon Backend - Configuración Completada

## ✅ Estado Actual

Tu backend está **100% funcional** y listo para usar.

### Servicios Activos

- ✅ **PostgreSQL Database**: `localhost:5432`
- ✅ **FastAPI Backend**: `http://localhost:8000`
- ✅ **Swagger Docs**: `http://localhost:8000/docs`
- ✅ **ReDoc**: `http://localhost:8000/redoc`

### Base de Datos Poblada

- ✅ **6 Categorías**: Juguetes, Libros, Moda, Hogar, Deportes, Tecnología
- ✅ **24 Productos**: Cargados desde tu JSON
- ✅ **3 Métodos de Envío**: Estándar, Express, Retiro en tienda
- ✅ **17 Localidades**: Ciudades de Chile por región
- ✅ **2 Cupones**: DESC5000 (fijo), DESC5 (porcentaje)

### ⚠️ Problema de bcrypt Resuelto

Se solucionó el error `ValueError: password cannot be longer than 72 bytes` actualizando `requirements.txt` con:

```txt
bcrypt==4.0.1
```

**Consulta la documentación completa:** [docs/BCRYPT_FIX.md](BCRYPT_FIX.md)

## 🔐 Secret Key Configurado

Tu SECRET_KEY seguro ha sido configurado correctamente:

```
SECRET_KEY=jQj1J2znqcPEmxSOJMWB9-ojUFseftNJB58OxHp-MqY
```

Este se encuentra en:

- ✅ `backend/.env` - Usado por el contenedor Docker
- ✅ `.env` (raíz) - Para docker-compose

## 🚀 Cómo Usar el Backend

### 1. Verificar que Todo Funciona

```powershell
# Verificar salud del API
Invoke-RestMethod http://localhost:8000/health

# Ver documentación
start http://localhost:8000/docs
```

### 2. Scripts de Prueba Incluidos

Se han creado 3 scripts PowerShell para facilitar las pruebas:

```powershell
# Registrar un usuario
.\test_register.ps1

# Hacer login (guarda el token en token.txt)
.\test_login.ps1

# Obtener usuario actual con el token
.\test_me.ps1
```

### 3. Registrar un Usuario

**Opción A: Usando el script** (Recomendado)

```powershell
.\test_register.ps1
```

**Opción B: Desde PowerShell Manual**

```powershell
$body = @{
    email = "tu@email.com"
    password = "tuPassword123"
    full_name = "Tu Nombre"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:8000/api/auth/register `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

**Opción C: Desde Swagger UI** (http://localhost:8000/docs)

1. Ir a POST `/api/auth/register`
2. Click en "Try it out"
3. Llenar el JSON:

```json
{
  "email": "tu@email.com",
  "password": "tuPassword123",
  "full_name": "Tu Nombre"
}
```

4. Click "Execute"

### 3. Login para Obtener Token

**Desde PowerShell:**

```powershell
$loginBody = @{
    username = "tu@email.com"
    password = "tuPassword123"
}

$response = Invoke-RestMethod -Uri http://localhost:8000/api/auth/login `
  -Method POST `
  -Body $loginBody `
  -ContentType "application/x-www-form-urlencoded"

$token = $response.access_token
Write-Host "Tu Token JWT: $token"
```

**Desde Swagger:**

1. Ir a POST `/api/auth/login`
2. Click en "Try it out"
3. Ingresar email en `username` y password
4. Click "Execute"
5. Copiar el `access_token`
6. Click en el botón "Authorize" (🔓 arriba a la derecha)
7. Pegar: `Bearer <tu-token>`
8. Ahora puedes usar todos los endpoints protegidos 🔒

### 4. Probar Endpoints

**Listar Productos (público):**

```powershell
Invoke-RestMethod http://localhost:8000/api/products
```

**Listar Categorías:**

```powershell
Invoke-RestMethod http://localhost:8000/api/categories
```

**Ver Favoritos (requiere auth):**

```powershell
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri http://localhost:8000/api/favorites -Headers $headers
```

**Crear una Orden (requiere auth):**

```powershell
$headers = @{ Authorization = "Bearer $token" }
$orderBody = @{
    items = @(
        @{
            product_id = 1
            quantity = 1
            price = 59990
        }
    )
    shipping_method = "Envío estándar (48–72h)"
    shipping_address = "Calle Falsa 123"
    shipping_locality = "Santiago"
    shipping_region = "Región Metropolitana de Santiago"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri http://localhost:8000/api/orders `
  -Method POST `
  -Headers $headers `
  -Body $orderBody `
  -ContentType "application/json"
```

## 📚 Documentación Disponible

1. **Swagger UI (Interactivo)**: http://localhost:8000/docs

   - Prueba todos los endpoints directamente desde el navegador
   - Incluye autenticación JWT integrada

2. **ReDoc**: http://localhost:8000/redoc

   - Documentación más legible y detallada

3. **Guía Técnica Completa**: `docs/BACKEND_DOCUMENTATION.md`

   - Arquitectura del sistema
   - Modelo de datos con diagramas
   - Todos los endpoints explicados
   - Ejemplos de uso

4. **Inicio Rápido**: `docs/QUICK_START.md`

   - Comandos rápidos
   - Troubleshooting

5. **Resumen Ejecutivo**: `docs/IMPLEMENTATION_SUMMARY.md`
   - Cumplimiento de requisitos
   - Checklist de entrega

## 🐳 Comandos Docker Útiles

```powershell
# Ver logs en tiempo real
docker-compose logs -f backend

# Reiniciar backend
docker-compose restart backend

# Detener todo
docker-compose down

# Iniciar todo
docker-compose up -d

# Ver estado de contenedores
docker-compose ps

# Acceder a la base de datos
docker-compose exec db psql -U miniamazon -d miniamazon
```

## 🔧 Comandos de Base de Datos

**Desde PostgreSQL (dentro del contenedor):**

```powershell
# Entrar a PostgreSQL
docker-compose exec db psql -U miniamazon -d miniamazon

# Dentro de psql:
\dt                                    # Ver tablas
\d+ products                           # Ver estructura de tabla
SELECT * FROM products LIMIT 5;        # Ver productos
SELECT * FROM categories;              # Ver categorías
SELECT * FROM users;                   # Ver usuarios
\q                                     # Salir
```

**Desde PowerShell:**

```powershell
# Ver cantidad de productos
docker-compose exec db psql -U miniamazon -d miniamazon -c "SELECT COUNT(*) FROM products;"

# Ver categorías
docker-compose exec db psql -U miniamazon -d miniamazon -c "SELECT * FROM categories;"
```

## 🎯 Endpoints Principales

### Públicos (sin autenticación)

- `GET /` - Info de la API
- `GET /health` - Health check
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Login (obtener JWT)
- `GET /api/products` - Listar productos
- `GET /api/products/{id}` - Ver producto
- `GET /api/products/sku/{sku}` - Producto por SKU
- `GET /api/categories` - Listar categorías
- `GET /api/reviews/product/{id}` - Reviews de producto

### Protegidos 🔒 (requieren JWT)

- `GET /api/auth/me` - Info usuario actual
- `POST /api/products` - Crear producto
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto
- `POST /api/reviews` - Crear review
- `DELETE /api/reviews/{id}` - Eliminar review
- `GET /api/favorites` - Listar favoritos
- `POST /api/favorites` - Agregar favorito
- `DELETE /api/favorites/{id}` - Eliminar favorito
- `GET /api/orders` - Listar órdenes
- `GET /api/orders/{id}` - Ver orden
- `POST /api/orders` - Crear orden
- `PATCH /api/orders/{id}/status` - Actualizar estado orden

## 📊 Datos de Prueba

### Usuarios

Ninguno inicialmente - debes registrarte tú mismo

### Productos

24 productos disponibles en varias categorías

### Cupones Disponibles

- `DESC5000` - Descuento fijo de $5,000
- `DESC5` - Descuento del 5%

### Métodos de Envío

- "Envío estándar (48–72h)" - $2,990
- "Envío express (24–48h)" - $7,990
- "Retiro en tienda" - Gratis

## ⚠️ Importante

### En Desarrollo

- El SECRET_KEY actual es seguro para desarrollo
- Los contenedores están configurados con `--reload` para hot-reloading

### Para Producción

1. Cambiar SECRET_KEY por uno nuevo
2. Usar variables de entorno más seguras
3. Configurar HTTPS
4. Ajustar CORS para el dominio de producción
5. Usar `--workers 4` en lugar de `--reload`

## 🔄 Próximo Paso: Integrar con Frontend

El backend está **100% funcional**. Para conectarlo con tu frontend Vue:

1. Crear servicio API en `frontend/src/services/api.js`
2. Implementar manejo de autenticación
3. Actualizar componentes para consumir endpoints
4. Gestionar tokens JWT en localStorage

Si necesitas ayuda con la integración del frontend, ¡solo pregúntame!

## 🎉 ¡Felicitaciones!

Has configurado exitosamente:

✅ Backend FastAPI completo
✅ Base de datos PostgreSQL
✅ Autenticación JWT con bcrypt
✅ 30+ endpoints RESTful
✅ Migraciones con Alembic
✅ Dockerización completa
✅ Documentación automática
✅ Secret key seguro configurado

**Todo está listo para usar** 🚀

---

**Fecha**: 3 de Noviembre, 2025
**Estado**: ✅ OPERACIONAL
