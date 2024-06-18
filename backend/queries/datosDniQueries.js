import { executeQuery } from '../config/db.js';

export function fetchDatosByDni(dni, callback) {
    const sql = `
        SELECT 
            documento,
            nombre, 
            apellido_p,
            apellido_m,
            telefono, 
            email, 
            orcid
        FROM datos_dni
        WHERE documento = ?;
    `;
    executeQuery(sql, [dni], (err, results) => {
        if (err || results.length === 0) {
            console.error('Error al buscar datos del DNI:', err);
            callback({ message: 'Error al buscar datos del DNI' }, null);
        } else {
            const result = results[0];
            result.apellido = `${result.apellido_p} ${result.apellido_m}`; // Combine apellidos
            delete result.apellido_p;
            delete result.apellido_m;
            console.log('Datos encontrados:', result);
            callback(null, result);
        }
    });
}
