import { executeQuery } from '../config/db.js';

export function fetchRecepDocsData(userId, callback) {
    const sql = `
        SELECT *
        FROM recep_docs_table
        WHERE user_id = $1;
    `;

    // Ejecutar la consulta para obtener los datos de recepción de documentos
    executeQuery(sql, [userId], (err, results) => {
        if (err || results.length === 0) {  // Ya no es necesario usar results.rows.length
            console.error('Error al buscar datos de recepción de documentos:', err);
            callback({ message: 'Error al buscar datos de recepción de documentos' }, null);
        } else {
            console.log('Datos de recepción de documentos encontrados:', results[0]);  // Ya no es necesario usar results.rows[0]
            callback(null, results[0]);
        }
    });
}
