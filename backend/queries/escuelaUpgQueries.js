import { executeQuery } from '../config/db.js';

export function fetchEscuelaUpgData(userId, callback) {
    
    const sql = `
    SELECT 
        unidades.user_id,
        facultad.id AS facultad_id, 
        facultad.nombre AS nombre_facultad, 
        escuela.id AS escuela_id, 
        escuela.nombre AS nombre_escuela, 
        grado.id AS grado_id, 
        grado.grado AS nombre_grado,
        users.current_team_id,
        users.email
    FROM unidades
    INNER JOIN facultad ON unidades.facultad_id = facultad.id
    INNER JOIN escuela ON unidades.escuela_id = escuela.id
    INNER JOIN grado ON unidades.grado_id = grado.id
    INNER JOIN users ON unidades.user_id = users.id
    WHERE unidades.user_id = ? AND users.current_team_id = 3;
`;

    

    executeQuery(sql, [userId], (err, results) => {
        if (err || results.length === 0) {
            console.error('Error al buscar datos de escuela UPG:', err);
            callback({ message: 'Error al buscar datos de escuela UPG' }, null);
        } else {
            console.log('Datos de escuela UPG encontrados:', results[0]);
            callback(null, results[0]);
        }
    });
}

export function fetchAlumnosData({ escuelaId , gradoId }, callback) {
    const sql = `
    SELECT 
        estudiante.codigo_estudiante,
        estudiante.user_id,
        estudiante.dni,
        users.name,
        users.email
    FROM estudiante
    INNER JOIN users ON estudiante.user_id = users.id
    WHERE estudiante.escuela_id = ? AND estudiante.grado_id = ?;
`;

    executeQuery(sql, [escuelaId,gradoId], (err, results) => {
        if (err) {
            console.error('Error al buscar datos de alumnos:', err);
            callback({ message: 'Error al buscar datos de alumnos' }, null);
        } else {
            console.log('Datos de alumnos encontrados:', results);
            callback(null, results);
        }
    });
}
