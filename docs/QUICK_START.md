# 🚀 Mini Amazon Vue - Guía de Inicio Rápido# 🚀 Mini Amazon Vue - Guía Súper Simple

> Aprende a iniciar el proyecto en **menos de 10 minutos**> **Para principiantes**: Esta guía te ayudará a iniciar el proyecto en menos de 10 minutos

---

## 📖 ¿Qué es esto?**Mini Amazon Vue** es una plataforma e-commerce completa y segura con:

Paso 1: Levantar Backend con Docker

Una **tienda online** con:

- 🛒 Catálogo de productos---

- 🔐 Login **SEGURO** (JWT + bcrypt)

- 💳 Carrito de compras## 📖 ¿Qué es esto?- 🛒 Catálogo de productos con búsqueda y filtros

- ⭐ Favoritos y pedidos

Es una **tienda online** (como Amazon) con:- 🔐 **Autenticación segura con JWT y contraseñas encriptadas con bcrypt**```powershell

---

- 🛒 Catálogo de productos

## 🔐 Seguridad (Lo más importante!)- 👤 Registro e inicio de sesión **SEGURO**- 💳 Carrito de compras y proceso de checkout# Navegar al directorio del proyecto

- 💳 Carrito de compras

### 🔒 Contraseñas con bcrypt- ⭐ Favoritos y reseñas- ⭐ Sistema de favoritos y reseñascd C:\Users\Ryzek\Mini-Amazon-Vue\Mini-Amazon-Vue

```- 📦 Pedidos

✅ Nunca se guardan tal cual- 📦 Gestión de pedidos

✅ Se encriptan (imposible descifrar)

✅ Ni admins ven tu contraseña---



Ejemplo:# Iniciar servicios (PostgreSQL + FastAPI)

Escribes:  "mipassword123"

Se guarda: "$2b$12$xYz9...aB7cD8"## 🔐 ¿Por qué es SEGURO?

```

---docker-compose up -d

### 🎫 JWT (Token de login)

`````### 🔒 Contraseñas Protegidas (bcrypt)

1. Haces login → Sistema verifica contraseña

2. Recibes un "pase" digital (token)Tus contraseñas están **super protegidas**:## 🔐 Seguridad: Lo Más Importante# Verificar que los servicios estén corriendo

3. Expira en 30 minutos

4. Lo usas para acceder a favoritos/pedidos````docker-compose

`````

✅ NUNCA se guardan tal cual las escribes

---

✅ Se convierten en un código imposible de descifrar### 🔒 Contraseñas Encriptadas con bcrypt```

## 🚀 Iniciar el Proyecto (3 pasos)

✅ Ni los administradores pueden ver tu contraseña real

### Paso 1️⃣: Backend

````bashLas contraseñas de los usuarios están **100% protegidas**:

cd Mini-Amazon-Vue

docker-compose up -dEjemplo:

docker-compose exec backend python seed_data.py

```Tu escribes:     "mipassword123"- ✅ **NUNCA se guardan en texto plano** en la base de datosDeberías ver:

✅ **Listo!** Backend funcionando

Se guarda como:  "$2b$12$xYz9...aB7cD8" ← Imposible de revertir

### Paso 2️⃣: Frontend

```bash```- ✅ Se encriptan con **bcrypt** usando 12 rounds de hashing

cd frontend

npm install

npm run dev

```### 🎫 Sistema de Login (JWT)- ✅ **Imposible recuperar** la contraseña original- `miniamazon-db` (PostgreSQL) - Estado: Up

✅ **Listo!** App funcionando

Cuando haces login:

### Paso 3️⃣: Abrir navegador

- 🎨 **App**: http://localhost:51731. ✅ Sistema verifica tu contraseña- ✅ Cada contraseña tiene un **salt único** generado automáticamente- `miniamazon-backend` (FastAPI) - Estado: Up

- ⚙️ **API**: http://localhost:8000/docs

2. ✅ Te da un "pase" digital (token JWT)

---

3. ✅ Ese pase expira en 30 minutos (por seguridad)- ✅ Ni siquiera los administradores pueden ver las contraseñas reales

## 🧪 Probar

4. ✅ Lo usas para acceder a tus favoritos, pedidos, etc.

1. **Registrarse** → Tu contraseña se encripta con bcrypt

2. **Login** → Recibes token JWT por 30 min### Paso 2: Poblar la Base de Datos

