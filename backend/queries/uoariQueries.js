import { executeQuery } from '../config/db.js';

export function fetchUoariData(userId, callback) {
    const sql = `
        SELECT 
            u.id::integer,
            u.name,
            u.email,
            u.current_team_id::integer,
            r.name AS role_name,
            r.guard_name
        FROM users u
        JOIN roles r ON u.current_team_id = r.id
        WHERE u.id = $1;
    `;

    // Ejecutar la consulta para obtener los datos de UOARI
    executeQuery(sql, [userId], (err, results) => {
        if (err || results.length === 0) {  // Ya no es necesario usar results.rows.length
            console.error('Error al buscar datos de UOARI:', err);
            callback({ message: 'Error al buscar datos de UOARI' }, null);
        } else {
            console.log('Datos de UOARI encontrados:', results[0]);  // Ya no es necesario usar results.rows[0]
            callback(null, results[0]);
        }
    });
}


export function listUoariData(callback) {
    const sql = `
        SELECT 
            s.id,
            ts.titulo AS "Titulo",
            ts.tipo_tesis AS "Tipo",
            f.nombre AS "Facultad",
            gr.grado AS "Grado",
            u.estado AS "Estado"
        FROM solicitudes s
        JOIN documentos doc ON s.id_documentos = doc.id
        JOIN tesis ts ON doc.tesis_id = ts.id_tesis
        JOIN facultad f ON s.id_facultad = f.id
        JOIN grado gr ON s.id_grado = gr.id
        LEFT JOIN uoari u ON s.id = u.solicitud_id
        WHERE s.id_estado = 1 AND u.estado IS null; -- El estado siempre será 1 y u.estado debe ser nulo
    `;

    // Ejecutar la consulta para obtener los datos de UOARI
    executeQuery(sql, [], (err, results) => {
        if (err || results.length === 0) {
            console.error('Error al buscar datos de UOARI:', err);
            callback({ message: 'Error al buscar datos de UOARI' }, null);
        } else {
            console.log('Datos de UOARI encontrados:', results);
            callback(null, results);
        }
    });
}

export function listAbiertoUoariData(callback) {
    const sql = `
        SELECT 
            s.id,
            ts.titulo AS "Titulo",
            ts.tipo_tesis AS "Tipo",
            f.nombre AS "Facultad",
            gr.grado AS "Grado",
            u.estado AS "Estado"
        FROM solicitudes s
        JOIN documentos doc ON s.id_documentos = doc.id
        JOIN tesis ts ON doc.tesis_id = ts.id_tesis
        JOIN facultad f ON s.id_facultad = f.id
        JOIN grado gr ON s.id_grado = gr.id
        LEFT JOIN uoari u ON s.id = u.solicitud_id
        WHERE s.id_estado = 1 AND u.estado = 1; -- El estado siempre será 1 y u.estado debe ser nulo
    `;

    // Ejecutar la consulta para obtener los datos de UOARI
    executeQuery(sql, [], (err, results) => {
        if (err || results.length === 0) {
            console.error('Error al buscar datos de UOARI:', err);
            callback({ message: 'Error al buscar datos de UOARI' }, null);
        } else {
            console.log('Datos de UOARI encontrados:', results);
            callback(null, results);
        }
    });
}

export function listCerradoUoariData(callback) {
    const sql = `
        SELECT 
            s.id,
            ts.titulo AS "Titulo",
            ts.tipo_tesis AS "Tipo",
            f.nombre AS "Facultad",
            gr.grado AS "Grado",
            u.estado AS "Estado"
        FROM solicitudes s
        JOIN documentos doc ON s.id_documentos = doc.id
        JOIN tesis ts ON doc.tesis_id = ts.id_tesis
        JOIN facultad f ON s.id_facultad = f.id
        JOIN grado gr ON s.id_grado = gr.id
        LEFT JOIN uoari u ON s.id = u.solicitud_id
        WHERE s.id_estado = 1 AND u.estado = 2; -- El estado siempre será 1 y u.estado debe ser nulo
    `;

    // Ejecutar la consulta para obtener los datos de UOARI
    executeQuery(sql, [], (err, results) => {
        if (err || results.length === 0) {
            console.error('Error al buscar datos de UOARI:', err);
            callback({ message: 'Error al buscar datos de UOARI' }, null);
        } else {
            console.log('Datos de UOARI encontrados:', results);
            callback(null, results);
        }
    });
}

