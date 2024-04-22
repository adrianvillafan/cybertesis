import express from 'express';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const port = 3306;
app.use(cors());
const secretKey = 'mi_secreto_super_secreto';

app.use(express.json());

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'sql.freedb.tech',
    user: 'freedb_marcelasdasd',
    password: 'tCADemhZRPF39d!',
    database: 'freedb_Cybertesis'
  });
  
  db.connect((err) => {
    if (err) {
      console.error('Error de conexión a la base de datos:', err);
      return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
  });


// Lógica de inicio de sesión
app.post('/login', (req, res) => {
  var { email, password, role } = req.body;
  role = role.value;
  
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Se requiere correo electrónico, contraseña y rol' });
  }

  // Consulta a la base de datos MySQL para encontrar al usuario por correo electrónico
  const sql = 'SELECT * FROM users WHERE email = ? AND current_team_id = ?';
  db.query(sql, [email, role], (err, results) => {
    if (err) {
      console.error('Error al buscar usuario en la base de datos:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    // Verificar si se encontró un usuario con ese correo electrónico
    if (results.length === 0) {
      return res.status(401).json({ message: 'Correo electrónico incorrecto' });
    }

    // Verificar la contraseña y el rol
    const user = results[0];
    if (password !== user.password || role !== user.current_team_id) {
      return res.status(401).json({ message: 'Correo electrónico, contraseña o rol incorrectos' });
    }

    // Generar token de autenticación
    const token = jwt.sign({ email: user.email, role: user.role }, secretKey);

    res.json({ token });
    console.log(token);
  });
});


// Ruta de cierre de sesión
app.get('/logout', (req, res) => {
  try {
    res.send('Cierre de sesión exitoso');
    console.log('Cierre de sesión exitoso');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    console.log('Error al cerrar sesión:', error);
    res.status(500).send('Error interno del servidor');
  }
});


// Ruta de perfil
app.get('/profile', (req, res) => {
  // Aquí manejaremos la lógica para mostrar el perfil del usuario
  res.send('Perfil de usuario');
});



app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});