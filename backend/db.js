import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || '162.241.62.162',
  user: process.env.DB_USER || 'WvgReact',
  password: process.env.DB_PASSWORD || 'W22dm1n31',
  database: process.env.DB_NAME || 'wvgmp_wvg',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const query = async (sql, values = []) => {
  try {
    const [results] = await pool.execute(sql, values);
    return results;
  } catch (error) {
    console.error('DB Error:', error);
    throw error;
  }
};

export const getConnection = async () => pool.getConnection();
