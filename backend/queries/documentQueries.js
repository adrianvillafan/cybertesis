import { executeQuery } from '../config/db.js';

export function insertDocument(documentDetails, callback) {
  const query = `INSERT INTO documentos (tipo, url_documento, estudiante_id, estado_id, Tamaño, Fecha_Carga, usuarioCarga_id, Ultima_Modificacion, solicitud_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    documentDetails.tipo,
    documentDetails.urlDocumento,
    documentDetails.estudianteId,
    documentDetails.estadoId,
    documentDetails.tamano,
    documentDetails.fechaCarga,
    documentDetails.usuarioCargaId,
    documentDetails.ultimaModificacion,
    documentDetails.solicitudId
  ];

  executeQuery(query, values, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      callback(err, null);  // Llama al callback con error
    } else {
      // Asumimos que 'results' contiene la propiedad 'insertId'
      callback(null, results.insertId);  // Llama al callback con el ID del documento insertado
    }
  });
}

export async function deleteDocumentByFilename(filename) {
  const query = `DELETE FROM documentos WHERE url_documento = ?`;
  try {
    const result = await executeQuery(query, [filename]);
    return result.affectedRows; // Devuelve el número de filas afectadas
  } catch (error) {
    throw new Error('Error al eliminar el documento de la base de datos: ' + error.message);
  }
}

export const getDocumentosBySolicitudId = (solicitudId, callback) => {
  const sql = `
    SELECT documentos.id, documentos.tipo, documentos.url_documento, documentos.fecha_carga, tipodocumento.nombre AS tipo_documento
    FROM documentos
    INNER JOIN tipodocumento ON documentos.tipo = tipodocumento.id
    WHERE documentos.solicitud_id = ?;
  `;

  executeQuery(sql, [solicitudId], (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta para obtener documentos:', error);
      callback(error, null);
    } else {
      console.log('Documentos obtenidos:', results);
      callback(null, results);
    }
  });
};

export const createOrFetchDocumentos = (gradeId, studentId, userId, callback) => {
  const sqlCheck = `SELECT * FROM documentos WHERE estudiante_id = ? AND estado_id != 1`;

  executeQuery(sqlCheck, [studentId], (error, existingDocumentos) => {
    if (error) {
      console.error('Error al verificar documentos existentes:', error);
      callback(error, null);
    } else if (existingDocumentos.length > 0) {
      // Si existen documentos, los devolvemos
      callback(null, existingDocumentos[0]);
    } else {
      // Si no existen documentos, creamos una nueva entrada
      const sqlInsert = `INSERT INTO documentos (grado_id, estudiante_id, estado_id, Fecha_Carga, usuarioCarga_id, Ultima_Modificacion) VALUES (?, ?, 3, NOW(), ?, NOW())`;

      executeQuery(sqlInsert, [gradeId, studentId, userId], (insertError, insertResult) => {
        if (insertError) {
          console.error('Error al crear nuevo documento:', insertError);
          callback(insertError, null);
        } else {
          // Consultamos la fila recién creada para devolverla
          const sqlFetchNew = `SELECT * FROM documentos WHERE id = ?`;

          executeQuery(sqlFetchNew, [insertResult.insertId], (fetchError, newDocumentos) => {
            if (fetchError) {
              console.error('Error al obtener nuevo documento:', fetchError);
              callback(fetchError, null);
            } else {
              console.log('Nuevo documento creado y obtenido:', newDocumentos[0]);
              callback(null, newDocumentos[0]);
            }
          });
        }
      });
    }
  });
};