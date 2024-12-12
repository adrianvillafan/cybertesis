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


export function listUoariData(dataId, callback) {
    const sql = `
        SELECT id
        FROM solicitudes s
        WHERE s.id_estado = $1;
    `;

    // Ejecutar la consulta para obtener los datos de UOARI
    executeQuery(sql, [dataId], (err, results) => {
        if (err || results.length === 0) {  // Ya no es necesario usar results.rows.length
            console.error('Error al buscar datos de UOARI:', err);
            callback({ message: 'Error al buscar datos de UOARI' }, null);
        } else {
            console.log('Datos de UOARI encontrados:', results[0]);  // Ya no es necesario usar results.rows[0]
            callback(null, results[0]);
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


