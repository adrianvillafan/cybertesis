import { executeQuery } from '../config/db.js';

export function fetchUoariData(userId, callback) {
    const sql = `
        SELECT *
        FROM uoari_table
        WHERE user_id = $1;
    `;

    executeQuery(sql, [userId], (err, results) => {
        if (err || results.rows.length === 0) {
            console.error('Error al buscar datos de UOARI:', err);
            callback({ message: 'Error al buscar datos de UOARI' }, null);
        } else {
            console.log('Datos de UOARI encontrados:', results.rows[0]);
            callback(null, results.rows[0]);
        }
    });
}
