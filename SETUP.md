# 🚀 WVG - Sistema de Gestión de Mantenimientos

## Proyecto Completo: React + Node.js/Express + MySQL

Este proyecto es una migración completa del sistema CodeIgniter original a una arquitectura moderna y escalable:
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + MySQL
- **Autenticación**: JWT Tokens
- **Despliegue**: AWS Amplify

---

## 📋 Requisitos

- Node.js 16+ 
- npm o yarn
- Base de datos MySQL accesible (ya configurada en 162.241.62.162)

---

## 🏃 Quick Start (Desarrollo Local)

### 1. Instalar dependencias

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 2. Iniciar servicios

**Terminal 1 - Backend (puerto 3001):**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend (puerto 5174):**
```bash
npm run dev
```

### 3. Acceder a la aplicación

```
http://localhost:5174/login
```

Credenciales de prueba:
```
Email: egonzalez@consultoragrupodxas.com
Password: 123456
```

---

## 📂 Estructura del Proyecto

```
WvgReact/
├── src/
│   ├── components/          # Componentes React
│   │   ├── LoginForm.tsx
│   │   ├── Dashboard.tsx
│   │   ├── MainLayout.tsx
│   │   └── ...
│   ├── services/            # Servicios API
│   │   ├── authService.ts   # Autenticación
│   │   ├── mantenimientosService.ts
│   │   └── catalogosService.ts
│   ├── store/               # Zustand stores
│   │   └── authStore.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── backend/
│   ├── server.js            # Express app
│   ├── db.js                # MySQL connection
│   ├── auth.js              # JWT utils
│   ├── routes/
│   │   ├── auth.js          # Login, logout
│   │   ├── mantenimientos.js
│   │   └── catalogos.js
│   ├── package.json
│   ├── .env
│   └── README.md
├── .env                     # Frontend env
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🔐 Autenticación

El sistema usa **JWT (JSON Web Tokens)** con seguimiento de sesión.

### Flujo de Autenticación:
1. Usuario ingresa email/password en login
2. Backend compara con MD5 en tabla `usuario`
3. Si válido, retorna JWT token (24 horas)
4. Frontend almacena token en localStorage
5. Cada request incluye `Authorization: Bearer <token>`
6. Token se valida automáticamente en rutas protegidas

### Endpoints de Auth:
```
POST   /api/auth/login       # { email, password } → { token, user }
POST   /api/auth/logout      # Logout (cierra sesión)
GET    /api/auth/me          # Obtener usuario actual (requiere token)
```

---

## 🌐 API REST Endpoints

### Autenticación (públicos)
```
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Mantenimientos (requieren autenticación)
```
GET    /api/mantenimientos          # Listar todos
GET    /api/mantenimientos/:id      # Obtener uno
GET    /api/mantenimientos/:id/bitacora
POST   /api/mantenimientos          # Crear
PUT    /api/mantenimientos/:id      # Actualizar
DELETE /api/mantenimientos/:id      # Eliminar
```

### Catálogos (requieren autenticación, solo lectura)
```
GET /api/catalogos/equipos
GET /api/catalogos/estados
GET /api/catalogos/turnos
GET /api/catalogos/faenas
GET /api/catalogos/responsables
GET /api/catalogos/categorias
```

---

## 🧪 Testing

### Probar API con curl

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"egonzalez@consultoragrupodxas.com","password":"123456"}'
```

**Con Token (reemplazar <TOKEN> con el retornado):**
```bash
curl -X GET http://localhost:3001/api/mantenimientos \
  -H "Authorization: Bearer <TOKEN>"
```

### Script de pruebas automatizadas

```bash
cd backend
bash test.sh
```

---

## 🗄️ Base de Datos

**Servidor:** `162.241.62.162:3306`  
**Base de datos:** `wvgmp_wvg`  
**Usuario:** `wvgmp`

Tablas principales:
- `usuario` - Usuarios del sistema
- `mantencion_faena` - Órdenes de mantenimiento
- `bitacora_mantencion` - Registros de actividad
- `equipo` - Equipos
- `estado` - Estados de mantenimiento
- `turno` - Turnos de trabajo
- `faena` - Proyectos/faenas

---

## 🔧 Variables de Entorno

**Frontend** (`.env`):
```
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=WVG Mantenimiento
```

**Backend** (`backend/.env`):
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

---

## 📦 Build & Deploy

### Build Frontend para Producción
```bash
npm run build
```

Genera carpeta `dist/` lista para desplegar.

### Deploy en AWS Amplify

1. **Conectar repositorio Git**
   ```bash
   git init
   git remote add origin <repo-url>
   git push -u origin main
   ```

2. **Configurar en Amplify Console:**
   - Conectar repo de GitHub
   - Build settings automáticos
   - Agregar variables de entorno
   - Desplegar

3. **Backend (API Gateway + Lambda o EC2):**
   - Opción A: Lambda + RDS MySQL
   - Opción B: EC2 con Node.js
   - Opción C: ECS con Docker

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Verificar que la IP 162.241.62.162 es accesible
- Revisar credenciales en `.env`
- Verificar firewall permite puerto 3306

### "Token expirado"
- Token JWT expira en 24 horas
- Rellenar token haciendo login nuevamente
- Frontend maneja automáticamente en authMiddleware

### "Login invalido"
- Verificar email correcto: `egonzalez@consultoragrupodxas.com`
- Verificar password: `123456`
- Contraseñas se comparan con MD5 (sistema original)

### Frontend no conecta a backend
- Verificar que backend está en `http://localhost:3001`
- Verificar VITE_API_URL en `.env`
- Verificar CORS habilitado en `backend/server.js`

---

## 📚 Tecnologías Utilizadas

### Frontend
- React 18
- Vite (build tool)
- TypeScript
- React Router v6
- Zustand (state management)
- Axios (HTTP client)
- Tailwind CSS (styling)

### Backend
- Node.js + Express.js
- MySQL2 (driver)
- JWT (authentication)
- CORS
- Dotenv

### Deployment
- AWS Amplify (frontend)
- AWS EC2/Lambda/ECS (backend)

---

## 🤝 Contribuciones

Para contribuir:
1. Hacer fork del proyecto
2. Crear rama: `git checkout -b feature/mi-feature`
3. Commit: `git commit -m 'Add mi-feature'`
4. Push: `git push origin feature/mi-feature`
5. Pull request

---

## 📞 Soporte

Para preguntas o problemas:
- Email: egonzalez@consultoragrupodxas.com
- Documentación: Ver `backend/README.md`

---

## ✅ Checklist de Implementación

- [x] Frontend React completo
- [x] Backend Node.js/Express creado
- [x] Autenticación JWT
- [x] CRUD Mantenimientos
- [x] Catálogos (equipos, estados, etc)
- [x] MySQL conectado
- [x] CORS habilitado
- [ ] Validación de datos (Joi/Zod)
- [ ] Logging estructurado
- [ ] Rate limiting
- [ ] Tests unitarios
- [ ] Tests E2E
- [ ] CI/CD pipeline
- [ ] Documentación Swagger
- [ ] Deploy en AWS Amplify

---

## 📄 Licencia

Este proyecto es propietario de WVG. Todos los derechos reservados.

---

## 🎉 ¡Listo para comenzar!

Backend y Frontend están completamente configurados y listos para:
- ✅ Desarrollo local
- ✅ Testing
- ✅ Deploy en producción
- ✅ Escalabilidad

```bash
# 3 comandos para comenzar:
cd backend && npm install && npm start    # Terminal 1
npm install && npm run dev                 # Terminal 2
```

¡Accede a http://localhost:5174 y disfruta! 🚀
