# 🔌 GUÍA DE INTEGRACIÓN CON BACKEND API

## Estado Actual

✅ **Frontend React**: Completamente implementado y listo

- Estructura completa
- Componentes base
- Routing
- State management (Zustand)
- Servicios API (con axios interceptores)
- TypeScript types para todas las entidades

⏳ **Backend API REST**: Requiere implementación en PHP

---

## ¿Qué Necesita el Backend?

### 1. Estructura de Endpoints

Todos los endpoints deben retornar JSON con esta estructura:

```json
{
  "success": true,
  "data": {
    /* datos */
  },
  "error": null
}
```

En caso de error:

```json
{
  "success": false,
  "data": null,
  "error": "Descripción del error"
}
```

### 2. Autenticación con JWT

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id_usuario": 1,
      "nombre_usuario": "Juan",
      "email_usuario": "juan@example.com",
      "area": "Mantenimiento",
      "id_perfil": 2,
      "id_cliente": 1,
      "fecha_ingreso": "2026-01-01T00:00:00",
      "mca_habilitada": "S",
      "perfil": {
        "id_perfil": 2,
        "nombre_perfil": "Técnico",
        "descripcion": "Técnico de mantenimiento",
        "mca_habilitada": "S"
      },
      "cliente": {
        "id_cliente": 1,
        "nombre_cliente": "Empresa A",
        "mca_habilitado": 1
      }
    },
    "exp": 1672531200
  }
}
```

### 3. Headers Requeridos

El frontend incluye automáticamente en cada request:

```
Authorization: Bearer {token}
Content-Type: application/json
```

El backend debe:

- Validar el token JWT
- Retornar 401 si token inválido/expirado
- Retornar 403 si no tiene permisos

### 4. CORS

Habilitar CORS para que el frontend (localhost:5173) pueda conectarse:

```php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}
```

---

## Endpoints a Implementar

### Autenticación (5 endpoints)

```bash
# Login
POST /api/auth/login
Body: { email, password }
Response: { token, user, exp }

# Logout
POST /api/auth/logout
Response: { success }

# Refresh Token
POST /api/auth/refresh
Response: { token }

# Get Current User
GET /api/auth/me
Response: { user }
```

### Mantenimientos (7 endpoints)

```bash
# Listar (con paginación y filtros)
GET /api/mantenimientos?estado=2&equipo=1&page=0&limit=10
Response: { data: [], total, page, limit, pages }

# Detalle
GET /api/mantenimientos/:id
Response: { data: MantencionFaena con relaciones }

# Crear
POST /api/mantenimientos
Body: { nombre_mantencion, id_equipo, id_estado, ... }
Response: { data: MantencionFaena }

# Actualizar
PUT /api/mantenimientos/:id
Body: { nombre_mantencion, ... }
Response: { data: MantenicionFaena }

# Eliminar
DELETE /api/mantenimientos/:id
Response: { success }

# Cambiar estado
PATCH /api/mantenimientos/:id/status
Body: { id_estado }
Response: { data: MantencionFaena }

# Obtener bitácora
GET /api/mantenimientos/:id/bitacora
Response: { data: BitacoraMantencion[] }
```

### Catálogos (12 endpoints - simples GET)

```bash
# Equipos
GET /api/equipos
Response: { data: Equipo[] }

# Tipos de Planta
GET /api/tipos-planta
Response: { data: TipoPlanta[] }

# Ubicaciones
GET /api/ubicaciones
Response: { data: UbicacionEquipo[] }

# Componentes (con filtro opcional)
GET /api/componentes?id_equipo=1
Response: { data: ComponentePiezaEquipo[] }

# Config Equipos
GET /api/config-equipos?id_mantencion=1
Response: { data: ConfigEquipoMantencion[] }

# Turnos
GET /api/turnos
Response: { data: Turno[] }

# Estados
GET /api/estados
Response: { data: Estado[] }

# Faenas
GET /api/faenas
Response: { data: Faena[] }

# Responsables
GET /api/responsables
Response: { data: Responsable[] }

# Actividades
GET /api/actividades
Response: { data: Actividad[] }

