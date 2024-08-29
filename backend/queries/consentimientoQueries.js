import { executeQuery } from '../config/db.js';

export const insertConsentimientoInformado = (consentimientoDetails, callback) => {
  const queryConsentimiento = `
    INSERT INTO consentimiento (
      file_url,
      created_by,
      updated_by,
      created_date,
      updated_date
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;
  const consentimientoValues = [
    consentimientoDetails.file_url,
    consentimientoDetails.created_by,
    consentimientoDetails.updated_by,
    new Date(),
    new Date()
  ];

  executeQuery(queryConsentimiento, consentimientoValues, (err, results) => {
    if (err) {
      console.error('Error al insertar Consentimiento Informado:', err);
      callback(err, null);
    } else {
      const consentimientoId = results.rows[0].id;  // PostgreSQL utiliza 'rows' para devolver los resultados

      const queryUpdateDocumentos = `
        UPDATE documentos SET consentimiento_id = $1 WHERE id = $2
      `;
      executeQuery(queryUpdateDocumentos, [consentimientoId, consentimientoDetails.documentos_id], (err, results) => {
        if (err) {
          console.error('Error al actualizar documentos:', err);
          callback(err, null);
        } else {
          callback(null, consentimientoId);
        }
      });
    }
  });
};

export const getConsentimientoInformadoById = (id, callback) => {
  const query = `
    SELECT 
      id,
      file_url,
      created_by,
      updated_by,
      created_date,
      updated_date
    FROM
      consentimiento
    WHERE
      id = $1
  `;
  executeQuery(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener Consentimiento Informado por ID:', err);
      callback(err, null);
    } else {
      callback(null, results.rows[0]);  // PostgreSQL utiliza 'rows' para devolver los resultados
    }
  });
};

export const deleteConsentimientoInformadoById = (id, callback) => {
  const queryUpdateDocumentos = 'UPDATE documentos SET consentimiento_id = NULL WHERE consentimiento_id = $1';

  executeQuery(queryUpdateDocumentos, [id], (err, results) => {
    if (err) {
      console.error('Error al actualizar documentos:', err);
      return callback(err, null);
    }

    const queryDeleteConsentimiento = 'DELETE FROM consentimiento WHERE id = $1';

    executeQuery(queryDeleteConsentimiento, [id], (err, results) => {
      if (err) {
        console.error('Error al eliminar Consentimiento Informado:', err);
        return callback(err, null);
      }

      callback(null, results.rowCount);  // PostgreSQL utiliza 'rowCount' para contar las filas afectadas
    });
  });
};
