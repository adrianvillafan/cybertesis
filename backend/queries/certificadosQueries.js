import { executeQuery } from '../config/db.js';

export const insertCertificadoSimilitud = (certificadoDetails, callback) => {
  const queryCertificado = `
    INSERT INTO certificado_similitud (
      file_url,
      created_by,
      updated_by,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?)
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
      const certificadoId = results.insertId;

      const queryUpdateDocumentos = `
        UPDATE documentos SET certsimil_id = ? WHERE id = ?
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
      id = ?
  `;
  executeQuery(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener certificado de similitud por ID:', err);
      callback(err, null);
    } else {
      callback(null, results[0]);
    }
  });
};

// Eliminar un registro de certificado de similitud por ID
export const deleteCertificadoSimilitudById = (id, callback) => {
  // Actualizamos la tabla de documentos
  const queryUpdateDocumentos = 'UPDATE documentos SET certsimil_id = NULL WHERE certsimil_id = ?';

  executeQuery(queryUpdateDocumentos, [id], (err, results) => {
    if (err) {
      console.error('Error al actualizar documentos:', err);
      return callback(err, null);
    }

    // Finalmente, eliminamos el certificado de similitud
    const queryDeleteCertificado = 'DELETE FROM certificado_similitud WHERE id = ?';

    executeQuery(queryDeleteCertificado, [id], (err, results) => {
      if (err) {
        console.error('Error al eliminar certificado de similitud:', err);
        return callback(err, null);
      }

      callback(null, results.affectedRows);
    });
  });
};
