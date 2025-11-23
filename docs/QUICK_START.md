# 🚀 Mini Amazon Vue - Guía de Inicio Rápido

> Aprende a iniciar el proyecto completo en **menos de 10 minutos**

---

## 📖 ¿Qué es esto?

**Mini Amazon Vue** es una plataforma e-commerce completa y segura con:

- 🛒 Catálogo de productos con búsqueda y filtros avanzados
- 🔐 **Autenticación segura con JWT y contraseñas encriptadas con bcrypt**
- 👤 Registro e inicio de sesión **SEGURO**
- 💳 Carrito de compras y proceso de checkout
- ⭐ Sistema de favoritos y reseñas
- 📦 Gestión completa de pedidos

---


## 🚀 Inicio Rápido - Flujo de 3 Terminales

Para ejecutar el sistema completo, necesitarás **3 terminales abiertas simultáneamente**.

### **Terminal 1: Backend** 🟢

```bash
# Navegar a la carpeta backend
cd backend

# Activar entorno virtual (si usas venv)
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones
alembic upgrade head

# Poblar datos iniciales (solo la primera vez)
python seed_data.py

# Iniciar servidor FastAPI
uvicorn main:app --reload
```

✅ **Backend corriendo en:** http://localhost:8000
✅ **Documentación API:** http://localhost:8000/docs

---

### **Terminal 2: Frontend Web** 🔵

```bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

✅ **Frontend corriendo en:** http://localhost:5173

---

### **Terminal 3: Aplicación Móvil** 🟣

```bash
# Navegar a la carpeta mobile
cd mobile

# Instalar dependencias
npm install

# Configurar variables de entorno (solo la primera vez)
# Crea un archivo .env con tus credenciales de Firebase
# Ver .env.example para referencia

# Iniciar Expo
npx expo start
# O usar: npm start
```

**Opciones para ejecutar la app móvil:**

- Presiona **'a'** → Abre en emulador Android
- Escanea **QR** → Abre en Expo Go en tu dispositivo físico
- Presiona **'i'** → Abre en simulador iOS (solo Mac)

---

## 🐳 Alternativa: Usar Docker (Solo Backend)

Si prefieres usar Docker para el backend:

```bash
# Iniciar servicios (PostgreSQL + FastAPI)
docker-compose up -d

# Poblar base de datos con datos iniciales
docker-compose exec backend python seed_data.py

# Ver logs en tiempo real
docker-compose logs -f backend
```

✅ **Luego continúa con Terminal 2 (Frontend) y Terminal 3 (Mobile)**

---

## 🧪 Probar el Sistema

1. **Abrir Frontend:** http://localhost:5173
2. **Registrarse** → Tu contraseña se encripta automáticamente con bcrypt
3. **Login** → Recibes un token JWT válido por 30 minutos
4. **Explorar** → Buscar productos, filtrar por categorías
5. **Funciones especiales** (requieren estar logueado):
   - ⭐ Agregar/quitar favoritos
   - 🛒 Agregar productos al carrito
   - 📦 Realizar y ver historial de pedidos
   - ✍️ Escribir reseñas de productos

---

## 🛠️ Tecnologías Principales

### Backend

- **FastAPI** - Framework web moderno y rápido
- **PostgreSQL** - Base de datos relacional
- **bcrypt** - Encriptación de contraseñas (12 rounds)
- **JWT (python-jose)** - Tokens de autenticación
- **SQLAlchemy** - ORM para base de datos
- **Docker** - Contenedores

### Frontend Web

- **Vue 3** - Framework JavaScript moderno
- **Vite** - Build tool ultra rápido
- **Vue Router** - Navegación con protección de rutas
- **Bootstrap 5** - Diseño responsive
- **Axios** - Cliente HTTP

### Mobile

- **React Native** - Framework para apps nativas
- **Expo** - Plataforma de desarrollo
- **Firebase Auth** - Autenticación móvil
- **AsyncStorage** - Almacenamiento local

---

## 📱 Comandos Útiles

### Docker

```bash
# Ver logs del backend en tiempo real
docker-compose logs -f backend

# Reiniciar todos los servicios
docker-compose restart

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: borra la BD)
docker-compose down -v
```

### Base de Datos

```bash
# Conectar a PostgreSQL
docker-compose exec db psql -U miniamazon -d miniamazon

# Ver productos
SELECT id, titulo, precio FROM products LIMIT 5;

# Ver usuarios (verás las contraseñas hasheadas!)
SELECT email, hashed_password FROM users;
```

### Frontend

```bash
# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

---

## 💡 Tips de Seguridad

| ❌ NO hagas                          | ✅ SÍ haz                |
| ------------------------------------ | ------------------------- |
| Compartir tu contraseña             | Usa contraseñas únicas  |
| Dejar sesión abierta en PC público | Cerrar sesión siempre    |
| Usar "123456" como contraseña       | Usar contraseñas fuertes |

**Recuerda:**

- 🔐 Tus contraseñas están encriptadas con bcrypt
- 🎫 Tu token JWT expira en 30 minutos automáticamente
- 🛡️ El sistema valida cada petición antes de dar acceso

---

## 📚 Documentación Completa

¿Quieres saber más detalles técnicos?

- 📖 **Documentación Backend**: `docs/BACKEND_DOCUMENTATION.md`
- 🌐 **API Interactiva**: http://localhost:8000/docs (con servidor corriendo)

---

## 🎉 ¡Listo para Empezar!

Ahora que tienes todo configurado:

1. ✅ **3 Terminales abiertas** (Backend, Frontend, Mobile)
2. ✅ **Sistema de autenticación seguro** (JWT + bcrypt)
3. ✅ **Base de datos poblada** con productos de ejemplo
4. ✅ **Frontend funcionando** en tu navegador
5. ✅ **App móvil lista** para testing

**¡Disfruta explorando Mini Amazon Vue! 🛒✨**

---

### 🆘 ¿Necesitas Ayuda?

1. Revisa los **Problemas Comunes** arriba
2. Mira los logs: `docker-compose logs -f`
3. Consulta la documentación completa en `docs/`
4. Verifica que todos los servicios estén corriendo

**¡Mucha suerte! 🚀**
