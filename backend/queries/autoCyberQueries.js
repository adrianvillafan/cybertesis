import { executeQuery } from '../config/db.js';

export const insertAutoCyber = (autoCyberDetails, callback) => {
  const queryAutoCyber = `
    INSERT INTO auto_cyber (
      file_url,
      created_by,
      updated_by,
      created_at,
      updated_at
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;
  const autoCyberValues = [
    autoCyberDetails.file_url,
    autoCyberDetails.created_by,
    autoCyberDetails.updated_by,
    new Date(),
    new Date()
  ];

  // Ejecutar la inserción del registro en auto_cyber
  executeQuery(queryAutoCyber, autoCyberValues, (err, results) => {
    if (err) {
      console.error('Error al insertar auto_cyber:', err);
      callback(err, null);
    } else {
      const autoCyberId = results[0].id;  // Ya no necesitas acceder a `results.rows`

      const queryUpdateDocumentos = `
        UPDATE documentos SET autocyber_id = $1 WHERE id = $2
      `;

      // Actualizar la tabla documentos con el ID del auto_cyber insertado
      executeQuery(queryUpdateDocumentos, [autoCyberId, autoCyberDetails.documentos_id], (err, updateResults) => {
        if (err) {
          console.error('Error al actualizar documentos:', err);
          callback(err, null);
        } else {
          callback(null, autoCyberId);  // Devolvemos el ID del registro insertado
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
      id = $1
  `;

  // Ejecutar la consulta para obtener el registro de auto_cyber por ID
  executeQuery(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener auto_cyber por ID:', err);
      callback(err, null);
    } else {
      callback(null, results[0]);  // Ya no es necesario acceder a `results.rows[0]`
    }
  });
};

// Eliminar un registro de auto_cyber por ID
export const deleteAutoCyberById = (id, callback) => {
  // Actualizamos la tabla de documentos para desvincular el auto_cyber
  const queryUpdateDocumentos = 'UPDATE documentos SET autocyber_id = NULL WHERE autocyber_id = $1';

  executeQuery(queryUpdateDocumentos, [id], (err, updateResults) => {
    if (err) {
      console.error('Error al actualizar documentos:', err);
      return callback(err, null);
    }

    // Finalmente, eliminamos el registro de auto_cyber
    const queryDeleteAutoCyber = 'DELETE FROM auto_cyber WHERE id = $1';

    executeQuery(queryDeleteAutoCyber, [id], (err, deleteResults) => {
      if (err) {
        console.error('Error al eliminar auto_cyber:', err);
        return callback(err, null);
      }

      callback(null, deleteResults.rowCount);  // Devolvemos el número de filas afectadas
    });
  });
};

