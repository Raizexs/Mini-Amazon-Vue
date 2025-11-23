# 🛒 Mini-Amazon - Sistema de E-commerce Full Stack

Una aplicación de comercio electrónico completa con backend FastAPI, frontend Vue 3, y aplicación móvil React Native + Expo, construida con arquitectura moderna y base de datos PostgreSQL.

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-52.x-000020?style=for-the-badge&logo=expo&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-11.x-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

</div>

---

## 🎯 Objetivos del Proyecto

Este proyecto full-stack busca demostrar la implementación de:

- ✅ **Arquitectura moderna de 3 capas:** Frontend Web (Vue.js), Backend API (FastAPI) y Aplicación Móvil (React Native)
- ✅ **Autenticación segura:** JWT + bcrypt para web, Firebase + JWT para móvil
- ✅ **Base de datos relacional:** PostgreSQL con migraciones versionadas (Alembic)
- ✅ **API REST completa:** 25+ endpoints documentados con Swagger
- ✅ **Experiencia de usuario fluida:** Carrito, favoritos, checkout, historial de pedidos
- ✅ **Integración externa:** API de Mercado Libre para ofertas
- ✅ **Aplicación móvil nativa:** Con autenticación social (Google) y paridad funcional con web
- ✅ **DevOps:** Containerización con Docker, build APK con Expo EAS
- ✅ **Mejores prácticas:** Validación de datos, manejo de errores, código modular y documentado

---

## 🚀 Inicio Rápido

¿Quieres ejecutar el proyecto ahora? Sigue la **[Guía de Inicio Rápido](docs/QUICK_START.md)** que te explica paso a paso cómo:

- 🟢 Levantar el **Backend** (FastAPI + PostgreSQL)
- 🔵 Iniciar el **Frontend Web** (Vue.js)
- 🟣 Ejecutar la **App Móvil** (React Native + Expo)

Con Docker o instalación manual. **¡En menos de 10 minutos!**

---

## 🛠️ Tecnologías Utilizadas

### 🎨 Frontend Web

| Tecnología          | Versión | Descripción                                  |
| -------------------- | -------- | --------------------------------------------- |
| **Vue.js**     | 3.5      | Framework progresivo con Composition API      |
| **Vue Router** | 4.4      | Enrutamiento SPA con guards de autenticación |
| **Vite**       | 6.0      | Build tool ultra-rápido con HMR              |
| **Axios**      | 1.7      | Cliente HTTP con interceptors                 |
| **Bootstrap**  | 5.3      | Framework CSS responsive                      |

### 📱 Aplicación Móvil

| Tecnología                    | Versión | Descripción                     |
| ------------------------------ | -------- | -------------------------------- |
| **React Native**         | 0.76     | Framework para apps nativas      |
| **Expo**                 | ~52.0    | Plataforma de desarrollo móvil  |
| **React Navigation**     | 7.0      | Navegación entre pantallas      |
| **Firebase Auth**        | 11.1     | Autenticación social (Google)   |
| **Google Sign-In**       | 14.0     | SDK de autenticación con Google |
| **AsyncStorage**         | 2.1      | Almacenamiento persistente       |
| **Axios**                | 1.7      | Cliente HTTP para consumo de API |
| **Expo Linear Gradient** | 14.0     | Gradientes para UI moderna       |

### ⚙️ Backend API

| Tecnología              | Versión | Descripción                                 |
| ------------------------ | -------- | -------------------------------------------- |
| **FastAPI**        | 0.115    | Framework web asíncrono de alto rendimiento |
| **PostgreSQL**     | 15       | Base de datos relacional SQL                 |
| **SQLAlchemy**     | 2.0      | ORM Python con soporte async                 |
| **Alembic**        | 1.13     | Gestor de migraciones de base de datos       |
| **python-jose**    | 3.3      | Manejo de JWT (JSON Web Tokens)              |
| **passlib**        | 1.7      | Encriptación de contraseñas con bcrypt     |
| **Firebase Admin** | 6.5      | Verificación de tokens de Firebase          |
| **Pydantic**       | 2.9      | Validación de datos y schemas               |
| **Uvicorn**        | 0.34     | Servidor ASGI de alta velocidad              |

### 🗄️ Base de Datos

