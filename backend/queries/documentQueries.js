//backend/queries/documentQueries.js

import { executeQuery } from '../config/db.js';

export const createOrFetchDocumentos = (gradeId, studentId, userId, callback) => {
  const sqlCheck = `SELECT * FROM documentos WHERE estudiante_id = $1 AND estado_id != 1`;

  // Primer paso: verificar si ya existen documentos
  executeQuery(sqlCheck, [studentId], (error, existingDocumentos) => {
    if (error) {
      console.error('Error al verificar documentos existentes:', error);
      callback(error, null);
    } else if (existingDocumentos.length > 0) {
      // Si existen documentos, los devolvemos
      callback(null, existingDocumentos[0]); // Devolvemos el primer documento encontrado
    } else {
      // Si no existen documentos, creamos una nueva entrada
      const sqlInsert = `
        INSERT INTO documentos (grado_id, estudiante_id, estado_id, "fecha_carga", usuariocarga_id, "ultima_modificacion")
        VALUES ($1, $2, 3, NOW(), $3, NOW())
        RETURNING id
      `;

      // Segundo paso: insertar el nuevo documento
      executeQuery(sqlInsert, [gradeId, studentId, userId], (insertError, insertResult) => {
        if (insertError) {
          console.error('Error al crear nuevo documento:', insertError);
          callback(insertError, null);
        } else if (insertResult && insertResult.length > 0) {
          const newId = insertResult[0].id; // Accedemos directamente al ID del nuevo documento
          console.log('Nuevo ID de documento creado:', newId);

          // Tercer paso: obtener el documento recién creado para devolverlo
          const sqlFetchNew = `SELECT * FROM documentos WHERE id = $1`;

          executeQuery(sqlFetchNew, [newId], (fetchError, newDocumentos) => {
            if (fetchError) {
              console.error('Error al obtener nuevo documento:', fetchError);
              callback(fetchError, null);
            } else {
              console.log('Nuevo documento creado y obtenido:', newDocumentos[0]);
              callback(null, newDocumentos[0]); // Devolvemos el nuevo documento
            }
          });
        } else {
          console.error('No se devolvió ningún ID del documento creado.');
          callback('No se devolvió ningún ID del documento creado', null);
        }
      });
    }
  });
};
