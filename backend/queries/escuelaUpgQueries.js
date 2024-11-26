//backend/queries/escuelaUpgQueries.js

import { executeQuery } from '../config/db.js';

export function fetchEscuelaUpgData(userId, callback) {
    const sql = `
      SELECT 
          unidades.user_id::integer,
          facultad.id AS facultad_id,
          facultad.nombre AS nombre_facultad,
          grado.id AS grado_id,
          grado.grado AS nombre_grado,
          users.name,
          users.current_team_id::integer,
          users.email,
          roles.guard_name,
          CASE
              WHEN unidades.grado_id = 1 THEN json_build_object(
                  'id_escuela', MAX(e.id), 
                  'nombre_escuela', MAX(e.nombre), 
                  'tipo_escuela', MAX(e.tipo)
              )
              ELSE json_agg(json_build_object(
                  'id_escuela', e.id, 
                  'nombre_escuela', e.nombre, 
                  'tipo_escuela', e.tipo
              ))
          END AS escuelas
      FROM unidades
      INNER JOIN facultad ON unidades.facultad_id = facultad.id
      INNER JOIN grado ON unidades.grado_id = grado.id
      INNER JOIN users ON unidades.user_id = users.id
      INNER JOIN roles ON users.current_team_id = roles.id
      LEFT JOIN escuela e ON e.facultad_id = facultad.id OR e.id = unidades.escuela_id
      WHERE unidades.user_id = $1 AND users.current_team_id = 3
      GROUP BY 
          unidades.user_id, 
          facultad.id, 
          facultad.nombre, 
          grado.id, 
          grado.grado, 
          users.name, 
          users.current_team_id, 
          users.email, 
          roles.guard_name, 
          unidades.grado_id;
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

export function fetchListaAlumnos({ escuelaId, gradoId }, callback) {
  const sql = `
    SELECT 
        estudiante.codigo_estudiante,
        estudiante.user_id,
        estudiante.persona_id,
        personas.identificacion_id AS dni,
        personas.nombre,
        CONCAT(personas.apellidos_pat, ' ', personas.apellidos_mat) AS apellidos
    FROM estudiante
    INNER JOIN personas ON estudiante.persona_id = personas.idpersonas
    WHERE estudiante.escuela_id = $1 AND estudiante.grado_id = $2;
  `;

  executeQuery(sql, [escuelaId, gradoId], (err, results) => {
    if (err) {
      console.error('Error al buscar datos de alumnos:', err);
      callback({ message: 'Error al buscar datos de alumnos' }, null);
    } else {
      console.log('Datos de alumnos encontrados:', results);
      callback(null, results);
    }
  });
}

export function fetchAlumnoData(studentId, callback) {
  const sql = `
    SELECT 
        estudiante.*,
        personas.*,
        facultad.nombre AS facultad_nombre,
        escuela.nombre AS escuela_nombre,
        CASE
            WHEN estudiante.programa_id IS NOT NULL THEN facultad_programa.programa
            ELSE NULL
        END AS programa_nombre
    FROM estudiante
    INNER JOIN personas ON estudiante.persona_id = personas.idpersonas
    INNER JOIN facultad ON estudiante.facultad_id = facultad.id
    INNER JOIN escuela ON estudiante.escuela_id = escuela.id
    LEFT JOIN facultad_programa ON estudiante.programa_id = facultad_programa.id
    WHERE estudiante.codigo_estudiante = $1;
  `;

  executeQuery(sql, [studentId], (err, results) => {
    if (err) {
      console.error('Error al obtener datos del alumno:', err);
      callback({ message: 'Error al obtener datos del alumno' }, null);
    } else {
      console.log('Datos del alumno encontrados:', results);
      callback(null, results[0]);  // Suponiendo que el código del estudiante es único, se espera un solo resultado
    }
  });
}

export function fetchProgramasByFacultadId(facultadId, callback) {
  const sql = `
    SELECT 
        id,
        facultad_id,
        programa,
        tipo,
        parent_id
    FROM 
        facultad_programa
    WHERE 
        facultad_id = $1 AND level = 2 AND tipo != 'pregrado' ;
  `;

  executeQuery(sql, [facultadId], (err, results) => {
    if (err) {
      console.error('Error al obtener la lista de programas de la facultad:', err);
      callback({ message: 'Error al obtener la lista de programas de la facultad' }, null);
    } else {
      console.log('Programas de la facultad encontrados:', results);
      callback(null, results);
    }
  });
}

export function fetchListaAlumnosByProgramaId(programaId, callback) {
  const sql = `
    SELECT 
        estudiante.codigo_estudiante,
        estudiante.user_id,
        estudiante.persona_id,
        personas.identificacion_id AS dni,
        personas.nombre,
        CONCAT(personas.apellidos_pat, ' ', personas.apellidos_mat) AS apellidos
    FROM estudiante
    INNER JOIN personas ON estudiante.persona_id = personas.idpersonas
    WHERE estudiante.programa_id = $1;
  `;

  executeQuery(sql, [programaId], (err, results) => {
    if (err) {
      console.error('Error al buscar datos de alumnos del programa:', err);
      callback({ message: 'Error al buscar datos de alumnos del programa' }, null);
    } else {
      console.log('Datos de alumnos del programa encontrados:', results);
      callback(null, results);
    }
  });
}
export function fetchDocumentosPorEstudiante({ facultadId, gradoId, escuelaIds }, callback) {
  const sql = `
    SELECT 
        e.id AS estudiante_id,
        e.codigo_estudiante,
        p.identificacion_id,
        CONCAT(p.nombre, ' ', p.apellidos_pat, ' ', p.apellidos_mat) AS nombre_completo,
        d.id AS documento_id,
        d.Fecha_Carga,
        d.estado_id,
        d.tesis_id,
        d.actasust_id,
        d.certsimil_id,
        d.autocyber_id,
        d.metadatos_id,
        d.repturnitin_id,
        d.consentimiento_id,
        d.postergacion_id,
        d.usuarioCarga_id,
        d.Ultima_Modificacion,
        d.solicitud_id
    FROM
        estudiante e
    JOIN
        personas p ON e.persona_id = p.idpersonas
    JOIN
        documentos d ON e.id = d.estudiante_id
    WHERE
        e.facultad_id = $1
        AND e.grado_id = $2
        AND e.escuela_id = ANY ($3::int[])
  `;

  executeQuery(sql, [facultadId, gradoId, escuelaIds], (err, results) => {
    if (err) {
      console.error('Error al buscar datos de documentos por estudiante:', err);
      callback({ message: 'Error al buscar datos de documentos por estudiante' }, null);
    } else {
      console.log('Datos de documentos por estudiante encontrados:', results);
      callback(null, results);
    }
  });
}

export function fetchSolicitudesObservadasPorFacultadYGrado(facultadId, gradoId, callback) {
  const sql = `
      SELECT 
          s.id AS solicitud_id,
          s.id_documentos AS documento_id,
          s.id_estado AS estado_solicitud,
          e.id AS estudiante_id,
          e.codigo_estudiante,
          p.identificacion_id,
          CONCAT(p.nombre, ' ', p.apellidos_pat, ' ', p.apellidos_mat) AS nombre_completo,
          f.nombre AS facultad,
          g.grado,
          fp.programa,
          ARRAY(
              SELECT json_build_object(
                  'tipo_documento_observado', tipo_documento_observado,
                  'tipo_documento_id', tipo_documento_id,
                  'id_documento_observado', id_documento_observado
              )
              FROM (
                  SELECT 'Tesis' AS tipo_documento_observado, 1 AS tipo_documento_id, d.tesis_id AS id_documento_observado
                  FROM solicitudes s2
                  WHERE s2.id = s.id AND s2.tesis_estado = 2
                  UNION ALL
                  SELECT 'Acta de Sustentacion', 2, d.actasust_id
                  FROM solicitudes s2
                  WHERE s2.id = s.id AND s2.acta_estado = 2
                  UNION ALL
                  SELECT 'Certificado de Similitud', 3, d.certsimil_id
                  FROM solicitudes s2
                  WHERE s2.id = s.id AND s2.certificado_estado = 2
                  UNION ALL
                  SELECT 'Autorizacion para el deposito de obra en Cybertesis', 4, d.autocyber_id
                  FROM solicitudes s2
                  WHERE s2.id = s.id AND s2.auto_estado = 2
                  UNION ALL
                  SELECT 'Hoja de Metadatos', 5, d.metadatos_id
                  FROM solicitudes s2
                  WHERE s2.id = s.id AND s2.metadatos_estado = 2
                  UNION ALL
                  SELECT 'Reporte de Turnitin', 6, d.repturnitin_id
                  FROM solicitudes s2
                  WHERE s2.id = s.id AND s2.turnitin_estado = 2
                  UNION ALL
                  SELECT 'Consentimiento informado', 7, d.consentimiento_id
                  FROM solicitudes s2
                  WHERE s2.id = s.id AND s2.consentimiento_estado = 2
                  UNION ALL
                  SELECT 'Solicitud de Postergacion', 8, d.postergacion_id
                  FROM solicitudes s2
                  WHERE s2.id = s.id AND s2.postergacion_estado = 2
              ) observed_docs
          ) AS documentos_observados
      FROM solicitudes s
      JOIN documentos d ON s.id_documentos = d.id
      JOIN estudiante e ON d.estudiante_id = e.id
      JOIN personas p ON e.persona_id = p.idpersonas
      JOIN facultad f ON e.facultad_id = f.id
      JOIN grado_academico g ON e.grado_id = g.id
      JOIN facultad_programa fp ON e.programa_id = fp.id
      WHERE s.id_estado = 2
        AND e.facultad_id = $1
        AND e.grado_id = $2
      ORDER BY s.fecha_alum DESC;



  `;

  executeQuery(sql, [facultadId, gradoId], (err, results) => {
      if (err) {
          console.error('Error al obtener solicitudes observadas por facultad y grado:', err);
          callback({ message: 'Error al obtener solicitudes observadas por facultad y grado' }, null);
      } else {
          console.log('Solicitudes observadas encontradas:', results);
          callback(null, results);
      }
  });
}

