# 🛒 Mini-Amazon - Sistema de E-commerce Full Stack

Una aplicación de comercio electrónico completa con backend FastAPI y frontend Vue 3, construida con arquitectura moderna y base de datos PostgreSQL.

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

---

## 🎯 Objetivos del Proyecto

- ✅ Implementar un catálogo de productos con filtros y búsqueda avanzada.
- ✅ Permitir a los usuarios gestionar un carrito de compras y realizar checkout.
- ✅ Integrar sistema de favoritos y reseñas de productos.
- ✅ Aplicar cupones de descuento y calcular opciones de envío.
- ✅ Mostrar ofertas externas mediante integración con Mercado Libre API.
- ✅ Proporcionar un historial completo de pedidos por usuario.
- ✅ Implementar autenticación segura con JWT y encriptación de contraseñas.

---

## 🛠️ Tecnologías Utilizadas

### 🎨 Frontend

| Tecnología          | Versión | Descripción                             |
| -------------------- | -------- | ---------------------------------------- |
| **Vue 3**      | 3.x      | Framework progresivo con Composition API |
| **Vite**       | 5.x      | Build tool ultra-rápido                 |
| **Vue Router** | 4.x      | Enrutamiento SPA                         |
| **CSS3**       | -        | Estilos personalizados                   |

### ⚙️ Backend

| Tecnología          | Versión | Descripción                    |
| -------------------- | -------- | ------------------------------- |
| **FastAPI**    | 0.104+   | Framework web moderno y rápido |
| **PostgreSQL** | 15       | Base de datos relacional        |
| **SQLAlchemy** | 2.x      | ORM Python                      |
| **Alembic**    | 1.x      | Gestor de migraciones           |
| **JWT**        | -        | Autenticación segura           |
| **bcrypt**     | -        | Encriptación de contraseñas   |

### 🐳 DevOps

- **Docker** & **Docker Compose** - Contenedorización completa

---

## ✨ Funcionalidades

- 🛍️ **Catálogo dinámico** - Filtrado por categorías y búsqueda en tiempo real
- 📦 **Detalle de producto** - Sistema de reseñas y calificaciones
- 🛒 **Carrito de compras** - Persistente con actualización automática
- ⭐ **Sistema de favoritos** - Guarda productos para después
- 💳 **Checkout completo** - Validación de cupones y cálculo de envío
- 📋 **Historial de pedidos** - Seguimiento detallado de compras
- 🔗 **Integración externa** - API de Mercado Libre con ofertas reales
- 🌓 **Tema claro/oscuro** - Cambio dinámico de interfaz
- 🔐 **Autenticación segura** - Registro, login y sesión persistente

---

## 🚀 Instalación y Ejecución

### Opción 1: Con Docker (Recomendado)

```bash
# 1️⃣ Clonar el repositorio
git clone https://github.com/Raizexs/Mini-Amazon-Vue.git
cd Mini-Amazon-Vue

# 2️⃣ Configurar variables de entorno
cp backend/.env.example backend/.env
# 📝 Editar backend/.env y cambiar SECRET_KEY

# 3️⃣ Iniciar servicios con Docker Compose
docker-compose up -d

# 4️⃣ Poblar base de datos con datos iniciales
docker-compose exec backend python seed_data.py

# 5️⃣ Instalar dependencias del frontend e iniciar
cd frontend
npm install
npm run dev
```

### Opción 2: Sin Docker (Manual)

**Backend:**

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
alembic upgrade head
python seed_data.py
uvicorn main:app --reload
```

**Frontend (en otra terminal):**

```bash
cd frontend
npm install
npm run dev
```

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
├── 🎨 frontend/              # Aplicación Vue 3
│   ├── src/
│   │   ├── pages/           # Vistas principales (Home, Catálogo, Producto, etc.)
│   │   ├── components/      # Componentes reutilizables
│   │   ├── router/          # Configuración de rutas
│   │   └── services/        # Servicios API (Mercado Libre)
│   └── public/
│       └── data/            # Datos JSON locales (productos, categorías, etc.)
│
├── ⚙️ backend/               # API FastAPI
│   ├── app/
│   │   ├── routers/         # Endpoints REST (auth, products, orders, etc.)
│   │   └── models/          # Modelos de base de datos
│   └── alembic/             # Sistema de migraciones
│
├── 📚 docs/                  # Documentación técnica completa
└── 🐳 docker-compose.yml     # Orquestación de servicios
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

**📚 Documentación adicional:** Para detalles técnicos avanzados, consultar la carpeta `docs/`. 

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
