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
        WHERE tipo_identificacion_id = $1 AND identificacion_id = $2;
    `;

    // Ejecutar la consulta para obtener los datos basados en DNI
    executeQuery(sql, [tipoIdentificacionId, identificacionId], (err, results) => {
        if (err || results.length === 0) {  // Cambié results.rows.length por results.length
            console.error('Error al buscar datos de identificación:', err);
            callback({ message: 'Error al buscar datos de identificación' }, null);
        } else {
            const result = results[0];  // Cambié results.rows[0] por results[0]
            result.apellido = `${result.apellidos_pat} ${result.apellidos_mat}`;  // Combina apellidos
            delete result.apellidos_pat;
            delete result.apellidos_mat;
            console.log('Datos encontrados:', result);
            callback(null, result);  // Devolvemos el resultado procesado
        }
    });
}
