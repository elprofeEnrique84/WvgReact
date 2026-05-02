# 🚀 GUÍA DE INICIO RÁPIDO

## ¿Qué se ha creado?

Un **sistema React completo** para reemplazar el PHP/CodeIgniter con:

- ✅ Autenticación (Login/JWT)
- ✅ Dashboard con KPIs
- ✅ Listado de mantenimientos
- ✅ Sidebar y navegación
- ✅ State management (Zustand)
- ✅ Servicios API (Axios)
- ✅ TypeScript types para seguridad

---

## 📋 ANTES DE EMPEZAR

### Requisitos

- **Node.js** 16+
- **npm** o **yarn**
- **Terminal/CMD** para ejecutar comandos

### Verificar instalación

```bash
node --version  # v18+ recomendado
npm --version   # 8+ recomendado
```

---

## 🔧 INSTALACIÓN (5 minutos)

### Paso 1: Navegar a la carpeta

```bash
cd /Users/enrique/WvgReact
```

### Paso 2: Instalar dependencias

```bash
npm install
```

_Esto descargará ~500MB de paquetes_

### Paso 3: Crear archivo .env

```bash
cp .env.example .env
```

### Paso 4: Editar .env (importante)

```bash
# Abrir en editor
nano .env
# o en VSCode
code .env
```

Cambiar:

```
VITE_API_URL=http://localhost:8000/api
```

A la URL correcta de tu backend (cuando esté listo).

### Paso 5: Iniciar servidor

```bash
npm run dev
```

✅ **¡Listo!** El navegador debe abrir en `http://localhost:5173`

---

## 🎮 PRUEBA DE FUNCIONALIDAD

### Login (actualmente sin validación real)

```
Email: test@example.com
Password: cualquier cosa
```

**Nota**: Funciona localmente sin API. Cuando el backend esté listo, validará credenciales.

### Dashboard

- Ver KPIs con números ficticios
- Ver tabla de mantenimientos ficticios

### Mantenimientos

- Ver listado filtrable
- Filtrar por estado o equipo
- Buscar por nombre

---

## 📂 ESTRUCTURA DE CARPETAS IMPORTANTE

```
/Users/enrique/WvgReact/
├── src/
│   ├── pages/           ← Páginas principales (Login, Dashboard, etc)
│   ├── components/      ← Componentes reutilizables
│   ├── store/           ← Estado global (Zustand)
│   ├── services/        ← Llamadas a API
│   ├── types/           ← Tipos TypeScript
│   ├── layouts/         ← Layouts (Header, Sidebar)
│   └── App.jsx          ← Router principal
├── package.json         ← Dependencias
├── vite.config.js       ← Configuración build
└── .env                 ← Variables de entorno
```

---

## 💻 COMANDOS ÚTILES

### Desarrollo

```bash
npm run dev          # Inicia servidor localhost:5173 con hot reload
npm run build        # Compila para producción
npm run preview      # Preview de la build
npm run lint         # Verifica sintaxis (cuando ESLint esté configurado)
```

### Limpiar caché (si hay problemas)

```bash
rm -rf node_modules
rm -rf .venv
npm install
```

---

## 🔌 INTEGRACIÓN CON API (PRÓXIMO PASO)

### Estado Actual

- Frontend ✅ Completo
- Backend API ⏳ Necesita implementación

### Cuando el Backend esté listo:

1. **Actualizar .env**

   ```
   VITE_API_URL=http://tu-servidor:8000/api
   ```

2. **El frontend automáticamente:**
   - Validará credenciales en login
   - Cargará mantenimientos reales
   - Mostrará datos de la BD

### Endpoints que espera el frontend

Ver `INTEGRACION_BACKEND.md` para lista completa.

**Principales:**

- `POST /api/auth/login` - Autenticación
- `GET /api/mantenimientos` - Listado
- `GET /api/equipos` - Catálogos
- ... (23 más)

---

## 🎨 PERSONALIZACIÓN

### Cambiar colores

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#tu-color-aqui',
    },
  },
}
```

### Agregar nueva página

```bash
# 1. Crear archivo en src/pages/
mkdir src/pages/MiPagina.jsx

