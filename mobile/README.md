# 📱 Mini Amazon - Aplicación Móvil

Aplicación móvil nativa desarrollada con **React Native + Expo** que consume la API del backend FastAPI. Incluye autenticación social con Firebase (Google OAuth) y paridad funcional completa con el frontend web.

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-52.0-000020?style=for-the-badge&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-10.13-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

</div>

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#️-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
  - [Variables de Entorno](#1-variables-de-entorno)
  - [Configuración de Firebase](#2-configuración-de-firebase)
  - [Configuración del Backend](#3-configuración-del-backend)
- [Ejecución](#-ejecución-en-desarrollo)
  - [Expo Go (Dispositivo Físico)](#opción-1-expo-go-dispositivo-físico-recomendado)
  - [Emulador Android](#opción-2-emulador-android)
- [Build APK con Expo EAS](#-build-apk-con-expo-eas)
- [Arquitectura de Autenticación](#-arquitectura-de-autenticación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Solución de Problemas](#-solución-de-problemas)
- [Credenciales de Prueba](#-credenciales-de-prueba)

---

## ✨ Características

### Funcionalidades Principales

- ✅ **Autenticación Social con Firebase** - Login con Google OAuth
- ✅ **Catálogo de Productos** - Listado con filtros por categoría
- ✅ **Búsqueda en Tiempo Real** - Búsqueda de productos
- ✅ **Detalle de Producto** - Información completa, imágenes, reseñas
- ✅ **Carrito de Compras** - Gestión completa de productos
- ✅ **Sistema de Favoritos** - Guardar productos para después
- ✅ **Checkout Completo** - Formulario de envío y creación de órdenes
- ✅ **Historial de Pedidos** - Ver órdenes realizadas
- ✅ **Perfil de Usuario** - Gestión de cuenta y logout
- ✅ **Navegación Fluida** - Animaciones y transiciones suaves
- ✅ **Indicadores de Carga** - Feedback visual en todas las operaciones
- ✅ **Manejo de Errores** - Mensajes informativos y recuperación de errores

### Experiencia de Usuario

- 🎨 **UI Moderna** - Diseño con glassmorphism y gradientes
- 🌙 **Tema Oscuro** - Interfaz optimizada para visualización nocturna
- ⚡ **Animaciones Fluidas** - Transiciones con Animated API
- 📱 **Responsive** - Adaptado a diferentes tamaños de pantalla
- 🔄 **Pull to Refresh** - Actualización de datos con gesto
- 💾 **Persistencia Local** - Sesión guardada con AsyncStorage

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **React Native** | 0.76.9 | Framework para apps nativas |
| **Expo** | ~52.0.0 | Plataforma de desarrollo móvil |
| **React Navigation** | 6.1.9 | Navegación entre pantallas |
| **Firebase** | 10.13.2 | Autenticación social (Google) |
| **Expo Auth Session** | ~6.0.0 | Flujo OAuth en React Native |
| **Axios** | 1.6.2 | Cliente HTTP para API |
| **AsyncStorage** | 1.23.1 | Almacenamiento persistente |
| **Expo Linear Gradient** | ~14.0.2 | Gradientes para UI |
| **Expo Blur** | ~14.0.3 | Efectos glassmorphism |

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

### Software Necesario

- ✅ **Node.js** 18+ ([Descargar](https://nodejs.org/))
- ✅ **npm** o **yarn** (incluido con Node.js)
- ✅ **Git** ([Descargar](https://git-scm.com/))
- ✅ **Expo CLI** (se instalará automáticamente)

### Para Ejecutar en Dispositivo Físico

- ✅ **Expo Go** app instalada en tu teléfono
  - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS](https://apps.apple.com/app/expo-go/id982107779)

### Para Ejecutar en Emulador (Opcional)

- ✅ **Android Studio** con Android SDK ([Guía](https://docs.expo.dev/workflow/android-studio-emulator/))
- ✅ **Xcode** (solo macOS) para iOS ([Guía](https://docs.expo.dev/workflow/ios-simulator/))

### Servicios Externos

- ✅ **Cuenta de Firebase** ([Crear cuenta](https://console.firebase.google.com/))
- ✅ **Backend FastAPI corriendo** (ver [README principal](../README.md))

---

## 📥 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Raizexs/Mini-Amazon-Vue.git
cd Mini-Amazon-Vue/mobile
```

### 2. Instalar Dependencias

```bash
npm install
```

> **Nota:** Si encuentras errores, intenta con `npm install --legacy-peer-deps`

---

## ⚙️ Configuración

### 1. Variables de Entorno

Crea el archivo `.env` basado en el template:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# Backend API Configuration
# ⚠️ IMPORTANTE: Usa tu IP local, NO localhost
# Para encontrar tu IP:
# - Windows: ipconfig (busca IPv4)
# - Mac/Linux: ifconfig (busca inet)
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000

# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# Google OAuth (for Firebase)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=123456789012-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
```

### 2. Configuración de Firebase

#### Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Agregar proyecto"**
3. Ingresa un nombre (ej: `mini-amazon-mobile`)
4. Sigue los pasos del asistente

#### Paso 2: Habilitar Google Sign-In

1. En el menú lateral, ve a **Authentication** → **Sign-in method**
2. Habilita **Google** como proveedor
3. Configura el email de soporte del proyecto

#### Paso 3: Registrar App Web

1. En **Project Overview**, haz clic en el ícono **Web** (`</>`)
2. Registra la app con un nombre (ej: `Mini Amazon Web`)
3. **Copia las credenciales** que aparecen y pégalas en tu `.env`

#### Paso 4: Configurar Android (para Google Sign-In)

1. En **Project Overview**, haz clic en el ícono **Android**
2. Ingresa el package name: `com.miniamazon.mobile`
3. Descarga el archivo `google-services.json`
4. Colócalo en la raíz del proyecto móvil: `mobile/google-services.json`

#### Paso 5: Configurar Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto de Firebase
3. Ve a **APIs & Services** → **Credentials**
4. Busca el **Android Client ID** creado automáticamente
5. Copia el **Client ID** (termina en `.apps.googleusercontent.com`)
6. Pégalo en `src/contexts/AuthContext.js` en la variable `ANDROID_CLIENT_ID`

#### Paso 6: Obtener SHA-1 Fingerprint (para Android)

```bash
# Generar SHA-1 para desarrollo local
cd android
./gradlew signingReport

# Busca en la salida:
# Variant: debug
# SHA1: XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX
```

Agrega este SHA-1 en Firebase:
1. **Project Settings** → **Your apps** → Android app
2. Haz clic en **Add fingerprint**
3. Pega el SHA-1

#### Paso 7: Configurar Backend

1. En Firebase Console, ve a **Project Settings** → **Service Accounts**
2. Haz clic en **Generate new private key**
3. Descarga el archivo JSON
4. Renómbralo a `firebase-credentials.json`
5. Colócalo en `backend/firebase-credentials.json`

### 3. Configuración del Backend

Asegúrate de que el backend esté corriendo y configurado:

```bash
# En el directorio backend/
cd ../backend

# Verificar que existe firebase-credentials.json
ls firebase-credentials.json

# Iniciar backend
uvicorn main:app --reload
```

El backend debe estar accesible en `http://localhost:8000` o en la IP que configuraste.

---

## 🚀 Ejecución en Desarrollo

### Opción 1: Expo Go (Dispositivo Físico) - Recomendado

Esta es la forma más rápida de probar la app:

```bash
# Iniciar Expo
npx expo start
```

Se abrirá una terminal con un **código QR**:

1. **Android:** Abre la app **Expo Go** → Escanea el QR
2. **iOS:** Abre la **Cámara** nativa → Escanea el QR → Abre en Expo Go

> **⚠️ IMPORTANTE:** Tu teléfono y tu computadora deben estar en la **misma red WiFi**.

### Opción 2: Emulador Android

Si tienes Android Studio instalado:

```bash
# Iniciar Expo
npx expo start

# En la terminal de Expo, presiona:
a  # Para abrir en Android emulator
```

### Opción 3: Build Local de Android

Para ejecutar una versión más cercana a producción:

```bash
# Primera vez: generar carpeta android/
npx expo prebuild

# Ejecutar en modo desarrollo
npx expo run:android
```

> **Nota:** Esto requiere Android Studio y un emulador o dispositivo conectado.

### Conectar con Backend Local

Si el backend está en tu computadora, necesitas usar tu **IP local** en lugar de `localhost`:

#### Encontrar tu IP Local

**Windows:**
```bash
ipconfig
# Busca "Adaptador de LAN inalámbrica Wi-Fi"
# IPv4: 192.168.1.XXX
```

**Mac/Linux:**
```bash
ifconfig
# Busca "inet" en la interfaz activa (ej: en0)
# inet 192.168.1.XXX
```

#### Configurar en Android (si usas emulador)

Si usas el emulador de Android, necesitas hacer port forwarding:

```bash
adb reverse tcp:8000 tcp:8000
```

Luego puedes usar `http://localhost:8000` en `.env`.

---

## 📦 Build APK con Expo EAS

Expo Application Services (EAS) permite compilar APKs sin necesidad de Android Studio local.

### 1. Instalar EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login en Expo

```bash
eas login
```

Ingresa tus credenciales de Expo (crea una cuenta en [expo.dev](https://expo.dev) si no tienes).

### 3. Configurar EAS Build

El archivo `eas.json` ya está configurado. Verifica que contenga:

```json
{
  "build": {
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

### 4. Generar APK de Producción

```bash
# Build para Android
npm run build:android

# O directamente:
eas build --platform android --profile production
```

### 5. Proceso de Build

1. EAS subirá tu código a sus servidores
2. Compilará la APK en la nube
3. Te mostrará un enlace para seguir el progreso
4. Al finalizar, recibirás un enlace de descarga

**Tiempo estimado:** 10-20 minutos

### 6. Descargar APK

Una vez completado el build:

1. Copia el enlace que aparece en la terminal
2. Abre el enlace en tu navegador
3. Haz clic en **"Download"**
4. Transfiere el APK a tu dispositivo Android
5. Instala la APK (habilita "Instalar apps desconocidas" si es necesario)

### Comandos de Build Disponibles

```bash
# Build Android (producción)
npm run build:android

# Build iOS (solo en macOS)
npm run build:ios

# Build ambas plataformas
npm run build:all

# Build preview (para testing interno)
eas build --platform android --profile preview
```

### Verificar Builds Anteriores

```bash
# Ver lista de builds
eas build:list

# Ver detalles de un build específico
eas build:view [BUILD_ID]
```

---

## 🔐 Arquitectura de Autenticación

La app implementa una arquitectura de autenticación híbrida recomendada:

```
┌─────────────────┐
│  Usuario hace   │
│  login con      │
│  Google         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Firebase Auth  │ ◄─── Autentica al usuario
│  (Google OAuth) │      Emite ID Token de Firebase
└────────┬────────┘
         │
         │ Firebase ID Token
         ▼
┌─────────────────┐
│  Backend API    │ ◄─── Verifica Firebase Token
│  (FastAPI)      │      Emite JWT propio
└────────┬────────┘
         │
         │ JWT del Backend
         ▼
┌─────────────────┐
│  App Móvil      │ ◄─── Usa JWT para todas
│  (React Native) │      las llamadas a la API
└─────────────────┘
```

### Flujo Detallado

1. **Usuario presiona "Continuar con Google"**
   - Se abre el navegador con OAuth de Google
   - Usuario autoriza la app

2. **Firebase autentica**
   - Recibe credenciales de Google
   - Crea/actualiza usuario en Firebase
   - Emite Firebase ID Token

3. **App envía token al backend**
   - `POST /api/auth/firebase-login`
   - Body: `{ firebase_token: "..." }`

4. **Backend verifica y emite JWT**
   - Verifica Firebase token con Firebase Admin SDK
   - Busca/crea usuario en PostgreSQL
   - Emite JWT propio del backend
   - Retorna: `{ token: "...", user: {...} }`

5. **App guarda JWT**
   - Almacena en AsyncStorage
   - Agrega automáticamente en header `Authorization: Bearer <token>`

6. **Llamadas subsecuentes**
   - Todas usan el JWT del backend
   - Backend valida JWT en cada request

### Ventajas de esta Arquitectura

- ✅ **Separación de responsabilidades:** Firebase autentica, Backend autoriza
- ✅ **Seguridad:** No se mezclan tokens de diferentes sistemas
- ✅ **Control:** Backend tiene control total sobre permisos
- ✅ **Escalabilidad:** Fácil agregar más proveedores (Facebook, GitHub, etc.)

---

## 📁 Estructura del Proyecto

```
mobile/
│
├── 📱 App.js                          # Punto de entrada principal
│   └── Providers (Auth, Cart, Favorites)
│   └── Navigation (Stack Navigator)
│
├── 📂 src/
│   │
│   ├── 🖼️ screens/                    # Pantallas de la app
│   │   ├── LoginScreen.js            # Login con Google OAuth
│   │   ├── HomeScreen.js             # Inicio con productos destacados
│   │   ├── ProductsScreen.js         # Catálogo con filtros
│   │   ├── ProductDetailScreen.js    # Detalle de producto
│   │   ├── CartScreen.js             # Carrito de compras
│   │   ├── CheckoutScreen.js         # Formulario de checkout
│   │   ├── OrdersScreen.js           # Historial de pedidos
│   │   ├── FavoritesScreen.js        # Productos favoritos
│   │   └── ProfileScreen.js          # Perfil y logout
│   │
│   ├── 🔄 contexts/                   # Context API (estado global)
│   │   ├── AuthContext.js            # Autenticación Firebase + JWT
│   │   ├── CartContext.js            # Estado del carrito
│   │   └── FavoritesContext.js       # Estado de favoritos
│   │
│   ├── 🌐 services/                   # Servicios de API
│   │   └── api.js                    # Cliente Axios con interceptors
│   │       ├── authAPI               # Login, registro, perfil
│   │       ├── productsAPI           # CRUD productos
│   │       ├── ordersAPI             # Gestión de órdenes
│   │       ├── favoritesAPI          # Favoritos
│   │       └── reviewsAPI            # Reseñas
│   │
│   ├── ⚙️ config/                     # Configuraciones
│   │   └── firebase.js               # Firebase SDK setup
│   │
│   ├── 🎨 constants/                  # Constantes
│   │   └── theme.js                  # Colores, espaciados
│   │
│   ├── 🧩 components/                 # Componentes reutilizables
│   │   └── SkeletonLoader.js         # Loading placeholder
│   │
│   └── 📦 public/                     # Assets públicos
│       ├── images.js                 # Mapeo de imágenes
│       └── data/                     # JSON locales
│           ├── categorias.json
│           ├── cupones.json
│           ├── envios.json
│           └── localidades.json
│
├── 📄 Archivos de Configuración
│   ├── app.json                      # Configuración de Expo
│   ├── eas.json                      # Configuración de EAS Build
│   ├── package.json                  # Dependencias
│   ├── babel.config.js               # Babel config
│   ├── metro.config.js               # Metro bundler config
│   ├── .env                          # Variables de entorno (no versionado)
│   ├── .env.example                  # Template de variables
│   └── google-services.json          # Firebase Android config
│
├── 🤖 android/                        # Carpeta nativa Android (generada)
│   └── (generada con expo prebuild)
│
└── 📚 README.md                       # Este archivo
```

---

## 🔧 Solución de Problemas

### Error: "Network request failed"

**Causa:** La app no puede conectarse al backend.

**Solución:**
1. Verifica que el backend esté corriendo: `http://TU_IP:8000/docs`
2. Confirma que `EXPO_PUBLIC_API_URL` en `.env` usa tu IP local
3. Asegúrate de estar en la misma red WiFi
4. Si usas emulador Android, ejecuta: `adb reverse tcp:8000 tcp:8000`

### Error: "Error 400: invalid_request" en Google Login

**Causa:** Configuración incorrecta de OAuth.

**Solución:**
1. Verifica que el SHA-1 fingerprint esté agregado en Firebase
2. Confirma que `google-services.json` esté en la raíz del proyecto
3. Verifica que los Client IDs en `AuthContext.js` sean correctos
4. Intenta limpiar caché: `npx expo start -c`

### Pantalla Blanca al Iniciar

**Causa:** Error en la carga inicial o credenciales corruptas.

**Solución:**
1. Revisa la consola de Expo para ver errores
2. Limpia AsyncStorage:
   ```javascript
   // En LoginScreen o cualquier pantalla
   import AsyncStorage from '@react-native-async-storage/async-storage';
   AsyncStorage.clear();
   ```
3. Reinicia la app

### Imágenes No Cargan

**Causa:** Archivos de imágenes faltantes.

**Solución:**
1. Verifica que existan las imágenes en `src/public/data/images/`
2. Confirma que `images.js` tenga el mapeo correcto
3. Revisa que los nombres coincidan con los de la base de datos

### Build EAS Falla

**Causa:** Configuración incorrecta o credenciales faltantes.

**Solución:**
1. Verifica que `app.json` tenga `owner` y `slug` correctos
2. Confirma que estés logueado: `eas whoami`
3. Revisa los logs del build en el enlace proporcionado
4. Asegúrate de que `google-services.json` esté presente

### Error al Instalar Dependencias

**Solución:**
```bash
# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### App Muy Lenta en Expo Go

**Causa:** Expo Go ejecuta en modo desarrollo con muchas herramientas de debug.

**Solución:**
- Usa `npx expo run:android` para una versión más rápida
- O genera un APK de producción con EAS

---

## 🔑 Credenciales de Prueba

### Para Testing del Backend

Si el backend tiene usuarios de prueba, puedes usar:

```
Email: test@example.com
Password: test123
```

> **Nota:** La app móvil solo soporta login con Google. Para testing, usa tu cuenta personal de Google.

### Cuentas de Google Recomendadas

Para testing, puedes crear una cuenta de Google específica para desarrollo:
- Crea una cuenta nueva en [accounts.google.com](https://accounts.google.com/signup)
- Úsala exclusivamente para testing de la app

---

## 📊 Endpoints de API Utilizados

La app consume los siguientes endpoints del backend:

### Autenticación
- `POST /api/auth/firebase-login` - Login con Firebase token
- `GET /api/auth/me` - Obtener usuario actual
- `PUT /api/auth/me` - Actualizar perfil

### Productos
- `GET /api/products` - Listar productos (con filtros)
- `GET /api/products/:id` - Detalle de producto
- `GET /api/products/search` - Búsqueda

### Órdenes
- `GET /api/orders` - Listar órdenes del usuario
- `GET /api/orders/:id` - Detalle de orden
- `POST /api/orders` - Crear nueva orden

### Favoritos
- `GET /api/favorites` - Listar favoritos
- `POST /api/favorites` - Agregar favorito
- `DELETE /api/favorites/:id` - Eliminar favorito

### Categorías
- `GET /api/categories` - Listar categorías

### Reseñas
- `GET /api/reviews/product/:id` - Reseñas de producto
- `POST /api/reviews` - Crear reseña

---

## 🎯 Próximos Pasos

Después de tener la app funcionando:

1. ✅ **Prueba todas las funcionalidades**
   - Login con Google
   - Navegación por productos
   - Agregar al carrito
   - Crear orden
   - Ver favoritos

2. ✅ **Genera el APK de producción**
   ```bash
   npm run build:android
   ```

3. ✅ **Prueba el APK en un dispositivo físico**
   - Instala el APK
   - Verifica que todo funcione sin Expo Go

4. ✅ **Prepara la demostración**
   - Practica el flujo completo
   - Prepara datos de ejemplo
   - Ten el backend corriendo

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa la sección [Solución de Problemas](#-solución-de-problemas)
2. Consulta la [documentación de Expo](https://docs.expo.dev/)
3. Revisa los logs en la consola de Expo
4. Verifica que el backend esté funcionando correctamente

---

## 📄 Licencia

Este proyecto fue creado con fines educativos.

---

## 👨‍💻 Autor

**Lukas Flores** ([@Raizexs](https://github.com/Raizexs))

---

<div align="center">

**⭐ Si te gustó este proyecto, considera darle una estrella en GitHub**

![Made with React Native](https://img.shields.io/badge/Made%20with-React%20Native-61DAFB?style=for-the-badge&logo=react)
![Powered by Expo](https://img.shields.io/badge/Powered%20by-Expo-000020?style=for-the-badge&logo=expo)

</div>
