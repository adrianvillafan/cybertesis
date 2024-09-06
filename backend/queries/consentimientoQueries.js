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

  // Ejecutar la consulta de inserción
  executeQuery(queryConsentimiento, consentimientoValues, (err, results) => {
    if (err) {
      console.error('Error al insertar Consentimiento Informado:', err);
      callback(err, null);
    } else {
      const consentimientoId = results[0].id;  // Ya no necesitas acceder a `results.rows`

      const queryUpdateDocumentos = `
        UPDATE documentos SET consentimiento_id = $1 WHERE id = $2
      `;

      // Actualizar la tabla documentos con el ID del consentimiento insertado
      executeQuery(queryUpdateDocumentos, [consentimientoId, consentimientoDetails.documentos_id], (err, updateResults) => {
        if (err) {
          console.error('Error al actualizar documentos:', err);
          callback(err, null);
        } else {
          callback(null, consentimientoId);  // Devolvemos el ID del consentimiento insertado
        }
      });
    }
  });
};


// Obtener un registro de Consentimiento Informado por ID
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

  // Ejecutar la consulta para obtener el Consentimiento Informado por ID
  executeQuery(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener Consentimiento Informado por ID:', err);
      callback(err, null);
    } else {
      callback(null, results[0]);  // Ya no es necesario acceder a `results.rows[0]`
    }
  });
};


// Eliminar un registro de Consentimiento Informado por ID
export const deleteConsentimientoInformadoById = (id, callback) => {
  // Actualizamos la tabla de documentos para desvincular el consentimiento
  const queryUpdateDocumentos = 'UPDATE documentos SET consentimiento_id = NULL WHERE consentimiento_id = $1';

  executeQuery(queryUpdateDocumentos, [id], (err, updateResults) => {
    if (err) {
      console.error('Error al actualizar documentos:', err);
      return callback(err, null);
    }

    // Finalmente, eliminamos el Consentimiento Informado
    const queryDeleteConsentimiento = 'DELETE FROM consentimiento WHERE id = $1';

    executeQuery(queryDeleteConsentimiento, [id], (err, deleteResults) => {
      if (err) {
        console.error('Error al eliminar Consentimiento Informado:', err);
        return callback(err, null);
      }

      callback(null, deleteResults.rowCount);  // Devolvemos el número de filas afectadas
    });
  });
};