3. **Explorar** → Buscar, filtrar productos

4. **Funciones especiales** (requieren login):---

   - ⭐ Favoritos

   - 📦 Pedidos**Ejemplo:**

   - ✍️ Reseñas

## 🚀 EMPEZAR (3 pasos fáciles)

---

```powershell

## 🛠️ Tecnologías

### Paso 1️⃣: Iniciar el Backend

**Backend:**

- FastAPI, PostgreSQL, DockerTu contraseña:       "mipassword123"# Ejecutar script de inicialización

- **bcrypt** (contraseñas)

- **JWT** (login)```bash



**Frontend:**# 1. Abrir terminal en la carpeta del proyectoEn la base de datos: "$2b$12$LQVz9kR.../A7xHashed..."  ← Imposible de revertirdocker-compose exec backend python seed_data.py

- Vue 3, Bootstrap 5, Vite

cd Mini-Amazon-Vue

---

````

## ❓ Problemas Comunes

# 2. Iniciar la base de datos y API con Docker

### Puerto 8000 ocupado

```bashdocker-compose up -d### 🎫 Autenticación JWT (JSON Web Tokens)Esto cargará:

netstat -ano | findstr :8000

taskkill /PID <numero> /F# 3. Llenar la base de datos con productos de ejemploSistema de login moderno y seguro:

```

docker-compose exec backend python seed_data.py

### Token expiró

- Normal (30 min)````-

- Vuelve a hacer login

### Olvidé contraseña

- bcrypt es irreversible✅ **Listo!** El backend ya está corriendo- ✅ **Expira en 30 minutos** para mayor seguridad- ✅ Productos (desde frontend/public/data/productos.json)

- Crea nueva cuenta

---

---- ✅ **Stateless**: No se guardan sesiones en el servidor- ✅ Métodos de envío

## 📱 Comandos Útiles

`````bash

# Ver logs### Paso 2️⃣: Iniciar el Frontend- ✅ Cada petición protegida incluye el token- ✅ Localidades

docker-compose logs -f backend



# Reiniciar

docker-compose restart```bash- ✅ Backend valifica la firma antes de dar acceso- ✅ Cupones de descuento



# Detener# 1. Ir a la carpeta frontend

docker-compose down

cd frontend**Cómo funciona:**### Paso 3: Verificar API

# Ver base de datos

docker-compose exec db psql -U miniamazon -d miniamazon

SELECT email, hashed_password FROM users;

```# 2. Instalar dependencias (solo la primera vez)1. Usuario hace login → Backend valida contraseña con bcrypt



---npm install



## 💡 Tips de Seguridad2. Backend genera token JWT firmado```powershell



| ❌ NO hagas | ✅ SÍ haz |# 3. Iniciar la aplicación

|-------------|-----------|

| Compartir contraseña | Contraseñas únicas |npm run dev3. Frontend guarda el token en localStorage# Verificar que la API esté respondiendo

| Dejar sesión abierta | Cerrar sesión |

| Usar "123456" | Contraseñas fuertes |````



**Recuerda:**4. Cada petición incluye: `Authorization: Bearer <token>`curl http://localhost:8000/health

- 🔐 bcrypt protege tus contraseñas

- 🎫 JWT expira en 30 min✅ **Listo!** La aplicación ya está corriendo

- 🛡️ Todo es seguro

5. Backend verifica la firma del token antes de responder

---

---

## 📚 Más Info

# Abrir documentación interactiva en el navegador

- 📖 Docs técnica: `BACKEND_DOCUMENTATION.md`

- 🎤 Presentación: `PRESENTACION_15MIN.md`### Paso 3️⃣: Abrir en el Navegador

- 🌐 API: http://localhost:8000/docs

---start http://localhost:8000/docs

---

Abre estas direcciones en tu navegador:

## ✅ Checklist

`````

- [ ] Docker instalado

- [ ] Node.js instalado| Qué es | URL | Para qué sirve |

- [ ] `docker-compose up -d`

- [ ] `python seed_data.py`|--------|-----|----------------|## 🚀 Instalación en 3 Pasos

- [ ] `npm install` en frontend

- [ ] `npm run dev`| 🎨 **Aplicación Web** | http://localhost:5173 | La tienda (frontend) |

- [ ] Abierto http://localhost:5173

| ⚙️ **API** | http://localhost:8000/docs | Ver y probar la API |### Paso 4: Iniciar Frontend

---

| 💾 **Base de Datos** | Puerto 5432 | Donde se guardan los datos |

**¡Listo para usar! 🎉**

### Paso 1: Iniciar con Docker (Recomendado)

🆘 **¿Problemas?** Revisa logs: `docker-compose logs -f`

---

`````powershell

