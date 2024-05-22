import { executeQuery } from '../config/db.js';

export function fetchUoariData(userId, callback) {
    const sql = `
        SELECT *
        FROM uoari_table
        WHERE user_id = ?;
    `;

    executeQuery(sql, [userId], (err, results) => {
        if (err || results.length === 0) {
            console.error('Error al buscar datos de UOARI:', err);
            callback({ message: 'Error al buscar datos de UOARI' }, null);
        } else {
            console.log('Datos de UOARI encontrados:', results[0]);
            callback(null, results[0]);
        }
    });
}