# Categorías
GET /api/categorias
Response: { data: Categoria[] }

# Perfiles
GET /api/perfiles
Response: { data: Perfil[] }

# Clientes
GET /api/clientes
Response: { data: Cliente[] }
```

---

## Pasos para Convertir CodeIgniter a API REST

### 1. Crear estructura de carpetas

```
application/
├── controllers/
│   └── api/
│       ├── Auth.php
│       ├── Mantenimientos.php
│       ├── Equipos.php
│       └── Catalogs.php
├── models/
│   └── (existentes, reutilizar)
└── libraries/
    └── JWT.php (o usar JWT library)
```

### 2. Crear controlador base API

```php
<?php
class Api_Controller extends CI_Controller {

  protected function response($success, $data = null, $error = null) {
    header('Content-Type: application/json');
    echo json_encode([
      'success' => $success,
      'data' => $data,
      'error' => $error
    ]);
    exit;
  }

  protected function checkAuth() {
    $token = $this->input->get_request_header('Authorization');
    $token = str_replace('Bearer ', '', $token);

    // Validar JWT
    if (!$this->validateJWT($token)) {
      http_response_code(401);
      $this->response(false, null, 'Token inválido');
    }
  }

  protected function validateJWT($token) {
    // Implementar validación JWT
    // ...
  }
}
```

### 3. Convertir Controladores Existentes

**Antes (CodeIgniter tradicional):**

```php
public function index() {
  $data['mantenimientos'] = $this->Mantencion_faena_model->get_all();
  $this->load->view('mantencion_faena/index', $data);
}
```

**Después (API REST):**

```php
public function index() {
  $this->checkAuth();

  $estado = $this->input->get('estado');
  $equipo = $this->input->get('equipo');
  $page = $this->input->get('page') ?? 0;
  $limit = $this->input->get('limit') ?? 10;

  $data = $this->Mantencion_faena_model->get_all_with_filters(
    $estado, $equipo, $page, $limit
  );

  $this->response(true, $data);
}
```

### 4. Configurar Routes

```php
// application/config/routes.php
$route['api/auth/login'] = 'api/Auth/login';
$route['api/auth/logout'] = 'api/Auth/logout';
$route['api/mantenimientos'] = 'api/Mantenimientos/index';
$route['api/mantenimientos/(:num)'] = 'api/Mantenimientos/detail/$1';
```

---

## Variables de Entorno

**Frontend (.env)**

```
VITE_API_URL=http://localhost:8000/api
VITE_API_TIMEOUT=10000
```

**Backend (.env en PHP)**

```
JWT_SECRET=tu_secret_super_seguro_aqui
JWT_EXPIRATION=86400
ALLOWED_ORIGINS=http://localhost:5173
```

---

## Testing de Endpoints

Usar Postman, Insomnia, o cURL:

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Get Mantenimientos (con token)
curl -X GET "http://localhost:8000/api/mantenimientos?estado=2" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## Próximo: Integración

Una vez que el backend esté listo:

1. ✅ Frontend está listo en `http://localhost:5173`
2. ✅ Todos los servicios configurados
3. ✅ Tipos TypeScript listos
4. ✅ Stores Zustand listos

Solo hay que:

1. Actualizar `VITE_API_URL` en `.env`
2. El frontend consumirá automáticamente los endpoints

---

## Documentación de Tipos

Ver `src/types/index.ts` para:

- Estructura de cada entidad
- Campos opcionales/requeridos
- Relaciones entre tablas

---

**Preguntas frecuentes:**

**P: ¿El frontend valida datos antes de enviar?**
R: No (aún). Se puede agregar validación con Zod o Yup.

**P: ¿Qué hacer si el token expira?**
R: Se llama automáticamente a `/api/auth/refresh` y se reintentan.

**P: ¿Cómo agregar más funcionalidades?**
R: Seguir el patrón: Service → Store → Component → Page

**P: ¿Se puede cambiar de Zustand a Redux?**
R: Sí, pero requeriría refactoring de los stores.

---

📞 **Estoy listo para proceder con la API REST en PHP cuando lo indiques.**
