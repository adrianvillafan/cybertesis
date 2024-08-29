import { executeQuery } from '../config/db.js';

export function fetchEscuelaUpgData(userId, callback) {
    const sql = `
      SELECT 
          unidades.user_id,
          facultad.id AS facultad_id,
          facultad.nombre AS nombre_facultad,
          grado.id AS grado_id,
          grado.grado AS nombre_grado,
          users.name,
          users.current_team_id,
          users.email,
          roles.guard_name,
          CASE
              WHEN unidades.grado_id = 1 THEN (
                  SELECT json_build_object('id_escuela', e.id, 'nombre_escuela', e.nombre, 'tipo_escuela', e.tipo)
                  FROM escuela e
                  WHERE e.id = unidades.escuela_id
              )
              ELSE (
                  SELECT json_agg(json_build_object('id_escuela', e.id, 'nombre_escuela', e.nombre, 'tipo_escuela', e.tipo))
                  FROM escuela e
                  WHERE e.facultad_id = facultad.id
              )
          END AS escuelas
      FROM unidades
      INNER JOIN facultad ON unidades.facultad_id = facultad.id
      LEFT JOIN escuela ON unidades.escuela_id = escuela.id
      INNER JOIN grado ON unidades.grado_id = grado.id
      INNER JOIN users ON unidades.user_id = users.id
      INNER JOIN roles ON users.current_team_id = roles.id
      WHERE unidades.user_id = $1 AND users.current_team_id = 3
      GROUP BY unidades.user_id, facultad.id, facultad.nombre, grado.id, grado.grado, users.name, users.current_team_id, users.email, roles.guard_name, unidades.grado_id, escuela.id, escuela.nombre, escuela.tipo;
    `;

    executeQuery(sql, [userId], (err, results) => {
        if (err || results.rows.length === 0) {
            console.error('Error al buscar datos de escuela UPG:', err);
            callback({ message: 'Error al buscar datos de escuela UPG' }, null);
        } else {
            console.log('Datos de escuela UPG encontrados:', results.rows[0]);
            callback(null, results.rows[0]);
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
      console.log('Datos de alumnos encontrados:', results.rows);
      callback(null, results.rows);
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
      console.log('Datos del alumno encontrados:', results.rows);
      callback(null, results.rows[0]);  // Suponiendo que el código del estudiante es único, se espera un solo resultado
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
      console.log('Programas de la facultad encontrados:', results.rows);
      callback(null, results.rows);
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
      console.log('Datos de alumnos del programa encontrados:', results.rows);
      callback(null, results.rows);
    }
  });
}

// NUEVA FUNCIÓN: fetchDocumentosPorEstudiante

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
      console.log('Datos de documentos por estudiante encontrados:', results.rows);
      callback(null, results.rows);
    }
  });
}
