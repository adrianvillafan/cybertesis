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


// QUERY PARA LA TABLA PRINCIPAL //
export function listUoariData(callback) {
    const sql = `
        SELECT 
            u.id,
            s.id AS "Solicitud_ID",
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
        WHERE s.id_estado = 1 AND u.estado IS null -- El estado siempre será 1 y u.estado debe ser nulo
        ORDER BY s.id;
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
            u.id,
            s.id AS "Solicitud_ID",
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
        WHERE s.id_estado = 1 AND u.estado = 1 -- El estado siempre será 1 y u.estado debe ser nulo
        ORDER BY s.id;
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
            u.id,
            s.id AS "Solicitud_ID",
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
        WHERE s.id_estado = 1 AND u.estado = 2 -- El estado siempre será 1 y u.estado debe ser nulo
        ORDER BY s.id;
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
            u.id,
            s.id AS "Solicitud_ID",
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
        WHERE s.id_estado = 1 AND u.estado = 3 -- El estado siempre será 1 y u.estado debe ser nulo
        ORDER BY s.id;
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


// INSERTAR DATOS EN LA TABLA //
export function insertUoari(uoariDetails, callback) {
    const queryUoari = `
      INSERT INTO uoari (
        solicitud_id, estado, fecha_publicacion, editorial, cita, identificador, enlace, 
        tipo_publicacion, formato, idioma, palabra_clave, conocimiento, 
        resumen, patrocinio, notas, tipo_investigacion, nombre_grado, titulo_profesional, 
        programa, codigo_programa, institucion_otorgante, codigo_pais, licencia, fecha_creacion, fecha_modificacion
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
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
      uoariDetails.codigo_pais,
      uoariDetails.licencia,
      new Date(),
      new Date(),
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


// MOSTRAR DATOS DEL FORMULARIO //
export function formUoariData(uoariData, callback) {
    const sql = `
        SELECT 
            estado,
		    fecha_publicacion,
            editorial,
            cita,
            identificador,
            enlace,
            tipo_publicacion,
            formato,
            palabra_clave,
            conocimiento,
            resumen,
            patrocinio,
            notas,
            tipo_investigacion,
            nombre_grado,
            titulo_profesional,
            programa,
            codigo_programa,
            institucion_otorgante
        FROM uoari
        WHERE id=$1
    `;

    const uoariValues = [uoariData];

    // Ejecutar la consulta para obtener los datos de UOARI
    executeQuery(sql, uoariValues, (err, results) => {
        if (err || results.length === 0) {
            console.error('Error al buscar datos de UOARI:', err);
            callback({ message: 'Error al buscar datos de UOARI' }, null);
        } else {
            console.log('Datos de UOARI encontrados:', results);
            callback(null, results);
        }
    });
}


// ACTUALIZAR DATOS DEL FORMULARIO //
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
        palabra_clave = $9,
        conocimiento = $10,
        resumen = $11,
        patrocinio = $12,
        notas = $13,
        tipo_investigacion = $14,
        nombre_grado = $15,
        titulo_profesional = $16,
        programa = $17,
        codigo_programa = $18,
        institucion_otorgante = $19
      WHERE id = $20
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
      uoariDetails.id, // ID del registro a actualizar
    ];
  
    executeQuery(queryUoari, uoariValues, (err, results) => {
      if (err) {
        console.error('Error al actualizar en uoari:', err);
        callback(err, null);
      } else if (results.length === 0) {
        callback(new Error('No se encontró ningún registro para actualizar'), null);
      } else {
        const uoariId = results[0].id;
        callback(null, uoariId);
      }
    });
  }
  
  

  //ELIMINAR INOFRMACION DE LA TABLA //
export function deleteUoariBySolicitudId(uoariID, callback) {
    const queryUoari = `
      DELETE FROM uoari
      WHERE id = $1
    `;
  
    const uoariValues = [uoariID];
  
    executeQuery(queryUoari, uoariValues, (err, results) => {
      if (err) {
        console.error('Error al eliminar en uoari:', err);
        callback(err, null);
      } else {
        callback(null, results.rowCount); // Devuelve el número de filas afectadas
      }
    });
  }