| Tecnología          | Versión | Descripción                          |
| -------------------- | -------- | ------------------------------------- |
| **PostgreSQL** | 15       | Sistema de gestión de bases de datos |
| **psycopg2**   | 2.9      | Adaptador PostgreSQL para Python      |

### 🐳 DevOps & Infraestructura

| Tecnología              | Descripción                     |
| ------------------------ | -------------------------------- |
| **Docker**         | Contenedorización de servicios  |
| **Docker Compose** | Orquestación multi-contenedor   |
| **Expo EAS**       | Build y deployment de app móvil |

### 🔐 Servicios Externos

| Servicio                    | Uso                                         |
| --------------------------- | ------------------------------------------- |
| **Firebase**          | Autenticación social, gestión de usuarios |
| **Google OAuth 2.0**  | Proveedor de identidad para login social    |
| **Mercado Libre API** | Integración de ofertas externas (frontend) |

---

## ✨ Funcionalidades

- 🛍️ **Catálogo dinámico** - Filtrado por categorías y búsqueda en tiempo real
- 📦 **Detalle de producto** - Sistema de reseñas y calificaciones
- 🛒 **Carrito de compras** - Persistente con actualización automática
- ⭐ **Sistema de favoritos** - Guarda productos para después (requiere login)
- 💳 **Checkout completo** - Validación de cupones y cálculo de envío
- 📋 **Historial de pedidos** - Seguimiento detallado de compras (requiere login)
- 🔗 **Integración externa** - API de Mercado Libre con ofertas reales
- 🌓 **Tema claro/oscuro** - Cambio dinámico de interfaz
- 🔐 **Autenticación completa** - Registro, login, JWT y protección de rutas
- 👤 **Gestión de usuarios** - Perfil, actualización de datos y logout

---

## 📥 Instalación y Ejecución

### Requisitos Previos

- **Node.js** 18+ y npm
- **Python** 3.10+
- **PostgreSQL** 15+ (o usar Docker)
- **Git**

Para la aplicación móvil adicionalmente:

- **Expo Go** app (en tu teléfono) o Android Studio/Xcode
- **Cuenta de Firebase** (para autenticación social)

### Opción 1: Con Docker (Recomendado para Backend)

```bash
# 1️⃣ Clonar el repositorio
git clone https://github.com/Raizexs/Mini-Amazon-Vue.git
cd Mini-Amazon-Vue

# 2️⃣ Configurar variables de entorno del backend
cp backend/.env.example backend/.env

# Editar backend/.env:
# - Cambiar SECRET_KEY por una clave segura generada
# - Configurar DATABASE_URL si es necesario

# 3️⃣ Iniciar backend con Docker
docker-compose up -d

# 4️⃣ Poblar base de datos (solo primera vez)
docker-compose exec backend python seed_data.py

# 5️⃣ En otra terminal: Frontend Web
cd frontend
npm install
npm run dev

# 6️⃣ En otra terminal: Aplicación Móvil
cd mobile
npm install

# Configurar Firebase (primera vez)
cp .env.example .env

# Editar mobile/.env con tus credenciales de Firebase:
# - EXPO_PUBLIC_API_URL (tu IP local, ej: http://192.168.1.100:8000)
# - EXPO_PUBLIC_FIREBASE_API_KEY
# - EXPO_PUBLIC_FIREBASE_PROJECT_ID
# - etc.

npx expo start
# Escanear QR con Expo Go o presionar 'a' para Android emulator.
```

### Opción 2: Sin Docker (Instalación Manual)

#### Terminal 1 - Backend 🟢

```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
python seed_data.py
uvicorn main:app --reload
```


```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
venv\Scripts\activate  # Windows PowerShell
# source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env

# Editar .env con tus configuraciones

# Ejecutar migraciones
alembic upgrade head

# Poblar datos iniciales
python seed_data.py

# Iniciar servidor
uvicorn main:app --reload
```

#### Terminal 2 - Frontend 🔵

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

#### Terminal 3 - Mobile 🟣

```bash
cd mobile

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Editar .env con credenciales de Firebase y URL del backend
IMPORTANTE: Usar tu IP local, no localhost
# EXPO_PUBLIC_API_URL=http://192.168.1.100:8000

# Iniciar Expo
npx expo start

# Opciones:
# - Presiona 'a' → Abre en emulador Android
# - Escanea el QR → Abre en Expo Go en dispositivo físico
```