# 2. Agregar ruta en src/App.jsx
<Route path="/mi-pagina" element={<MiPagina />} />

# 3. Agregar link en src/components/Sidebar.jsx
```

### Cambiar estilos

- Usar clases Tailwind directamente en JSX
- Ej: `<div className="bg-blue-600 text-white px-4 py-2">`

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### "Module not found: axios"

```bash
npm install axios
```

### Puerto 5173 ya en uso

```bash
npm run dev -- --port 5174
```

### Problemas con caché

```bash
# Limpiar localStorage del navegador
# F12 → Application → Local Storage → Clear All
```

### Error de CORS (cuando conectes API)

- Backend debe tener CORS habilitado
- Ver `INTEGRACION_BACKEND.md` para ejemplo

---

## 📱 RESPONSIVE DESIGN

El frontend ya es responsive:

- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (< 768px)

Sidebar se oculta en móvil → aparece botón ☰

---

## 🔐 SEGURIDAD

- ✅ JWT token almacenado en localStorage
- ✅ Rutas protegidas (redirect a login si no autenticado)
- ✅ Interceptores automáticos para headers
- ✅ Logout limpia sesión

**No hacer:**

- ❌ Guardar password en localStorage
- ❌ Exponer secrets en .env del navegador
- ❌ Confiar solo en validación frontend

---

## 📊 MONITOREO EN DESARROLLO

### Abrir DevTools (F12)

- **Console** → Ver errores
- **Network** → Ver requests API (cuando backend esté listo)
- **Application** → Ver localStorage

### Zustand DevTools (opcional)

```bash
npm install zustand-devtools
```

---

## 📚 DOCUMENTACIÓN DISPONIBLE

1. **README.md** - Guía general
2. **RESUMEN_EJECUTIVO.md** - Este archivo
3. **ESTRUCTURA_CREADA.md** - Descripción completa
4. **MAPA_ESTRUCTURAL.md** - Mapeo de datos
5. **INTEGRACION_BACKEND.md** - Cómo conectar API
6. **GUÍA_INICIO_RÁPIDO.md** - Este archivo

---

## ✅ CHECKLIST PARA COMENZAR

- [ ] Node.js instalado
- [ ] `npm install` ejecutado
- [ ] `.env` configurado
- [ ] `npm run dev` corriendo
- [ ] Navegador abrió en localhost:5173
- [ ] Login funciona (aunque sea localmente)
- [ ] Dashboard muestra datos ficticios
- [ ] Puedo navegar sin errores

---

## 🎯 PRÓXIMOS PASOS

1. **Esta semana**: Implementar API REST endpoints
2. **Próxima semana**: Conectar frontend con backend
3. **Semana 3**: Testing y pulido
4. **Semana 4+**: Características avanzadas

---

## 💬 FAQ RÁPIDA

**P: ¿Por qué no funciona el login?**
R: Backend aún no existe. Funciona localmente sin validación.

**P: ¿Cómo cambio el logo?**
R: Editar `src/components/Header.jsx` línea con "WVG"

**P: ¿Puedo usar clases CSS propias?**
R: Sí, en `src/index.css` o agregar archivos .css

**P: ¿Es necesario TypeScript?**
R: Solo en `src/types/`. JSX es JavaScript normal.

**P: ¿Se ve bien en móvil?**
R: Sí, está optimizado. Abre DevTools → Responsive Mode

---

## 📞 SOPORTE

Si algo no funciona:

1. Revisar `README.md`
2. Revisar `MAPA_ESTRUCTURAL.md`
3. Revisar console (F12) por errores
4. Limpiar cache: `npm install` nuevamente

---

## 🎉 ¡LISTO PARA EMPEZAR!

```bash
npm run dev
```

Abre `http://localhost:5173` y ¡a disfrutar!

---

**Siguiente paso importante**: Implementar API REST en PHP/CodeIgniter

Ver `INTEGRACION_BACKEND.md` para detalles.

✨ **Frontend listo. Backend pendiente. ¡Vamos!**
