# WVG Mantenimiento - React Frontend

Sistema de gestión de mantenciones migrado a React desde PHP/CodeIgniter.

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   └── ...
├── pages/              # Páginas principales
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── MantenimientosPage.jsx
│   └── ...
├── store/              # Estado global (Zustand)
│   ├── authStore.ts
│   ├── maintenanceStore.ts
│   └── catalogStore.ts
├── services/           # Llamadas a API
│   ├── authService.ts
│   ├── maintenanceService.ts
│   └── catalogService.ts
├── types/              # Definiciones TypeScript
│   └── index.ts
├── layouts/            # Layouts principales
│   └── MainLayout.jsx
├── utils/              # Funciones utilitarias
├── assets/             # Imágenes y recursos
├── App.jsx             # Componente principal
├── main.jsx            # Entrada del app
└── index.css           # Estilos globales
```

## Instalación

### Requisitos
- Node.js 16+
- npm o yarn

### Pasos

1. **Instalar dependencias**
```bash
npm install
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con la URL de tu API:
```
VITE_API_URL=http://localhost:8000/api
```

3. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

El app abrirá en `http://localhost:5173`

## Construcción para Producción

```bash
npm run build
npm run preview
```

## Módulos Implementados

### ✅ Completado
- **Auth**: Login, JWT, localStorage
- **Dashboard**: KPIs, estadísticas
- **Layout**: Header, Sidebar, navegación

### 🔄 En Progreso
- **Mantenimientos CRUD**: Crear, editar, eliminar
- **Bitácora**: Registro de actividades
- **Configuración de Equipos**: Matriz de piezas

### 📋 Pendiente
- **Reportes**: Gráficos y análisis
- **Usuarios**: Gestión de usuarios
- **Configuración**: Sistema

## Estructura de Datos

Ver `src/types/index.ts` para entender:
- **MantencionFaena**: Tabla central
- **BitacoraMantencion**: Registro de actividades
- **ConfigEquipoMantencion**: Configuración de piezas
- Todas las tablas vinculadas

## Stores (Zustand)

### authStore
```javascript
const { user, token, login, logout, isLoggedIn } = useAuthStore();
```

### maintenanceStore
```javascript
const { mantenimientos, fetchMantenimientos, createMantenimiento } = useMaintenanceStore();
```

### catalogStore
```javascript
const { equipos, estados, fetchAllCatalogs } = useCatalogStore();
```

## Servicios API

Todos los servicios están en `src/services/`:
- `authService.login()`, `logout()`, `refreshToken()`
- `maintenanceService.getMantenimientos()`, `createMantenimiento()`, etc.
- `catalogService.getEquipos()`, `getEstados()`, etc.

## API Endpoints Requeridos

El backend debe proporcionar estos endpoints:

```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me

GET    /api/mantenimientos
GET    /api/mantenimientos/:id
POST   /api/mantenimientos
PUT    /api/mantenimientos/:id
DELETE /api/mantenimientos/:id
PATCH  /api/mantenimientos/:id/status
GET    /api/mantenimientos/:id/bitacora

GET    /api/equipos
GET    /api/tipos-planta
GET    /api/ubicaciones
GET    /api/componentes
GET    /api/config-equipos
GET    /api/turnos
GET    /api/estados
GET    /api/faenas
GET    /api/responsables
GET    /api/actividades
GET    /api/categorias
GET    /api/perfiles
GET    /api/clientes
```

## Estilos

Usando **Tailwind CSS** para todos los estilos. Ver `tailwind.config.js`.

## Próximos Pasos

1. [ ] Implementar todos los endpoints API en PHP
2. [ ] Crear componentes de detalle y formularios
3. [ ] Agregar validaciones en frontend
4. [ ] Crear reportes con gráficos (Chart.js, Recharts)
5. [ ] Testing automatizado
6. [ ] Documentación de API

## Desarrollado por

Tu Equipo - 2026
# WvgReact