## 🧪 PROBAR LA APLICACIÓN

```bash# Navegar a la carpeta frontend

### 1. Crear tu cuenta

1. Ve a la página de **Registro**# Navegar al proyectocd frontend

2. Escribe tu email y contraseña

3. ✨ Tu contraseña se encripta automáticamente con bcryptcd Mini-Amazon-Vue

4. ✨ El sistema te da un token JWT

# Instalar dependencias (solo primera vez)

### 2. Iniciar sesión

1. Ve a **Login**# Iniciar backend y base de datosnpm install

2. Escribe email y contraseña

3. ✨ Sistema verifica tu contraseña encriptadadocker-compose up -d

4. ✨ Recibes un token JWT válido por 30 minutos

# Iniciar servidor de desarrollo

### 3. Explorar

- 🔍 Buscar productos# Poblar base de datos con productosnpm run dev

- 📂 Filtrar por categorías

- ➕ Agregar al carritodocker-compose exec backend python seed_data.py```



### 4. Funciones especiales (requieren login)````

- ⭐ Guardar favoritos

- 📦 Hacer pedidosFrontend disponible en: **http://localhost:5173**

- 📋 Ver tu historial de compras

- ✍️ Escribir reseñas### Paso 2: Iniciar Frontend



------



## 🛠️ Tecnologías Usadas```bash



### Backend (lo que no ves)cd frontend## ✅ Verificación Completa

- **FastAPI** - Hace que la aplicación sea rápida

- **PostgreSQL** - Guarda todos los datosnpm install

- **bcrypt** - Protege las contraseñas

- **JWT** - Sistema de login seguronpm run dev### 1. Backend (FastAPI)

- **Docker** - Facilita la instalación

`````

### Frontend (lo que ves)

- **Vue 3** - Hace la página interactiva- [ ] API: http://localhost:8000

- **Bootstrap 5** - Hace que se vea bonito

- **Vite** - Hace que cargue rápido### Paso 3: Abrir en el Navegador- [ ] Health: http://localhost:8000/health

---- [ ] Swagger Docs: http://localhost:8000/docs

## ❓ Problemas Comunes- **Frontend**: http://localhost:5173- [ ] ReDoc: http://localhost:8000/redoc

### ❌ "Puerto 8000 ocupado"- **Backend API**: http://localhost:8000

**Solución:**

````bash- **Documentación API**: http://localhost:8000/docs### 2. Base de Datos (PostgreSQL)

# Windows

netstat -ano | findstr :8000**¡Listo!** Ya puedes usar la aplicación 🎉- [ ] Puerto: 5432

taskkill /PID <numero> /F

```- [ ] Database: miniamazon



### ❌ "Mi sesión expiró"---- [ ] User: miniamazon

**Solución:**

- Es normal, los tokens duran 30 minutos## 🧪 Probar la Aplicación```powershell

- Vuelve a hacer login

- Obtendrás un nuevo token# Conectar a PostgreSQL



### ❌ "Olvidé mi contraseña"### 1. Crear una Cuentadocker-compose exec db psql -U miniamazon -d miniamazon

**Solución:**

- Las contraseñas con bcrypt no se pueden recuperar (son imposibles de descifrar)1. Ir a la página de **Registro**

- Crea una nueva cuenta

2. Ingresar email y contraseña# Verificar tablas

---

3. Tu contraseña se encripta con bcrypt automáticamente\dt

## 📱 Comandos Útiles

4. Se genera un token JWT al registrarte

### Ver qué está pasando

```bash# Ver productos

# Ver mensajes del backend

docker-compose logs -f backend### 2. Iniciar SesiónSELECT id, sku, titulo, precio FROM products LIMIT 5;



# Reiniciar todo1. Ir a **Login**```

docker-compose restart

2. Ingresar credenciales

# Detener todo

docker-compose down3. El sistema valida la contraseña hasheada con bcrypt### 3. Frontend (Vue)

````

4. Recibes un token JWT válido por 30 minutos

### Base de datos

