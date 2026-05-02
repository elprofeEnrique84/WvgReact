// Mock API Server - Simula el backend PHP para pruebas locales
// Usuarios de prueba:
// egonzalez@consultoragrupodxas.com / 123456
// mcordova@wvg.cl / 123456

const http = require('http');
const crypto = require('crypto');
const url = require('url');

const PORT = 3001;

// Usuarios simulados en "base de datos"
const users = {
  'egonzalez@consultoragrupodxas.com': {
    id_usuario: 1,
    nombre_usuario: 'Enrique González',
    email_usuario: 'egonzalez@consultoragrupodxas.com',
    password: crypto.createHash('md5').update('123456').digest('hex'),
    id_perfil: 1,
    nombre_perfil: 'Administrador',
    area: 'TI',
    id_cliente: 1,
    mca_habilitada: 'S',
  },
  'mcordova@wvg.cl': {
    id_usuario: 2,
    nombre_usuario: 'Miguel Córdova',
    email_usuario: 'mcordova@wvg.cl',
    password: crypto.createHash('md5').update('123456').digest('hex'),
    id_perfil: 2,
    nombre_perfil: 'Supervisor',
    area: 'Mantenimiento',
    id_cliente: 1,
    mca_habilitada: 'S',
  },
};

// Mantenimientos simulados
const mantenimientos = [
  {
    id_mantencion: 1,
    nombre_mantencion: 'Mantención Bomba A',
    id_equipo: 1,
    id_usuario: 1,
    id_estado: 2,
    fecha_inicio: '2026-05-01',
    hora_inicio: '08:00',
    fecha_termino: '2026-05-02',
    fecha_termino_proyeccion: '2026-05-02',
    equipo: { id_equipo: 1, nombre_equipo: 'Bomba A-100' },
    estado: { id_estado: 2, nombre_estado: 'En Proceso' },
    usuario: { id_usuario: 1, nombre_usuario: 'Enrique González' },
  },
  {
    id_mantencion: 2,
    nombre_mantencion: 'Revisión Compresor',
    id_equipo: 2,
    id_usuario: 1,
    id_estado: 5,
    fecha_inicio: '2026-04-28',
    hora_inicio: '09:00',
    fecha_termino: '2026-04-29',
    fecha_termino_proyeccion: '2026-04-29',
    equipo: { id_equipo: 2, nombre_equipo: 'Compresor C-50' },
    estado: { id_estado: 5, nombre_estado: 'Completado' },
    usuario: { id_usuario: 1, nombre_usuario: 'Enrique González' },
  },
];

// Catálogos
const catalogs = {
  estados: [
    { id_estado: 1, nombre_estado: 'Planificado', descripcion_estado: 'Pendiente de iniciar' },
    { id_estado: 2, nombre_estado: 'En Proceso', descripcion_estado: 'Actualmente en ejecución' },
    { id_estado: 3, nombre_estado: 'Atrasado', descripcion_estado: 'Excedido en plazo' },
    { id_estado: 4, nombre_estado: 'Desviado', descripcion_estado: 'Desviación detectada' },
    { id_estado: 5, nombre_estado: 'Completado', descripcion_estado: 'Finalizado exitosamente' },
  ],
  equipos: [
    { id_equipo: 1, nombre_equipo: 'Bomba A-100', mca_habilitada: 'S' },
    { id_equipo: 2, nombre_equipo: 'Compresor C-50', mca_habilitada: 'S' },
    { id_equipo: 3, nombre_equipo: 'Motor M-75', mca_habilitada: 'S' },
  ],
  turnos: [
    { id_turno: 1, nombre_turno: 'Turno Día', cantidad_equipo: 5 },
    { id_turno: 2, nombre_turno: 'Turno Noche', cantidad_equipo: 3 },
  ],
};

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  console.log(`${method} ${pathname}`);

  // POST /api/login
  if (method === 'POST' && pathname === '/api/login') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const input = JSON.parse(body);
        const { email, password } = input;

        if (!email || !password) {
          res.writeHead(400);
          res.end(JSON.stringify({
            success: false,
            message: 'Email y contraseña requeridos',
          }));
          return;
        }

        if (!users[email]) {
          res.writeHead(401);
          res.end(JSON.stringify({
            success: false,
            message: 'Usuario o contraseña incorrectos',
          }));
          return;
        }

        const user = users[email];
        const passwordHash = crypto.createHash('md5').update(password.trim()).digest('hex');

        if (user.password !== passwordHash) {
          res.writeHead(401);
          res.end(JSON.stringify({
            success: false,
            message: 'Usuario o contraseña incorrectos',
          }));
          return;
        }

        if (user.mca_habilitada !== 'S') {
          res.writeHead(403);
          res.end(JSON.stringify({
            success: false,
            message: 'Usuario deshabilitado',
          }));
          return;
        }

        const token = crypto.randomBytes(32).toString('hex');

        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          message: 'Login exitoso',
          data: {
            token,
            user: {
              id_usuario: user.id_usuario,
              nombre_usuario: user.nombre_usuario,
              email_usuario: user.email_usuario,
              id_perfil: user.id_perfil,
              nombre_perfil: user.nombre_perfil,
              area: user.area,
              id_cliente: user.id_cliente,
              mca_habilitada: user.mca_habilitada,
            },
          },
        }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, message: 'Invalid JSON' }));
      }
    });
    return;
  }

  // POST /api/logout
  if (method === 'POST' && pathname === '/api/logout') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      message: 'Logout exitoso',
    }));
    return;
  }

  // GET /api/mantenimientos
  if (method === 'GET' && pathname === '/api/mantenimientos') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: mantenimientos,
      total: mantenimientos.length,
    }));
    return;
  }

  // GET /api/estados
  if (method === 'GET' && pathname === '/api/estados') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: catalogs.estados,
    }));
    return;
  }

  // GET /api/equipos
  if (method === 'GET' && pathname === '/api/equipos') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: catalogs.equipos,
    }));
    return;
  }

  // GET /api/turnos
  if (method === 'GET' && pathname === '/api/turnos') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: catalogs.turnos,
    }));
    return;
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({
    success: false,
    message: 'Endpoint no encontrado',
  }));
});

server.listen(PORT, () => {
  console.log(`✅ Mock API Server corriendo en http://localhost:${PORT}/api`);
  console.log('');
  console.log('📋 Usuarios de prueba:');
  console.log('  1. egonzalez@consultoragrupodxas.com / 123456');
  console.log('  2. mcordova@wvg.cl / 123456');
  console.log('');
  console.log('Endpoints disponibles:');
  console.log('  POST   /api/login');
  console.log('  POST   /api/logout');
  console.log('  GET    /api/mantenimientos');
  console.log('  GET    /api/estados');
  console.log('  GET    /api/equipos');
  console.log('  GET    /api/turnos');
});
