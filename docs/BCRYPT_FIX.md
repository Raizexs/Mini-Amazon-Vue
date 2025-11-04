# Solución al Error de bcrypt - Guía de Resolución

## Problema Identificado

El error `ValueError: password cannot be longer than 72 bytes` ocurría al intentar registrar usuarios, incluso con contraseñas cortas como "lukas123".

### Causa Raíz

**Incompatibilidad entre versiones de librerías:**

- `passlib==1.7.4` no es compatible con versiones recientes de `bcrypt` (> 4.0.1)
- El error ocurre internamente en passlib al intentar detectar bugs de bcrypt
- La configuración `bcrypt__truncate_error=False` no funcionaba debido a esta incompatibilidad

## Solución Implementada

### Cambio en requirements.txt

Se agregó una versión específica de bcrypt compatible con passlib:

```txt
passlib[bcrypt]==1.7.4
bcrypt==4.0.1
```

### Configuración en auth.py

Se configuró el contexto de passlib para manejar automáticamente el límite de 72 bytes:

```python
from passlib.context import CryptContext

# Password hashing context using bcrypt with truncate_error=False to handle 72 byte limit
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__truncate_error=False  # Automatically truncate passwords > 72 bytes
)

def get_password_hash(password: str) -> str:
    """
    Hash a password using bcrypt

    Note: bcrypt has a 72 byte limit, but passlib is configured to handle this automatically
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password"""
    return pwd_context.verify(plain_password, hashed_password)
```

## Verificación de la Solución

### 1. Registro de Usuario ✅

```bash
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "email": "lukas@example.com",
  "password": "lukas123",
  "full_name": "Lukas Flores"
}

# Respuesta:
{
  "email": "lukas@example.com",
  "full_name": "Lukas Flores",
  "id": 1,
  "is_active": true,
  "created_at": "2025-11-03T19:44:40.169251Z"
}
```

### 2. Login ✅

```bash
POST http://localhost:8000/api/auth/login
Content-Type: application/x-www-form-urlencoded

username=lukas@example.com&password=lukas123

# Respuesta:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 3. Endpoint Protegido ✅

```bash
GET http://localhost:8000/api/auth/me
Authorization: Bearer {token}

# Respuesta:
{
  "email": "lukas@example.com",
  "full_name": "Lukas Flores",
  "id": 1,
  "is_active": true,
  "created_at": "2025-11-03T19:44:40.169251Z"
}
```

## Scripts de Prueba Creados

Se crearon 3 scripts PowerShell para facilitar las pruebas:

### test_register.ps1

Registra un nuevo usuario en el sistema.

### test_login.ps1

Realiza login y guarda el token JWT en `token.txt`.

### test_me.ps1

Obtiene la información del usuario actual usando el token.

## Pasos para Aplicar la Solución

1. **Actualizar requirements.txt:**

   ```bash
   # Agregar versión específica de bcrypt
   bcrypt==4.0.1
   ```

2. **Reconstruir el contenedor Docker:**

   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

3. **Verificar que funciona:**
   ```bash
   # En PowerShell
   .\test_register.ps1
   .\test_login.ps1
   .\test_me.ps1
   ```

## Notas Importantes

### Sobre bcrypt

- **Límite de 72 bytes:** bcrypt tiene un límite estricto de 72 bytes para contraseñas
- **Truncamiento automático:** passlib con `bcrypt__truncate_error=False` trunca automáticamente
- **Compatibilidad:** Se debe usar `bcrypt==4.0.1` con `passlib==1.7.4`

### Alternativas Consideradas

1. **Truncamiento manual:** Funciona pero es menos elegante

   ```python
   password_bytes = password.encode('utf-8')[:72]
   password = password_bytes.decode('utf-8', errors='ignore')
   ```

2. **Argon2:** Algoritmo más moderno sin límite de 72 bytes

   - Requiere `passlib[argon2]`
   - Cambiar scheme a `["argon2"]`
   - Más seguro pero diferente del requisito de bcrypt

3. **Validación en Pydantic:** Limitar contraseñas a 72 caracteres
   ```python
   password: str = Field(..., min_length=6, max_length=72)
   ```
   - Funciona pero no resuelve el problema interno de passlib

## Lecciones Aprendidas

1. **Hot-reload no siempre funciona:** Los cambios en Python a veces requieren rebuild completo
2. **Versiones de dependencias importan:** La compatibilidad entre librerías es crítica
3. **Logs detallados ayudan:** El traceback completo reveló que el error estaba en passlib internamente
4. **Testing es esencial:** Los scripts de prueba facilitaron la verificación rápida

## Estado Final

✅ Backend funcionando correctamente  
✅ Registro de usuarios operativo  
✅ Login con JWT funcionando  
✅ Endpoints protegidos verificados  
✅ Swagger UI accesible en http://localhost:8000/docs  
✅ ReDoc accesible en http://localhost:8000/redoc

## Referencias

- [passlib Documentation](https://passlib.readthedocs.io/en/stable/)
- [bcrypt Specification](https://www.usenix.org/legacy/event/usenix99/provos/provos.pdf)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [JWT Authentication](https://jwt.io/introduction)

---

**Fecha de resolución:** 03 de Noviembre de 2025  
**Versiones:**

- FastAPI: 0.115.5
- passlib: 1.7.4
- bcrypt: 4.0.1
- Python: 3.11-slim
