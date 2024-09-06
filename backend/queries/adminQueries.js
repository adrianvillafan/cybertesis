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
    // Ejecutar la consulta para obtener los datos del administrador
    executeQuery(sql, [userId], (err, results) => {
        if (err || results.length === 0) {  // Cambié results.rows.length por results.length
            console.error('Error al buscar datos del administrador:', err);
            callback({ message: 'Error al buscar datos del administrador' }, null);
        } else {
            console.log('Datos del administrador encontrados:', results[0]);  // Cambié results.rows[0] por results[0]
            callback(null, results[0]);  // Devolvemos el primer resultado
        }
    });
}
