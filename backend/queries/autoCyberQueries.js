import { executeQuery } from '../config/db.js';

export const insertAutoCyber = (autoCyberDetails, callback) => {
  const queryAutoCyber = `
    INSERT INTO auto_cyber (
      file_url,
      created_by,
      updated_by,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?)
  `;
  const autoCyberValues = [
    autoCyberDetails.file_url,
    autoCyberDetails.created_by,
    autoCyberDetails.updated_by,
    new Date(),
    new Date()
  ];

  executeQuery(queryAutoCyber, autoCyberValues, (err, results) => {
    if (err) {
      console.error('Error al insertar auto_cyber:', err);
      callback(err, null);
    } else {
      const autoCyberId = results.insertId;

      const queryUpdateDocumentos = `
        UPDATE documentos SET autocyber_id = ? WHERE id = ?
      `;
      executeQuery(queryUpdateDocumentos, [autoCyberId, autoCyberDetails.documentos_id], (err, results) => {
        if (err) {
          console.error('Error al actualizar documentos:', err);
          callback(err, null);
        } else {
          callback(null, autoCyberId);
        }
      });
    }
  });
};

// Obtener un registro de auto_cyber por ID
export const getAutoCyberById = (id, callback) => {
  const query = `
    SELECT 
      id,
      file_url,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM
      auto_cyber
    WHERE
      id = ?
  `;
  executeQuery(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener auto_cyber por ID:', err);
      callback(err, null);
    } else {
      callback(null, results[0]);
    }
  });
};

// Eliminar un registro de auto_cyber por ID
export const deleteAutoCyberById = (id, callback) => {
  // Actualizamos la tabla de documentos
  const queryUpdateDocumentos = 'UPDATE documentos SET autocyber_id = NULL WHERE autocyber_id = ?';

  executeQuery(queryUpdateDocumentos, [id], (err, results) => {
    if (err) {
      console.error('Error al actualizar documentos:', err);
      return callback(err, null);
    }

    // Finalmente, eliminamos el auto_cyber
    const queryDeleteAutoCyber = 'DELETE FROM auto_cyber WHERE id = ?';

    executeQuery(queryDeleteAutoCyber, [id], (err, results) => {
      if (err) {
        console.error('Error al eliminar auto_cyber:', err);
        return callback(err, null);
      }

      callback(null, results.affectedRows);
    });
  });
};
