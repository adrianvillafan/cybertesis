import { executeQuery } from '../config/db.js';

export const insertCertificadoSimilitud = (certificadoDetails, callback) => {
  const queryCertificado = `
    INSERT INTO certificado_similitud (
      file_url,
      created_by,
      updated_by,
      created_at,
      updated_at
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;
  const certificadoValues = [
    certificadoDetails.file_url,
    certificadoDetails.created_by,
    certificadoDetails.updated_by,
    new Date(),
    new Date()
  ];

  // Ejecutar la consulta de inserción
  executeQuery(queryCertificado, certificadoValues, (err, results) => {
    if (err) {
      console.error('Error al insertar certificado de similitud:', err);
      callback(err, null);
    } else {
      const certificadoId = results[0].id;  // Ya no necesitas acceder a `results.rows`

      const queryUpdateDocumentos = `
        UPDATE documentos SET certsimil_id = $1 WHERE id = $2
      `;

      // Actualizar la tabla documentos con el ID del certificado insertado
      executeQuery(queryUpdateDocumentos, [certificadoId, certificadoDetails.documentos_id], (err, updateResults) => {
        if (err) {
          console.error('Error al actualizar documentos:', err);
          callback(err, null);
        } else {
          callback(null, certificadoId);  // Devolvemos el ID del certificado insertado
        }
      });
    }
  });
};

// Obtener un registro de certificado de similitud por ID
export const getCertificadoSimilitudById = (id, callback) => {
  const query = `
    SELECT 
      id,
      file_url,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM
      certificado_similitud
    WHERE
      id = $1
  `;

  // Ejecutar la consulta para obtener el certificado de similitud por ID
  executeQuery(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener certificado de similitud por ID:', err);
      callback(err, null);
    } else {
      callback(null, results[0]);  // Ya no es necesario acceder a `results.rows[0]`
    }
  });
};

// Eliminar un registro de certificado de similitud por ID
export const deleteCertificadoSimilitudById = (id, callback) => {
  // Actualizamos la tabla de documentos para desvincular el certificado
  const queryUpdateDocumentos = 'UPDATE documentos SET certsimil_id = NULL WHERE certsimil_id = $1';

  executeQuery(queryUpdateDocumentos, [id], (err, updateResults) => {
    if (err) {
      console.error('Error al actualizar documentos:', err);
      return callback(err, null);
    }

    // Finalmente, eliminamos el registro de certificado de similitud
    const queryDeleteCertificado = 'DELETE FROM certificado_similitud WHERE id = $1';

    executeQuery(queryDeleteCertificado, [id], (err, deleteResults) => {
      if (err) {
        console.error('Error al eliminar certificado de similitud:', err);
        return callback(err, null);
      }

      callback(null, deleteResults.rowCount);  // Devolvemos el número de filas afectadas
    });
  });
};
