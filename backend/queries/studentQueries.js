import { executeQuery } from '../config/db.js';

export function fetchStudentData(userId, callback) {
  const sql = `
    SELECT 
        estudiante.id, 
        estudiante.codigo_estudiante, 
        persona.identificacion_id,  -- O "identificacion_id" si este es el campo equivalente a dni
        persona.nombre,
        persona.apellidos_pat,
        persona.apellidos_mat,
        persona.correo_institucional AS email,
        persona.telefono,
        persona.orcid,
        persona.grado_academico_id,
        persona.fecha_registro,
        facultad.id AS facultad_id, 
        facultad.nombre AS nombre_facultad, 
        escuela.id AS escuela_id, 
        escuela.nombre AS nombre_escuela, 
        grado.id AS grado_id, 
        grado.grado AS nombre_grado,
        users.name AS name, 
        users.current_team_id,
        roles.guard_name,
        facultad_programa.id AS programa_id,
        facultad_programa.programa AS nombre_programa
    FROM estudiante
    INNER JOIN facultad ON estudiante.facultad_id = facultad.id
    INNER JOIN escuela ON estudiante.escuela_id = escuela.id
    INNER JOIN grado ON estudiante.grado_id = grado.id
    INNER JOIN users ON estudiante.user_id = users.id
    INNER JOIN roles ON users.current_team_id = roles.id
    INNER JOIN facultad_programa ON estudiante.programa_id = facultad_programa.id
    INNER JOIN personas persona ON estudiante.persona_id = persona.idpersonas  -- JOIN con la tabla personas
    WHERE estudiante.user_id = ?;
  `;

  executeQuery(sql, [userId], (studentErr, studentResults) => {
    if (studentErr || studentResults.length === 0) {
      console.error('Error al buscar datos del estudiante:', studentErr);
      callback({ message: 'Error al buscar datos del estudiante' }, null);
    } else {
      console.log('Datos del estudiante encontrados:', studentResults[0]);
      callback(null, studentResults[0]);
    }
  });
}