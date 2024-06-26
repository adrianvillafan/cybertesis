import { executeQuery } from '../config/db.js';



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