```bash5. El token se guarda automáticamente- [ ] App: http://localhost:5173

# Entrar a la base de datos

docker-compose exec db psql -U miniamazon -d miniamazon- [ ] Catálogo funciona



# Ver productos### 3. Explorar la Tienda- [ ] Productos se visualizan

SELECT id, titulo, precio FROM products LIMIT 5;

- Navega por el catálogo

# Ver usuarios (verás las contraseñas encriptadas!)

SELECT email, hashed_password FROM users;- Usa filtros por categoría---

```

- Busca productos específicos

---

- Agrega productos al carrito## 🧪 Probar la API

## 💡 Tips de Seguridad

### 4. Funciones con Autenticación### Registrar Usuario

| ⚠️ NUNCA hagas esto | ✅ HAZ esto |

|-------------------|------------|**Estas funciones requieren estar logueado (usan JWT):**

| Compartir tu contraseña | Usa contraseñas únicas |

| Dejar sesión abierta en PC público | Cerrar sesión siempre |- ⭐ Agregar/quitar favoritos```powershell

| Usar "123456" como contraseña | Usar contraseñas fuertes |

- 📦 Hacer pedidos# PowerShell

**Recuerda:**

- 🔐 Tus contraseñas están encriptadas con bcrypt- 📋 Ver historial de compras$body = @{

- 🎫 Tu token JWT expira en 30 minutos

- 🛡️ El sistema es muy seguro- ✍️ Escribir reseñas email = "test@example.com"

--- password = "password123"

## 📚 Documentación Completa--- full_name = "Usuario Test"

¿Quieres saber más detalles técnicos?} | ConvertTo-Json

- 📖 **Documentación Backend**: `BACKEND_DOCUMENTATION.md`## 🛠️ Tecnologías Principales

- 🎤 **Guía de Presentación**: `PRESENTACION_15MIN.md`

- 🌐 **API Interactiva**: http://localhost:8000/docsInvoke-RestMethod -Uri http://localhost:8000/api/auth/register `

---### Backend -Method POST `

## ✅ Checklist Rápido- **FastAPI** - Framework web rápido y moderno -Body $body `

Antes de probar, verifica:- **PostgreSQL** - Base de datos relacional -ContentType "application/json"

- [ ] Docker está instalado y corriendo- **bcrypt** - Encriptación de contraseñas (12 rounds)```

- [ ] Node.js está instalado (v16+)

- [ ] Ejecutaste `docker-compose up -d`- **JWT (python-jose)** - Tokens de autenticación

- [ ] Ejecutaste `python seed_data.py`

- [ ] Ejecutaste `npm install` en frontend- **SQLAlchemy** - ORM### Login y Obtener Token

- [ ] Ejecutaste `npm run dev` en frontend

- [ ] Abriste http://localhost:5173- **Docker** - Contenedores

---````powershell

## 🎉 ¡Listo!### Frontend$loginBody = @{

Ahora tienes:- **Vue 3** - Framework JavaScript moderno username = "test@example.com"

- ✅ Una tienda online funcionando

- ✅ Sistema de login seguro (JWT)- **Vite** - Build tool ultra rápido password = "password123"

- ✅ Contraseñas protegidas (bcrypt)

- ✅ Base de datos con productos- **Vue Router** - Navegación con protección de rutas}

- ✅ Todo corriendo en tu computadora

- **Bootstrap 5** - Diseño responsive

**¡Disfruta explorando! 🛒✨**

- **localStorage** - Almacenamiento seguro de tokens JWT$response = Invoke-RestMethod -Uri http://localhost:8000/api/auth/login `

---

-Method POST `

### 🆘 ¿Necesitas ayuda?

--- -Body $loginBody `

1. Revisa los **Problemas Comunes** arriba

2. Mira los logs: `docker-compose logs -f` -ContentType "application/x-www-form-urlencoded"

3. Consulta la documentación completa

4. Busca el error en Google## 📱 Funcionalidades

**¡Mucha suerte!** 🚀$token = $response.access_token

### Para Todos los UsuariosWrite-Host "Token: $token"

- ✅ Ver catálogo de productos```

- ✅ Buscar y filtrar

- ✅ Ver detalles de productos### Ver Productos

- ✅ Leer reseñas

````powershell

### Para Usuarios Registrados (con JWT)Invoke-RestMethod -Uri http://localhost:8000/api/products?limit=5

- ✅ Agregar productos al carrito```

- ✅ Guardar favoritos

- ✅ Realizar pedidos### Crear Orden (Requiere Token)

