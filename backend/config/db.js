/* import mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}); */


/* export function executeQuery(sql, params, callback) {
  pool.query(sql, params, (err, results) => {
    callback(err, results);
  });
} */
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 27628,
  ssl: {
    rejectUnauthorized: false,
  }
});

// Verificar la conexión al crear el pool
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.stack);
  } else {
    console.log('Conexión exitosa a la base de datos');
    release();  // libera el cliente si se conectó correctamente
  }
});

export function executeQuery(sql, params, callback) {
  console.log('Ejecutando consulta:', sql, 'con parámetros:', params);
  pool.query(sql, params)
    .then(results => {
      console.log('Consulta ejecutada con éxito');
      callback(null, results);
    })
    .catch(err => {
      console.error('Error al ejecutar la consulta:', err.stack);
      callback(err, null);
    });
}

export default pool;

