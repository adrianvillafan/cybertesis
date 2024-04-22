import express from 'express';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
const port = 3306;
app.use(cors());
const secretKey = 'mi_secreto_super_secreto';

app.use(express.json());

// Crear un pool de conexiones a la base de datos
const pool = mysql.createPool({
    host: 'sql.freedb.tech',
    user: 'freedb_marcelasdasd',
    password: 'tCADemhZRPF39d!',
    database: 'freedb_Cybertesis',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

function executeQuery(sql, params, callback) {
    pool.query(sql, params, (err, results) => {
        callback(err, results);
    });
}

// Lógica de inicio de sesión
app.post('/login', (req, res) => {
  var { email, password, role } = req.body;
  var role = role.value;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  console.log("Password:", password);
  console.log("Hashed Password:", hash);
  
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Se requiere correo electrónico, contraseña y rol' });
  }

  // Consulta a la base de datos para encontrar al usuario por correo electrónico y rol
  const sql = 'SELECT * FROM users WHERE email = ? AND current_team_id = ?';
  executeQuery(sql, [email, role], (err, results) => {
    if (err) {
      console.error('Error al buscar usuario en la base de datos:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Correo electrónico incorrecto' });
    }

    const user = results[0];
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar un nuevo token de autenticación
    const newToken = jwt.sign({ 
      email: user.email, 
      role: user.role, 
      iat: Math.floor(Date.now() / 1000)
  }, secretKey);
  
    // Actualizar el token de sesión y la última hora de inicio de sesión en la base de datos
    const updateSql = 'UPDATE users SET session_token = ?, last_login = NOW() WHERE id = ?';
    executeQuery(updateSql, [newToken, user.id], (updateErr, updateResults) => {
      if (updateErr) {
        console.error('Error al actualizar la información de sesión del usuario:', updateErr);
        return res.status(500).json({ message: 'Error al actualizar la información de sesión del usuario' });
      }
      res.json({ token: newToken });  // Enviar el nuevo token al cliente
      });
      console.log("session_token:", newToken);
  });
});




// Ruta de cierre de sesión
app.get('/logout', (req, res) => {
  // Aquí, simplemente confirmamos el cierre de sesión sin necesidad de lógica en el servidor
  // El cliente debe eliminar el token almacenado localmente
  res.send('Cierre de sesión exitoso');
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