- ✅ Ver historial de compras

- ✅ Escribir reseñas```powershell

$headers = @{

### Seguridad Implementada    Authorization = "Bearer $token"

- 🔐 Contraseñas hasheadas con bcrypt}

- 🎫 Autenticación JWT con firma criptográfica

- 🛡️ Rutas protegidas en frontend y backend$orderBody = @{

- ⏰ Tokens con expiración de 30 minutos    items = @(

- 🔒 Validación de permisos en cada petición        @{

            product_id = 1

---            quantity = 1

            price = 59990

## 🔧 Comandos Útiles        }

    )

### Docker    shipping_method = "Envío Estándar"

```bash    shipping_address = "Calle Falsa 123"

# Ver logs del backend    shipping_locality = "Santiago"

docker-compose logs -f backend    shipping_region = "RM"

} | ConvertTo-Json -Depth 10

# Reiniciar servicios

docker-compose restartInvoke-RestMethod -Uri http://localhost:8000/api/orders `

  -Method POST `

# Detener todo  -Headers $headers `

docker-compose down  -Body $orderBody `

```  -ContentType "application/json"

````

### Frontend

```````bash---

# Modo desarrollo

npm run dev## 🔧 Comandos Útiles



# Build para producción### Docker

npm run build

``````powershell

# Ver logs del backend

### Base de Datosdocker-compose logs -f backend

```bash

# Conectar a PostgreSQL# Ver logs de la base de datos

docker-compose exec db psql -U miniamazon -d miniamazondocker-compose logs -f db



# Ver productos# Reiniciar servicios

SELECT id, titulo, precio FROM products LIMIT 5;docker-compose restart



# Ver usuarios (contraseñas hasheadas con bcrypt)# Detener servicios

SELECT id, email, hashed_password FROM users;docker-compose down

```````

# Detener y eliminar todo (incluyendo volúmenes)

---docker-compose down -v

````

## 🐛 Problemas Comunes

### Migraciones

### Puerto 8000 ocupado

```bash```powershell

# Windows# Ver estado de migraciones

netstat -ano | findstr :8000docker-compose exec backend alembic current

taskkill /PID <pid> /F

# Ver historial

# Linux/Macdocker-compose exec backend alembic history

lsof -ti:8000 | xargs kill -9

```# Aplicar migraciones

docker-compose exec backend alembic upgrade head

### Token JWT expirado

- Los tokens expiran en 30 minutos# Crear nueva migración

- Simplemente vuelve a hacer logindocker-compose exec backend alembic revision --autogenerate -m "descripcion"

- Obtendrás un nuevo token válido```



### Olvidé mi contraseña### Base de Datos

- Las contraseñas están hasheadas con bcrypt (no se pueden recuperar)

- Necesitarías implementar un sistema de "reset password"```powershell

- Por ahora, crea una nueva cuenta# Backup de la base de datos

docker-compose exec db pg_dump -U miniamazon miniamazon > backup.sql

---

# Restaurar backup

## 📚 Más InformaciónGet-Content backup.sql | docker-compose exec -T db psql -U miniamazon -d miniamazon



- **Documentación Técnica Completa**: Ver `BACKEND_DOCUMENTATION.md`# Consultas SQL directas

- **Guía para Presentación**: Ver `PRESENTACION_15MIN.md`docker-compose exec db psql -U miniamazon -d miniamazon -c "SELECT COUNT(*) FROM products;"

- **API Interactiva**: http://localhost:8000/docs (con servidor corriendo)```



------



## 💡 Tips de Seguridad## 🐛 Troubleshooting



1. **Nunca** compartas tu SECRET_KEY del backend### Problema: Puerto 8000 ya en uso

2. Los tokens JWT se guardan en localStorage (solo accesibles desde tu navegador)

3. Siempre cierra sesión en computadores públicos```powershell

4. Los tokens expiran automáticamente en 30 minutos# Encontrar el proceso

5. Las contraseñas hasheadas con bcrypt son prácticamente imposibles de descifrarnetstat -ano | findstr :8000



---# Matar el proceso (reemplaza PID)

taskkill /PID <pid> /F

**¡Disfruta usando Mini Amazon Vue de forma segura!** 🛡️✨```


### Problema: Docker no inicia

```powershell
# Verificar Docker Desktop está corriendo
docker version

# Reiniciar Docker Desktop
# O reiniciar servicio desde la bandeja del sistema
````

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
