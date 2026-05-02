# 📁 ESTRUCTURA COMPLETA DEL PROYECTO REACT

```
WvgReact/
│
├── 📄 package.json                    # Dependencias (React, Vite, Zustand, Axios, etc)
├── 📄 vite.config.js                  # Configuración Vite
├── 📄 tailwind.config.js              # Configuración Tailwind CSS
├── 📄 postcss.config.js               # Configuración PostCSS
├── 📄 index.html                      # HTML principal
├── 📄 .env.example                    # Variables de entorno ejemplo
├── 📄 .gitignore                      # Git ignore
├── 📄 README.md                       # Documentación principal
├── 📄 ESTRUCTURA_CREADA.md            # Este archivo
│
└── 📁 src/
    │
    ├── 📄 App.jsx                     # Componente principal + Routing
    ├── 📄 main.jsx                    # Punto de entrada React
    ├── 📄 index.css                   # Estilos globales + Tailwind
    │
    ├── 📁 types/
    │   └── 📄 index.ts                # Definiciones TypeScript
    │       ├── Usuario, Perfil, Cliente
    │       ├── MantencionFaena, Estado, Faena
    │       ├── BitacoraMantencion
    │       ├── Equipo, TipoPlanta, UbicacionEquipo
    │       ├── ConfigEquipoMantencion, ConfigTurnoMantencion
    │       ├── Actividad, Categoria, Responsable
    │       ├── MaintenanceFilters, DashboardKPIs
    │       └── ApiResponse, PaginatedResponse
    │
    ├── 📁 store/                      # Estado Global (Zustand)
    │   ├── 📄 authStore.ts            # Auth (usuario, token, login, logout)
    │   ├── 📄 maintenanceStore.ts     # Mantenimientos (CRUD, filtros, bitácora)
    │   └── 📄 catalogStore.ts         # Catálogos (equipos, estados, etc)
    │
    ├── 📁 services/                   # Llamadas a API (Axios)
    │   ├── 📄 authService.ts          # POST /login, /logout, /refresh
    │   ├── 📄 maintenanceService.ts   # CRUD mantenimientos, bitácora
    │   └── 📄 catalogService.ts       # GET catálogos (equipos, estados, etc)
    │
    ├── 📁 components/                 # Componentes reutilizables
    │   ├── 📄 Header.jsx              # Encabezado con user menu
    │   └── 📄 Sidebar.jsx             # Menú lateral responsive
    │
    ├── 📁 layouts/                    # Layouts principales
    │   └── 📄 MainLayout.jsx          # Layout con Header + Sidebar
    │
    ├── 📁 pages/                      # Páginas principales
    │   ├── 📄 LoginPage.jsx           # Autenticación
    │   │   ├── Formulario login
    │   │   ├── Validaciones
    │   │   └── Manejo de errores
    │   ├── 📄 DashboardPage.jsx       # Dashboard principal
    │   │   ├── KPIs (Total, Planificados, En Proceso, Completados)
    │   │   ├── Alertas (Atrasados, Desviados)
    │   │   ├── Tasa de completitud
    │   │   └── Tabla últimos mantenimientos
    │   └── 📄 MantenimientosPage.jsx  # Listado de mantenimientos
    │       ├── Tabla filtrable
    │       ├── Filtros (estado, equipo, búsqueda)
    │       ├── Paginación
    │       ├── Botones acción (Ver, Editar)
    │       └── Badges de estado con colores
    │
    ├── 📁 hooks/                      # Custom Hooks (PRÓXIMAS FASES)
    │   └── (vacío - para agregar hooks personalizados)
    │
    ├── 📁 utils/                      # Funciones utilitarias (PRÓXIMAS FASES)
    │   └── (vacío - para helpers, formatters, etc)
    │
    └── 📁 assets/                     # Imágenes y recursos (PRÓXIMAS FASES)
        └── (vacío - para logos, iconos, etc)

```

---

## 📊 MAPEO COMPLETO: MYSQL → TYPESCRIPT → REACT

### Tabla: usuario

```typescript
// Types
interface Usuario {
  id_usuario: number;
  nombre_usuario: string;
  email_usuario: string;
  area: string;
  id_perfil: number;
  id_cliente: number;
  fecha_ingreso: string;
  mca_habilitada: string;
}

// Store: useAuthStore
const { user } = useAuthStore(); // Usuario actual

// Página: LoginPage
// Usa: authService.login(credentials)
```

### Tabla: mantencion_faena (CORE)

```typescript
// Types
interface MantencionFaena {
  id_mantencion: number;
  id_equipo: number;
  id_usuario: number;
  id_estado: number;
  id_tipo_planta: number;
  id_faena: number;
  nombre_mantencion: string;
  hora_mantencion_inicial: number;
  fecha_inicio: string;
  hora_inicio: string;
  fecha_termino: string;
  hora_termino: string;
  fecha_termino_proyeccion: string;
  hora_termino_proyeccion: string;
  habilitado: number;
  // Relaciones
  equipo?: Equipo;
  usuario?: Usuario;
  estado?: Estado;
  tipo_planta?: TipoPlanta;
  faena?: Faena;
}

// Store: useMaintenanceStore
const {
  mantenimientos,
  fetchMantenimientos,
  createMantenimiento,
  updateMantenimiento,
  deleteMantenimiento,
  fetchMantenimientoById,
  setFilters,
  filters,
} = useMaintenanceStore();

// Página: DashboardPage
// Usa: últimos mantenimientos en tabla

// Página: MantenimientosPage
// Usa: listado completo con filtros
```

