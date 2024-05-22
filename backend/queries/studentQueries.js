import { executeQuery } from '../config/db.js';

export function fetchStudentData(userId, callback) {
  const sql = `
    SELECT 
      estudiante.id, 
      estudiante.codigo_estudiante, 
      estudiante.dni, 
      facultad.id AS facultad_id, 
      facultad.nombre AS nombre_facultad, 
      escuela.id AS escuela_id, 
      escuela.nombre AS nombre_escuela, 
      grado.id AS grado_id, 
      grado.grado AS nombre_grado,
      users.name AS nombre_usuario, 
      users.current_team_id
    FROM estudiante
    INNER JOIN facultad ON estudiante.facultad_id = facultad.id
    INNER JOIN escuela ON estudiante.escuela_id = escuela.id
    INNER JOIN grado ON estudiante.grado_id = grado.id
    INNER JOIN users ON estudiante.user_id = users.id
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