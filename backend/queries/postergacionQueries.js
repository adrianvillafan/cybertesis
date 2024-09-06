import { executeQuery } from '../config/db.js';

export const insertPostergacionPublicacion = (postergacionDetails, callback) => {
  const queryPostergacion = `
    INSERT INTO postergacion (
      file_url,
      created_by,
      updated_by,
      created_date,
      updated_date
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;
  const postergacionValues = [
    postergacionDetails.file_url,
    postergacionDetails.created_by,
    postergacionDetails.updated_by,
    new Date(),
    new Date()
  ];

  executeQuery(queryPostergacion, postergacionValues, (err, results) => {
    if (err) {
      console.error('Error al insertar Postergación de Publicación:', err);
      callback(err, null);
    } else {
      const postergacionId = results[0].id; // Ya no es necesario usar results.rows

      const queryUpdateDocumentos = `
        UPDATE documentos SET postergacion_id = $1 WHERE id = $2
      `;
      executeQuery(queryUpdateDocumentos, [postergacionId, postergacionDetails.documentos_id], (err, updateResults) => {
        if (err) {
          console.error('Error al actualizar documentos:', err);
          callback(err, null);
        } else {
          callback(null, postergacionId);
        }
      });
    }
  });
};

export const getPostergacionPublicacionById = (id, callback) => {
  const query = `
    SELECT 
      id,
      file_url,
      created_by,
      updated_by,
      created_date,
      updated_date
    FROM
      postergacion
    WHERE
      id = $1
  `;
  executeQuery(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener Postergación de Publicación por ID:', err);
      callback(err, null);
    } else {
      callback(null, results[0]); // Ya no es necesario usar results.rows[0]
    }
  });
};

export const deletePostergacionPublicacionById = (id, callback) => {
  // Actualizamos la tabla de documentos para desvincular la postergación
  const queryUpdateDocumentos = 'UPDATE documentos SET postergacion_id = NULL WHERE postergacion_id = $1';

  executeQuery(queryUpdateDocumentos, [id], (err, updateResults) => {
    if (err) {
      console.error('Error al actualizar documentos:', err);
      return callback(err, null);
    }

    // Finalmente, eliminamos la postergación
    const queryDeletePostergacion = 'DELETE FROM postergacion WHERE id = $1';

    executeQuery(queryDeletePostergacion, [id], (err, deleteResults) => {
      if (err) {
        console.error('Error al eliminar Postergación de Publicación:', err);
        return callback(err, null);
      }

      callback(null, deleteResults.rowCount); // Ya no es necesario usar results.rowCount
    });
  });
};
