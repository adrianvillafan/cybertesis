import { executeQuery } from '../config/db.js';

export function fetchAdminData(userId, callback) {
    const sql = `
        SELECT 
            users.id, 
            users.name AS nombre_usuario,
            users.current_team_id
        FROM users
        WHERE users.id = $1 AND users.current_team_id = 1;
    `;
    executeQuery(sql, [userId], (err, results) => {
        if (err || results.rows.length === 0) {
            console.error('Error al buscar datos del administrador:', err);
            callback({ message: 'Error al buscar datos del administrador' }, null);
        } else {
            console.log('Datos del administrador encontrados:', results.rows[0]);
            callback(null, results.rows[0]);
        }
    });
}
