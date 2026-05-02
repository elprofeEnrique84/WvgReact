# WVG Backend API - Node.js / Express / MySQL

API REST moderna para el sistema de gestión de mantenimientos WVG.

## Quick Start

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

El archivo `.env` ya está configurado con las credenciales de la base de datos de producción.

### 3. Iniciar servidor

```bash
npm start
```

El servidor ejecutará en `http://localhost:3001`

## Estructura

```
backend/
├── server.js              # Express app principal
├── auth.js                # JWT utilities
├── db.js                  # MySQL connection pool
├── package.json           # Dependencias
├── .env                   # Variables de entorno
└── routes/
    ├── auth.js            # POST /login, /logout, GET /me
    ├── mantenimientos.js  # CRUD mantenimientos
    └── catalogos.js       # GET catálogos (equipos, estados, turnos, etc)
```

## API Endpoints

### Autenticación (públicos)

- `POST /api/auth/login` - Login con email/password
- `POST /api/auth/logout` - Logout (cierra sesión)
- `GET /api/auth/me` - Obtener usuario actual (requiere token)

**Login Request:**

```json
{
  "email": "egonzalez@consultoragrupodxas.com",
  "password": "123456"
}
```

**Login Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "egonzalez@consultoragrupodxas.com",
    "nombre": "Enrique González"
  }
}
```

### Mantenimientos (requieren token)

- `GET /api/mantenimientos` - Listar todos
- `GET /api/mantenimientos/:id` - Obtener uno
- `GET /api/mantenimientos/:id/bitacora` - Obtener bitácora
- `POST /api/mantenimientos` - Crear
- `PUT /api/mantenimientos/:id` - Actualizar
- `DELETE /api/mantenimientos/:id` - Eliminar

### Catálogos (requieren token, solo lectura)

- `GET /api/catalogos/equipos` - Equipos
- `GET /api/catalogos/estados` - Estados
- `GET /api/catalogos/turnos` - Turnos
- `GET /api/catalogos/faenas` - Faenas
- `GET /api/catalogos/responsables` - Responsables
- `GET /api/catalogos/categorias` - Categorías

## Autenticación

El API usa JWT (JSON Web Tokens) con Bearer authentication.

**Enviar requests autenticadas:**

```
Authorization: Bearer <token>
```

Los tokens expiran en 24 horas.

## Base de Datos

Conecta a: `162.241.62.162:3306 / wvgmp_wvg`

Tablas principales:

- `usuario` - Usuarios del sistema
- `mantencion_faena` - Órdenes de mantenimiento
- `bitacora_mantencion` - Registros de mantenimiento
- `equipo` - Equipos
- `estado` - Estados de mantenimiento
- `turno` - Turnos
- `faena` - Faenas

## Desarrollo

### Variables de entorno (.env)

```
DB_HOST=162.241.62.162
DB_USER=wvgmp
DB_PASSWORD=Wvg@2024
DB_NAME=wvgmp_wvg
PORT=3001
JWT_SECRET=wvg_secret_key_2026
FRONTEND_URL=http://localhost:5174
NODE_ENV=development
```

### Testing con curl

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"egonzalez@consultoragrupodxas.com","password":"123456"}'

# Mantenimientos (con token)
curl -X GET http://localhost:3001/api/mantenimientos \
  -H "Authorization: Bearer <token>"
```

## AWS Amplify Deployment

Para desplegar en Amplify:

1. Crear archivo `amplify.yml`:

```yaml
version: 1
backend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
    postBuild:
      commands:
        - npm start
resources:
  api:
    backend: express
    port: 3001
```

2. Configurar variables de entorno en Amplify Console

3. Conectar repositorio Git y desplegar

## Tecnologías

- **Express.js** - Framework web
- **MySQL2** - Driver MySQL con promesas
- **JWT** - Autenticación
- **Bcryptjs** - Hashing de contraseñas (futuro)
- **CORS** - Cross-origin requests
- **Dotenv** - Variables de entorno

## Notas de Seguridad

- Las contraseñas se comparan con MD5 (sistema original)
- Los tokens JWT expiran en 24 horas
- Todos los endpoints excepto login/logout requieren autenticación
- CORS está habilitado solo para frontend definido

## Próximas Mejoras

- [ ] Migrar contraseñas a bcryptjs
- [ ] Agregar logs estructurados
- [ ] Validación de datos con Joi
- [ ] Rate limiting
- [ ] Caché con Redis
