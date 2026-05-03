import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { generateToken } from './auth.js';

// 1. Configuración de variables de entorno
dotenv.config();

const app = express();

// 2. Configuración de Seguridad (CORS)
// Esto permite que tu React (puerto 5173) pueda hablar con este servidor
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// 3. Middleware para entender JSON
app.use(express.json());

const md5 = (value) =>
  crypto.createHash('md5').update(String(value)).digest('hex');

// 4. Configuración de la Base de Datos (Bluehost)
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// 5. Prueba de conexión inicial
pool.getConnection()
  .then(connection => {
    console.log('✅ Conexión a MySQL Bluehost exitosa');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error conectando a la base de datos:', err.message);
  });

// 6. RUTA DE LOGIN
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscamos al usuario en la tabla correcta
    const [rows] = await pool.execute(
      'SELECT id_usuario, email_usuario, nombre_usuario, password, mca_habilitada FROM usuario WHERE email_usuario = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = rows[0];

    if (user.mca_habilitada !== 'S') {
      return res.status(401).json({ message: 'Usuario deshabilitado' });
    }

    const passwordHash = md5(password);
    const isPasswordValid =
      user.password === passwordHash || user.password === password;

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = generateToken(user.id_usuario, user.email_usuario);

    res.json({
      success: true,
      token,
      user: {
        id: user.id_usuario,
        nombre: user.nombre_usuario,
        email: user.email_usuario,
      }
    });

  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// 7. PUERTO Y ARRANQUE
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor API ejecutándose en http://localhost:${PORT}`);
});