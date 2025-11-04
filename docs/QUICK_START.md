# Mini-Amazon - Guía de Inicio Rápido

## 🚀 Inicio Rápido (5 minutos)

### Paso 1: Levantar Backend con Docker

```powershell
# Navegar al directorio del proyecto
cd C:\Users\Ryzek\Mini-Amazon-Vue\Mini-Amazon-Vue

# Iniciar servicios (PostgreSQL + FastAPI)
docker-compose up -d

# Verificar que los servicios estén corriendo
docker-compose ps
```

Deberías ver:

- `miniamazon-db` (PostgreSQL) - Estado: Up
- `miniamazon-backend` (FastAPI) - Estado: Up

### Paso 2: Poblar la Base de Datos

```powershell
# Ejecutar script de inicialización
docker-compose exec backend python seed_data.py
```

Esto cargará:

- ✅ Categorías (Juguetes, Libros, Moda, etc.)
- ✅ Productos (desde frontend/public/data/productos.json)
- ✅ Métodos de envío
- ✅ Localidades
- ✅ Cupones de descuento

### Paso 3: Verificar API

```powershell
# Verificar que la API esté respondiendo
curl http://localhost:8000/health

# Abrir documentación interactiva en el navegador
start http://localhost:8000/docs
```

### Paso 4: Iniciar Frontend

```powershell
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias (solo primera vez)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Frontend disponible en: **http://localhost:5173**

---

## ✅ Verificación Completa

### 1. Backend (FastAPI)

- [ ] API: http://localhost:8000
- [ ] Health: http://localhost:8000/health
- [ ] Swagger Docs: http://localhost:8000/docs
- [ ] ReDoc: http://localhost:8000/redoc

### 2. Base de Datos (PostgreSQL)

- [ ] Puerto: 5432
- [ ] Database: miniamazon
- [ ] User: miniamazon

```powershell
# Conectar a PostgreSQL
docker-compose exec db psql -U miniamazon -d miniamazon

# Verificar tablas
\dt

# Ver productos
SELECT id, sku, titulo, precio FROM products LIMIT 5;
```

### 3. Frontend (Vue)

- [ ] App: http://localhost:5173
- [ ] Catálogo funciona
- [ ] Productos se visualizan

---

## 🧪 Probar la API

### Registrar Usuario

```powershell
# PowerShell
$body = @{
    email = "test@example.com"
    password = "password123"
    full_name = "Usuario Test"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:8000/api/auth/register `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

### Login y Obtener Token

```powershell
$loginBody = @{
    username = "test@example.com"
    password = "password123"
}

$response = Invoke-RestMethod -Uri http://localhost:8000/api/auth/login `
  -Method POST `
  -Body $loginBody `
  -ContentType "application/x-www-form-urlencoded"

$token = $response.access_token
Write-Host "Token: $token"
```

### Ver Productos

```powershell
Invoke-RestMethod -Uri http://localhost:8000/api/products?limit=5
```

### Crear Orden (Requiere Token)

```powershell
$headers = @{
    Authorization = "Bearer $token"
}

$orderBody = @{
    items = @(
        @{
            product_id = 1
            quantity = 1
            price = 59990
        }
    )
    shipping_method = "Envío Estándar"
    shipping_address = "Calle Falsa 123"
    shipping_locality = "Santiago"
    shipping_region = "RM"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri http://localhost:8000/api/orders `
  -Method POST `
  -Headers $headers `
  -Body $orderBody `
  -ContentType "application/json"
```

---

## 🔧 Comandos Útiles

### Docker

```powershell
# Ver logs del backend
docker-compose logs -f backend

# Ver logs de la base de datos
docker-compose logs -f db

# Reiniciar servicios
docker-compose restart

# Detener servicios
docker-compose down

# Detener y eliminar todo (incluyendo volúmenes)
docker-compose down -v
```

### Migraciones

```powershell
# Ver estado de migraciones
docker-compose exec backend alembic current

# Ver historial
docker-compose exec backend alembic history

# Aplicar migraciones
docker-compose exec backend alembic upgrade head

# Crear nueva migración
docker-compose exec backend alembic revision --autogenerate -m "descripcion"
```

### Base de Datos

```powershell
# Backup de la base de datos
docker-compose exec db pg_dump -U miniamazon miniamazon > backup.sql

# Restaurar backup
Get-Content backup.sql | docker-compose exec -T db psql -U miniamazon -d miniamazon

# Consultas SQL directas
docker-compose exec db psql -U miniamazon -d miniamazon -c "SELECT COUNT(*) FROM products;"
```

---

## 🐛 Troubleshooting

### Problema: Puerto 8000 ya en uso

```powershell
# Encontrar el proceso
netstat -ano | findstr :8000

# Matar el proceso (reemplaza PID)
taskkill /PID <pid> /F
```

### Problema: Docker no inicia

```powershell
# Verificar Docker Desktop está corriendo
docker version

# Reiniciar Docker Desktop
# O reiniciar servicio desde la bandeja del sistema
```

### Problema: Base de datos no conecta

```powershell
# Verificar que el contenedor está corriendo
docker-compose ps

# Ver logs
docker-compose logs db

# Reiniciar solo la base de datos
docker-compose restart db
```

### Problema: Frontend no conecta con Backend

1. Verificar que backend esté en http://localhost:8000
2. Verificar CORS en `backend/app/main.py`
3. Verificar console del navegador para errores

---

## 📊 Datos de Prueba

Después de ejecutar `seed_data.py`, tendrás:

### Usuarios

Ninguno inicialmente - debes registrarte

### Productos

~25 productos de ejemplo en varias categorías

### Categorías

- Juguetes
- Libros
- Moda
- Hogar
- Deportes
- Tecnología

### Cupones

- `DESCUENTO10`: 10% de descuento
- `BIENVENIDA20`: 20% de descuento
- Y más...

---

## 📝 Próximos Pasos

1. ✅ Backend funcionando
2. ✅ Base de datos poblada
3. ✅ Frontend corriendo
4. ⏭️ Integrar frontend con backend (ver próxima guía)
5. ⏭️ Implementar autenticación en el frontend
6. ⏭️ Conectar carrito y checkout con API

---

## 📚 Documentación Adicional

- **Documentación completa del Backend**: `docs/BACKEND_DOCUMENTATION.md`
- **API Interactive Docs**: http://localhost:8000/docs
- **Modelo de datos**: Ver diagramas en la documentación

---

## 💡 Tips

- Usa **Swagger UI** (http://localhost:8000/docs) para probar endpoints interactivamente
- Los logs de Docker son tu amigo: `docker-compose logs -f`
- Mantén un terminal abierto con los logs del backend mientras desarrollas
- Usa Postman o Thunder Client (VS Code) para probar la API

---

**¡Listo!** Ahora tienes un backend completo funcionando. 🎉