### Tabla: bitacora_mantencion

```typescript
// Types
interface BitacoraMantencion {
  id_folio: number;
  id_mantencion: number;
  id_usuario: number;
  fecha_proceso: string;
  fecha_trabajo: string;
  hora_trabajo: string;
  comentario_trabajo: string;
  cantidad_piezas_desmontar_real: number;
  cantidad_piezas_montar_real: number;
  // ... más campos
}

// Store: useMaintenanceStore
const { bitacora, fetchBitacora } = useMaintenanceStore();

// Servicio: maintenanceService
await maintenanceService.getBitacora(id_mantencion);
```

### Tabla: config_equipo_mantencion

```typescript
// Types
interface ConfigEquipoMantencion {
  id_configequipo_mantencion: number;
  id_equipo: number;
  id_componente_pieza_equipo: number;
  id_mantencion: number;
  nombre_pieza_fictisia: string;
  cantidad_piezas_desmontar: number;
  cantidad_piezas_montar: number;
}

// Store: useMaintenanceStore
const { selectedMantenimiento } = useMaintenanceStore();
// selectedMantenimiento.config_equipos[]

// Servicio: catalogService
await catalogService.getConfigEquipos(id_mantencion);
```

### Catálogos (Estados, Equipos, Turnos, etc)

```typescript
// Store: useCatalogStore
const {
  estados,
  equipos,
  turnos,
  faenas,
  tipos_planta,
  ubicaciones,
  responsables,
  actividades,
  categorias,
  perfiles,
  clientes,
  fetchAllCatalogs,
} = useCatalogStore();

// Servicios: catalogService
await catalogService.getEstados();
await catalogService.getEquipos();
// ... etc
```

---

## 🔌 API ENDPOINTS REQUERIDOS

### Autenticación

```
POST /api/auth/login
  Input: { email, password }
  Output: { token, user, exp }

POST /api/auth/logout
  Input: {}
  Output: { success }

POST /api/auth/refresh
  Input: {}
  Output: { token }

GET /api/auth/me
  Input: (Header: Authorization: Bearer token)
  Output: { user }
```

### Mantenimientos

```
GET /api/mantenimientos?estado=&equipo=&page=&limit=
  Output: { data: [], total, page, limit, pages }

GET /api/mantenimientos/:id
  Output: { data: MantencionFaena }

POST /api/mantenimientos
  Input: { nombre_mantencion, id_equipo, ... }
  Output: { data: MantencionFaena }

PUT /api/mantenimientos/:id
  Input: { nombre_mantencion, ... }
  Output: { data: MantencionFaena }

DELETE /api/mantenimientos/:id
  Output: { success }

PATCH /api/mantenimientos/:id/status
  Input: { id_estado }
  Output: { data: MantencionFaena }

GET /api/mantenimientos/:id/bitacora
  Output: { data: BitacoraMantencion[] }
```

### Catálogos (GET)

```
GET /api/equipos
GET /api/tipos-planta
GET /api/ubicaciones
GET /api/componentes?id_equipo=
GET /api/config-equipos?id_mantencion=
GET /api/turnos
GET /api/estados
GET /api/faenas
GET /api/responsables
GET /api/actividades
GET /api/categorias
GET /api/perfiles
GET /api/clientes

Todos retornan: { data: [] }
```

---

## 📈 PRÓXIMAS FASES

### Fase 3: Implementar formularios

- [ ] FormularioMantenimiento (crear/editar)
- [ ] FormularioEquipo
- [ ] FormularioUsuario
- [ ] Validaciones con Zod o Yup

### Fase 4: Agregar más páginas

- [ ] BitacoraPage (historial completo)
- [ ] EquiposPage (CRUD equipos)
- [ ] ReportesPage (gráficos)
- [ ] UsuariosPage (gestión usuarios)
- [ ] ConfiguracionPage

### Fase 5: Componentes avanzados

- [ ] Timeline (Mantenimiento)
- [ ] Gráficos (Chart.js, Recharts)
- [ ] Modales
- [ ] Alertas (Toasts)
- [ ] Paginación avanzada

### Fase 6: Polish y optimización

- [ ] Testing (Jest, RTL)
- [ ] Error boundaries
- [ ] Loading states mejorados
- [ ] Optimización de renders
- [ ] PWA support

---

## 🎯 CHECKLIST DE PRÓXIMOS PASOS

1. **Backend - API REST en PHP**
   - [ ] Implementar todos los endpoints
   - [ ] Autenticación JWT
   - [ ] CORS habilitado
   - [ ] Validaciones
   - [ ] Error handling

2. **Frontend - Completar funcionalidades**
   - [ ] Formularios CRUD
   - [ ] Detalle de mantenimiento
   - [ ] Bitácora
   - [ ] Config de equipos

3. **Testing**
   - [ ] Tests unitarios (Stores)
   - [ ] Tests de integración (Pages)
   - [ ] Tests E2E

4. **Deployment**
   - [ ] Build optimizado
   - [ ] CI/CD pipeline
   - [ ] Monitoreo

---

**Estado**: ✅ Estructura base completada y lista para conectar con API

**Próximo paso**: Implementar endpoints API en PHP/CodeIgniter

**Tiempo estimado**: 2-3 semanas para completar todas las fases