### Configuración de Firebase (Solo para App Móvil)

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar **Google Sign-In** en Authentication
3. Obtener configuración del proyecto (Web App)
4. Copiar credenciales a `mobile/.env`
5. Descargar `firebase-credentials.json` (Service Account) para backend
6. Colocar en `backend/firebase-credentials.json`

**Ver documentación detallada:** `mobile/README.md`

---

## 🌐 Acceso a la Aplicación

Una vez iniciados los servicios:

| Servicio                   | URL                        | Descripción              |
| -------------------------- | -------------------------- | ------------------------- |
| 🎨**Frontend**       | http://localhost:5173      | Interfaz de usuario Vue 3 |
| ⚙️**Backend API**  | http://localhost:8000      | API REST FastAPI          |
| 📖**Documentación** | http://localhost:8000/docs | Swagger UI interactiva    |

---

## 📁 Estructura del Proyecto

```
Mini-Amazon-Vue/
│
├── 🎨 frontend/                    # Aplicación Web Vue.js 3
│   ├── src/
│   │   ├── pages/                 # Vistas principales del sitio
│   │   │   ├── Home.vue           # Página de inicio
│   │   │   ├── Catalogo.vue       # Listado de productos
│   │   │   ├── Producto.vue       # Detalle de producto
│   │   │   ├── Cart.vue           # Carrito de compras
│   │   │   ├── Checkout.vue       # Proceso de pago
│   │   │   ├── Orders.vue         # Historial de pedidos
│   │   │   ├── Favoritos.vue      # Productos favoritos
│   │   │   ├── Login.vue          # Inicio de sesión
│   │   │   └── Register.vue       # Registro de usuarios
│   │   ├── components/            # Componentes reutilizables
│   │   ├── router/                # Vue Router con guards
│   │   │   └── index.js           # Configuración de rutas
│   │   ├── stores/                # Estado global (Pinia)
│   │   │   └── authStore.js       # Autenticación JWT
│   │   ├── services/              # Servicios de API
│   │   │   ├── api.js             # Cliente Axios para backend
│   │   │   └── meliApi.js         # Integración Mercado Libre
│   │   └── assets/                # Estilos CSS
│   ├── public/
│   │   └── data/                  # Datos JSON locales
│   │       ├── productos.json     # Catálogo de productos
│   │       ├── categorias.json    # Categorías
│   │       ├── cupones.json       # Cupones de descuento
│   │       ├── envios.json        # Métodos de envío
│   │       └── localidades.json   # Localidades para delivery
│   ├── .env.example               # Template de variables de entorno
│   ├── package.json               # Dependencias Node.js
│   └── vite.config.js             # Configuración de Vite
│
├── ⚙️ backend/                     # API REST con FastAPI
│   ├── app/
│   │   ├── routers/               # Endpoints organizados por módulo
│   │   │   ├── auth.py            # Autenticación (JWT + Firebase)
│   │   │   ├── products.py        # CRUD de productos
│   │   │   ├── categories.py      # Gestión de categorías
│   │   │   ├── orders.py          # Procesamiento de pedidos
│   │   │   ├── favorites.py       # Sistema de favoritos
│   │   │   └── reviews.py         # Reseñas de productos
│   │   ├── models/                # Modelos SQLAlchemy
│   │   │   └── __init__.py        # User, Product, Order, etc.
│   │   ├── main.py                # Aplicación FastAPI principal
│   │   ├── database.py            # Conexión a PostgreSQL
│   │   ├── auth.py                # Utilidades JWT y bcrypt
│   │   ├── config.py              # Variables de entorno
│   │   └── schemas.py             # Schemas Pydantic
│   ├── alembic/                   # Sistema de migraciones
│   │   ├── versions/              # Migraciones versionadas
│   │   └── env.py                 # Configuración de Alembic
│   ├── seed_data.py               # Script de datos iniciales
│   ├── requirements.txt           # Dependencias Python
│   ├── .env.example               # Template de variables de entorno
│   └── Dockerfile                 # Imagen Docker del backend
│
├── 📱 mobile/                      # Aplicación Móvil React Native
│   ├── src/
│   │   ├── screens/               # Pantallas de la app
│   │   │   ├── LoginScreen.js     # Pantalla de login con Google
│   │   │   ├── HomeScreen.js      # Inicio con productos destacados
│   │   │   ├── ProductsScreen.js  # Catálogo con filtros
│   │   │   ├── ProductDetailScreen.js  # Detalle de producto
│   │   │   ├── CartScreen.js      # Carrito de compras
│   │   │   ├── CheckoutScreen.js  # Proceso de checkout
│   │   │   ├── OrdersScreen.js    # Historial de pedidos
│   │   │   ├── FavoritesScreen.js # Productos favoritos
│   │   │   └── ProfileScreen.js   # Perfil de usuario
│   │   ├── contexts/              # Context API para estado global
│   │   │   ├── AuthContext.js     # Autenticación Firebase + JWT
│   │   │   ├── CartContext.js     # Estado del carrito
│   │   │   └── FavoritesContext.js # Estado de favoritos
│   │   ├── services/              # Servicios de API
│   │   │   └── api.js             # Cliente Axios con interceptors
│   │   ├── config/                # Configuraciones
│   │   │   └── firebase.js        # Configuración Firebase SDK
│   │   ├── constants/             # Constantes de la app
│   │   │   └── theme.js           # Colores, espaciados, tipografía
│   │   └── public/                # Assets públicos
│   │       ├── images.js          # Mapeo de imágenes
│   │       └── data/              # Datos JSON locales
│   ├── App.js                     # Punto de entrada principal
│   ├── app.json                   # Configuración de Expo
│   ├── eas.json                   # Configuración de EAS Build
│   ├── package.json               # Dependencias Node.js
│   └── .env.example               # Template de variables de entorno
│
├── 📚 docs/                        # Documentación del proyecto
│   ├── BACKEND_DOCUMENTATION.md   # Arquitectura del backend, JWT, bcrypt
│   └── QUICK_START.md             # Guía rápida de inicio
│
├── 🐳 docker-compose.yml           # Orquestación de servicios (Backend + DB)
├── .gitignore                      # Archivos ignorados por Git
└── README.md                       # Este archivo
```

