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


export const insertUoariData = (uoariDetails, callback) => {
  const queryInsertUoari = `
    INSERT INTO uoari (
      id_solicitud,
      autor,
      titulo1,
      titulo2,
      fecha_publicacion,
      editorial,
      como_citar,
      idioma,
      autor2,
      recurso_relacionado,
      numero_serie,
      numero_reporte,
      identificador,
      enlace,
      tipo_publicacion,
      formato,
      nivel_acceso,
      resumen,
      patrocinio,
      notas,
      codigo_pais,
      tipo_doc1,
      doc1,
      tipo_doc2,
      doc2,
      asesor1,
      asesor2,
      orcid1,
      orcid2,
      tipo_trabajo,
      nombre_grado,
      grado_academico,
      nombre_programa,
      codigo_programa,
      inst_otorgante,
      jurado1,
      jurado2
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
      $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
      $31, $32, $33, $34, $35, $36, $37, $38
    )
    RETURNING id
  `;

  const uoariValues = [
    uoariDetails.id_solicitud,
    uoariDetails.autor,
    uoariDetails.titulo1,
    uoariDetails.titulo2,
    uoariDetails.fecha_publicacion,
    uoariDetails.editorial,
    uoariDetails.como_citar,
    uoariDetails.idioma,
    uoariDetails.autor2,
    uoariDetails.recurso_relacionado,
    uoariDetails.numero_serie,
    uoariDetails.numero_reporte,
    uoariDetails.identificador,
    uoariDetails.enlace,
    uoariDetails.tipo_publicacion,
    uoariDetails.formato,
    uoariDetails.nivel_acceso,
    uoariDetails.resumen,
    uoariDetails.patrocinio,
    uoariDetails.notas,
    uoariDetails.codigo_pais,
    uoariDetails.tipo_doc1,
    uoariDetails.doc1,
    uoariDetails.tipo_doc2,
    uoariDetails.doc2,
    uoariDetails.asesor1,
    uoariDetails.asesor2,
    uoariDetails.orcid1,
    uoariDetails.orcid2,
    uoariDetails.tipo_trabajo,
    uoariDetails.nombre_grado,
    uoariDetails.grado_academico,
    uoariDetails.nombre_programa,
    uoariDetails.codigo_programa,
    uoariDetails.inst_otorgante,
    uoariDetails.jurado1,
    uoariDetails.jurado2,
  ];

  executeQuery(queryInsertUoari, uoariValues, (err, results) => {
    if (err) {
      console.error('Error al insertar datos:', err);
      callback(err, null);
    } else {
      const metadataId = results[0].id;

      const queryUpdateDocumentos = `
        UPDATE documentos SET metadatos_id = $1 WHERE id = $2
      `;
      executeQuery(queryUpdateDocumentos, [metadataId, uoariDetails.documentos_id], (err, updateResults) => {
        if (err) {
          console.error('Error al actualizar documentos:', err);
          callback(err, null);
        } else {
          callback(null, metadataId);
        }
      });
    }
  });
};
