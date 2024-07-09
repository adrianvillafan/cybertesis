import { executeQuery } from '../config/db.js';

export function fetchDatosByDni(tipoIdentificacionId, identificacionId, callback) {
    const sql = `
        SELECT 
            idpersonas,
            tipo_identificacion_id,
            identificacion_id,
            nombre, 
            apellidos_pat,
            apellidos_mat,
            telefono, 
            correo_institucional AS email, 
            orcid,
            grado_academico_id
        FROM personas
        WHERE tipo_identificacion_id = ? AND identificacion_id = ?;
    `;
    executeQuery(sql, [tipoIdentificacionId, identificacionId], (err, results) => {
        if (err || results.length === 0) {
            console.error('Error al buscar datos de identificación:', err);
            callback({ message: 'Error al buscar datos de identificación' }, null);
        } else {
            const result = results[0];
            result.apellido = `${result.apellidos_pat} ${result.apellidos_mat}`; // Combine apellidos
            delete result.apellidos_pat;
            delete result.apellidos_mat;
            console.log('Datos encontrados:', result);
            callback(null, result);
        }
    });
}