---

## 🔒 Validaciones y Seguridad

| Característica                 | Implementación               |
| ------------------------------- | ----------------------------- |
| 🔐**Contraseñas**        | Encriptación con bcrypt      |
| 🎫**Autenticación**      | Tokens JWT seguros            |
| ✅**Validación**         | Frontend + Backend (Pydantic) |
| 🌐**CORS**                | Configurado para desarrollo   |
| 🛡️**Manejo de errores** | Respuestas estandarizadas     |

---

## 📝 Observaciones Finales

Este proyecto fue desarrollado como sistema completo de e-commerce siguiendo las mejores prácticas de desarrollo web moderno. La arquitectura permite escalabilidad y mantenimiento sencillo, con separación clara entre frontend y backend.

**🀽 Características de Seguridad:**

- Autenticación JWT completa
- Protección de rutas en frontend
- Persistencia segura de sesión
- Validación en múltiples capas

**🀽 Documentación adicional:**

- **Setup rápido de autenticación:** `docs/QUICK_START.md`
- **Documentación del backend:** `docs/BACKEND_DOCUMENTATION.md`

---

## 📚 Documentación

### Documentación General

| Documento                                                       | Descripción                                                       |
| --------------------------------------------------------------- | ------------------------------------------------------------------ |
| [`docs/QUICK_START.md`](docs/QUICK_START.md)                     | Guía rápida de inicio del proyecto completo                      |
| [`docs/BACKEND_DOCUMENTATION.md`](docs/BACKEND_DOCUMENTATION.md) | Arquitectura del backend, autenticación JWT, seguridad con bcrypt |

---

## 📄 Licencia y Uso

Este proyecto fue creado con **fines educativos** y puede ser utilizado libremente como referencia para proyectos de aprendizaje.

---

## 👨‍💻 Autor

**Desarrollador Principal:**

- 🧑‍💻 Lukas Flores ([@Raizexs](https://github.com/Raizexs))

---

<div align="center">

**⭐ Si te gustó este proyecto, considera darle una estrella en GitHub**

![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Activo-success?style=for-the-badge)

</div>
