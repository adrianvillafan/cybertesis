import { executeQuery } from '../config/db.js';

export function fetchRecepDocsData(userId, callback) {
    const sql = `
        SELECT *
        FROM recep_docs_table
        WHERE user_id = ?;
    `;

    executeQuery(sql, [userId], (err, results) => {
        if (err || results.length === 0) {
            console.error('Error al buscar datos de recepción de documentos:', err);
            callback({ message: 'Error al buscar datos de recepción de documentos' }, null);
        } else {
            console.log('Datos de recepción de documentos encontrados:', results[0]);
            callback(null, results[0]);
        }
    });
}
