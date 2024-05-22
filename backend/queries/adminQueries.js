import { executeQuery } from '../config/db.js';

export function fetchAdminData(userId, callback) {
    const sql = `
        SELECT 
            users.id, 
            users.name AS nombre_usuario,
            users.current_team_id
        FROM users
        WHERE users.id = ? AND users.current_team_id = 1;
    `;
    executeQuery(sql, [userId], (err, results) => {
        if (err || results.length === 0) {
            console.error('Error al buscar datos del administrador:', err);
            callback({ message: 'Error al buscar datos del administrador' }, null);
        } else {
            console.log('Datos del administrador encontrados:', results[0]);
            callback(null, results[0]);
        }
    });
}
