import mysql from 'mysql2';
import dotenv from 'dotenv';
// Cargar las variables de entorno desde el archivo .env


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export function executeQuery(sql, params, callback) {
  pool.query(sql, params, (err, results) => {
    callback(err, results);
  });
}

export default pool;