export function listEmbargoUoariData(callback) {
    const sql = `
        SELECT 
            s.id,
            ts.titulo AS "Titulo",
            ts.tipo_tesis AS "Tipo",
            f.nombre AS "Facultad",
            gr.grado AS "Grado",
            u.estado AS "Estado"
        FROM solicitudes s
        JOIN documentos doc ON s.id_documentos = doc.id
        JOIN tesis ts ON doc.tesis_id = ts.id_tesis
        JOIN facultad f ON s.id_facultad = f.id
        JOIN grado gr ON s.id_grado = gr.id
        LEFT JOIN uoari u ON s.id = u.solicitud_id
        WHERE s.id_estado = 1 AND u.estado = 3; -- El estado siempre será 1 y u.estado debe ser nulo
    `;

    // Ejecutar la consulta para obtener los datos de UOARI
    executeQuery(sql, [], (err, results) => {
        if (err || results.length === 0) {
            console.error('Error al buscar datos de UOARI:', err);
            callback({ message: 'Error al buscar datos de UOARI' }, null);
        } else {
            console.log('Datos de UOARI encontrados:', results);
            callback(null, results);
        }
    });
}


export function uoariData(solicitudId, callback) {
  const sql = `
      SELECT 
          ts.titulo AS Titulo,
          CONCAT(at1.apellidos_pat,' ',at1.apellidos_mat,' ',at1.nombre) AS Autor1,
          at1.identificacion_id AS DNI_autor1,
          CONCAT(at2.apellidos_pat,' ',at2.apellidos_mat,' ',at2.nombre) AS Autor2,
          at2.identificacion_id AS DNI_autor2,
          CONCAT(ass1.apellidos_pat,' ',ass1.apellidos_mat,' ',ass1.nombre) AS Asesor1,
          ass1.identificacion_id AS DNI_asesor1,
          ass1.orcid AS ORCID_asesor1,
          CONCAT(ass2.apellidos_pat,' ',ass2.apellidos_mat,' ',ass2.nombre) AS Asesor2,
          ass2.identificacion_id AS DNI_asesor2,
          ass2.orcid AS ORCID_asesor2,
          CONCAT(jf.apellidos_pat,' ',jf.apellidos_mat,' ',jf.nombre) AS Presidente_jurado,
          jf.identificacion_id AS DNI_presidente,
          CONCAT(jr1.apellidos_pat,' ',jr1.apellidos_mat,' ',jr1.nombre) AS Jurado1,
          jr1.identificacion_id AS DNI_jurado1,
          CONCAT(jr2.apellidos_pat,' ',jr2.apellidos_mat,' ',jr2.nombre) AS Jurado2,
          jr2.identificacion_id AS DNI_jurado2,
          CONCAT(jr3.apellidos_pat,' ',jr3.apellidos_mat,' ',jr3.nombre) AS Jurado3,
          jr3.identificacion_id AS DNI_jurado3
      FROM solicitudes s
      JOIN documentos doc ON s.id_documentos = doc.id
      JOIN metadata mt ON doc.metadatos_id = mt.id
      JOIN tesis ts ON doc.tesis_id = ts.id_tesis
      JOIN tesis_participacion tsp ON ts.id_participantes = tsp.id_participantes
      LEFT JOIN personas at1 ON tsp.id_autor1 = at1.idpersonas
      LEFT JOIN personas at2 ON tsp.id_autor2 = at2.idpersonas
      LEFT JOIN personas ass1 ON tsp.id_asesor1 = ass1.idpersonas
      LEFT JOIN personas ass2 ON tsp.id_asesor2 = ass2.idpersonas
      JOIN acta_sustentacion ast ON doc.actasust_id = ast.id
      LEFT JOIN personas jf ON ast.id_presidente = jf.idpersonas
      LEFT JOIN personas jr1 ON ast.id_miembro1 = jr1.idpersonas
      LEFT JOIN personas jr2 ON ast.id_miembro2 = jr2.idpersonas
      LEFT JOIN personas jr3 ON ast.id_miembro3 = jr3.idpersonas
      WHERE s.id = $1;
  `;

  // Ejecutar la consulta para obtener los datos de la tesis
  executeQuery(sql, [solicitudId], (err, results) => {
      if (err || results.length === 0) {
          console.error('Error al buscar datos:', err);
          callback({ message: 'Error al buscar datos' }, null);
      } else {
          console.log('Datos:', results[0]);
          callback(null, results[0]);
      }
  });
}


