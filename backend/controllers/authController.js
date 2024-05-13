import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery } from '../config/db.js';
import { fetchStudentData } from '../queries/studentQueries.js';
import { fetchAdminData } from '../queries/adminQueries.js';

const secretKey = 'mi_secreto_super_secreto';

export const loginUser = (req, res) => {
    var { email, password, role } = req.body;
    var role = role.value;
    console.log(password);
    console.log(bcrypt.hashSync(password));

    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Se requiere correo electrónico, contraseña y rol' });
    }

    const sql = 'SELECT * FROM users WHERE email = ? AND current_team_id = ?';
    executeQuery(sql, [email, role], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
        const user = results[0];
        if (!bcrypt.compareSync(password, user.password)) {
            console.log(bcrypt.hashSync(user.password));
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        const newToken = jwt.sign({ userId: user.id, email: user.email, role: user.role }, secretKey, { expiresIn: '1h' });

        // Decide qué función llamar basada en el rol del usuario
        if (role === 2) {
            fetchStudentData(user.id, (err, userData) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ token: newToken, userData });
            });
        } else if (role === 1) {
            fetchAdminData(user.id, (err, userData) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ token: newToken, userData });
            });
        }
        // Añadir otros roles según sea necesario
    });
};

export const logoutUser = (req, res) => {
    res.send('Cierre de sesión exitoso');
  };
