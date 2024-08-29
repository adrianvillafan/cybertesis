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

  executeQuery(queryCertificado, certificadoValues, (err, results) => {
    if (err) {
      console.error('Error al insertar certificado de similitud:', err);
      callback(err, null);
    } else {
      const certificadoId = results.rows[0].id;  // PostgreSQL utiliza 'rows' para devolver los resultados

      const queryUpdateDocumentos = `
        UPDATE documentos SET certsimil_id = $1 WHERE id = $2
      `;
      executeQuery(queryUpdateDocumentos, [certificadoId, certificadoDetails.documentos_id], (err, results) => {
        if (err) {
          console.error('Error al actualizar documentos:', err);
          callback(err, null);
        } else {
          callback(null, certificadoId);
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
  executeQuery(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener certificado de similitud por ID:', err);
      callback(err, null);
    } else {
      callback(null, results.rows[0]);  // PostgreSQL utiliza 'rows' para devolver los resultados
    }
  });
};

// Eliminar un registro de certificado de similitud por ID
export const deleteCertificadoSimilitudById = (id, callback) => {
  // Actualizamos la tabla de documentos
  const queryUpdateDocumentos = 'UPDATE documentos SET certsimil_id = NULL WHERE certsimil_id = $1';

  executeQuery(queryUpdateDocumentos, [id], (err, results) => {
    if (err) {
      console.error('Error al actualizar documentos:', err);
      return callback(err, null);
    }

    // Finalmente, eliminamos el certificado de similitud
    const queryDeleteCertificado = 'DELETE FROM certificado_similitud WHERE id = $1';

    executeQuery(queryDeleteCertificado, [id], (err, results) => {
      if (err) {
        console.error('Error al eliminar certificado de similitud:', err);
        return callback(err, null);
      }

      callback(null, results.rowCount);  // PostgreSQL utiliza 'rowCount' para contar las filas afectadas
    });
  });
};
