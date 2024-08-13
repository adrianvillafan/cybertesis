import { executeQuery } from '../config/db.js';

export function fetchStudentData(userId, callback) {
  const sql = `
    SELECT 
        estudiante.id AS estudiante_id, 
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

export function fetchExpedientes(estudianteId, gradoId, callback) {
  const sql = `
    SELECT 
      d.*, 
      t.titulo AS tesis_titulo,
      e.programa_id AS estudiante_programa_id,
      fp.programa AS programa_nombre
    FROM 
      documentos d
    LEFT JOIN 
      tesis t ON d.tesis_id = t.id_tesis
    LEFT JOIN 
      estudiante e ON d.estudiante_id = e.id
    LEFT JOIN 
      facultad_programa fp ON e.programa_id = fp.id
    WHERE 
      d.estado_id = 1
      AND d.solicitud_id IS NULL
      AND d.grado_id = ?
      AND d.estudiante_id = ?;
  `;

  executeQuery(sql, [gradoId, estudianteId], (err, results) => {
    if (err) {
      console.error('Error al buscar expedientes:', err);
      callback({ message: 'Error al buscar expedientes' }, null);
    } else {
      console.log('Expedientes encontrados:', results);
      callback(null, results);
    }
  });
}


// Función para crear una solicitud y actualizar la tabla documentos
export function createSolicitud(idFacultad, idDocumento, callback) {
  const insertSql = `
    INSERT INTO solicitudes (
        id_facultad, 
        id_grado, 
        id_documentos, 
        id_alumno, 
        id_estado, 
        fecha_alum
    )
    SELECT 
        ?, 
        d.grado_id, 
        d.id, 
        d.estudiante_id, 
        3,  -- Estado inicial
        NOW()
    FROM 
        documentos d
    WHERE 
        d.id = ?;
  `;

  executeQuery(insertSql, [idFacultad, idDocumento], (insertErr, insertResults) => {
    if (insertErr) {
      console.error('Error al crear solicitud:', insertErr);
      callback({ message: 'Error al crear solicitud' }, null);
    } else {
      const solicitudId = insertResults.insertId;

      const updateSql = `
        UPDATE documentos 
        SET solicitud_id = ?
        WHERE id = ?;
      `;

      executeQuery(updateSql, [solicitudId, idDocumento], (updateErr, updateResults) => {
        if (updateErr) {
          console.error('Error al actualizar el documento:', updateErr);
          callback({ message: 'Error al actualizar el documento' }, null);
        } else {
          console.log('Solicitud creada y documento actualizado:', updateResults);
          callback(null, { solicitudId, updateResults });
        }
      });
    }
  });
}

// Nueva función para obtener solicitudes de un alumno
export function fetchSolicitudesByAlumno(idAlumno, callback) {
  const sql = `
    SELECT 
        s.id,
        s.id_facultad,
        s.id_grado,
        s.id_documentos,
        s.id_alumno,
        s.id_estado,
        s.fecha_alum,
        t.titulo AS tesis_titulo,
        fp.programa AS programa_nombre
    FROM 
        solicitudes s
    LEFT JOIN 
        documentos d ON s.id_documentos = d.id
    LEFT JOIN 
        tesis t ON d.tesis_id = t.id_tesis
    LEFT JOIN 
        estudiante e ON s.id_alumno = e.id
    LEFT JOIN 
        facultad_programa fp ON e.programa_id = fp.id
    WHERE 
        s.id_alumno = ?;
  `;

  executeQuery(sql, [idAlumno], (err, results) => {
    if (err) {
      console.error('Error al buscar solicitudes:', err);
      callback({ message: 'Error al buscar solicitudes' }, null);
    } else {
      console.log('Solicitudes encontradas:', results);
      callback(null, results);
    }
  });
}

