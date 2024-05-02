import { executeQuery } from '../config/db.js';

export function fetchAdminData(userId, callback) {
    // Asumiendo que tienes una estructura de base de datos donde también guardas información relevante del administrador
    const sql = `
        SELECT 
            users.id, 
            users.name AS nombre_usuario,
            users.current_team_id
        FROM users
        WHERE users.id = ? AND users.current_team_id = 1;
    `;
    executeQuery(sql, [userId], (err, results) => {
        callback(err, results);
    });
}