export function insertUoari(uoariDetails, callback) {
    const queryUoari = `
      INSERT INTO uoari (
        solicitud_id, estado, fecha_publicacion, editorial, cita, identificador, enlace, 
        tipo_publicacion, formato, idioma, palabra_clave, conocimiento, 
        resumen, patrocinio, notas, tipo_investigacion, nombre_grado, titulo_profesional, 
        programa, codigo_programa, institucion_otorgante, codigo_pais
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
      ) RETURNING id
    `;
  
    const uoariValues = [
      uoariDetails.solicitud_id,
      uoariDetails.estado,
      uoariDetails.fecha_publicacion,
      uoariDetails.editorial,
      uoariDetails.cita,
      uoariDetails.identificador,
      uoariDetails.enlace,
      uoariDetails.tipo_publicacion,
      uoariDetails.formato,
      uoariDetails.idioma,
      uoariDetails.palabra_clave,
      uoariDetails.conocimiento,
      uoariDetails.resumen,
      uoariDetails.patrocinio,
      uoariDetails.notas,
      uoariDetails.tipo_investigacion,
      uoariDetails.nombre_grado,
      uoariDetails.titulo_profesional,
      uoariDetails.programa,
      uoariDetails.codigo_programa,
      uoariDetails.institucion_otorgante,
      uoariDetails.codigo_pais
    ];
  
    executeQuery(queryUoari, uoariValues, (err, results) => {
      if (err) {
        console.error('Error al insertar en uoari:', err);
        callback(err, null);
      } else {
        const uoariId = results[0].id; // Obtenemos el ID del registro insertado
        callback(null, uoariId);
      }
    });
}


export function updateUoari(uoariDetails, callback) {
    const queryUoari = `
      UPDATE uoari SET
        estado = $1,
        fecha_publicacion = $2,
        editorial = $3,
        cita = $4,
        identificador = $5,
        enlace = $6,
        tipo_publicacion = $7,
        formato = $8,
        idioma = $9,
        palabra_clave = $10,
        conocimiento = $11,
        resumen = $12,
        patrocinio = $13,
        notas = $14,
        tipo_investigacion = $15,
        nombre_grado = $16,
        titulo_profesional = $17,
        programa = $18,
        codigo_programa = $19,
        institucion_otorgante = $20
      WHERE solicitud_id = $21
      RETURNING id
    `;
  
    const uoariValues = [
      uoariDetails.estado,
      uoariDetails.fecha_publicacion,
      uoariDetails.editorial,
      uoariDetails.cita,
      uoariDetails.identificador,
      uoariDetails.enlace,
      uoariDetails.tipo_publicacion,
      uoariDetails.formato,
      uoariDetails.idioma,
      uoariDetails.palabra_clave,
      uoariDetails.conocimiento,
      uoariDetails.resumen,
      uoariDetails.patrocinio,
      uoariDetails.notas,
      uoariDetails.tipo_investigacion,
      uoariDetails.nombre_grado,
      uoariDetails.titulo_profesional,
      uoariDetails.programa,
      uoariDetails.codigo_programa,
      uoariDetails.institucion_otorgante,
      uoariDetails.solicitud_id, // ID del registro a actualizar
    ];
  
    executeQuery(queryUoari, uoariValues, (err, results) => {
      if (err) {
        console.error('Error al actualizar en uoari:', err);
        callback(err, null);
      } else {
        const uoariId = results[0].id;
        callback(null, uoariId);
      }
    });
  }
  

