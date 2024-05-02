import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'sql.freedb.tech',
  user: 'freedb_marcelasdasd',
  password: 'tCADemhZRPF39d!',
  database: 'freedb_Cybertesis',
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
