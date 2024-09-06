import { executeQuery } from '../config/db.js';

export const insertReporteTurnitin = (reporteDetails, callback) => {
  const queryReporte = `
    INSERT INTO reporte_turnitin (
      file_url,
      created_by,
      updated_by,
      created_at,
      updated_at
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;
  const reporteValues = [
    reporteDetails.file_url,
    reporteDetails.created_by,
    reporteDetails.updated_by,
    new Date(),
    new Date()
  ];

  executeQuery(queryReporte, reporteValues, (err, results) => {
    if (err) {
      console.error('Error al insertar reporte de Turnitin:', err);
      callback(err, null);
    } else {
      const reporteId = results[0].id; // Ya no es necesario usar results.rows

      const queryUpdateDocumentos = `
        UPDATE documentos SET repturnitin_id = $1 WHERE id = $2
      `;
      executeQuery(queryUpdateDocumentos, [reporteId, reporteDetails.documentos_id], (err) => {
        if (err) {
          console.error('Error al actualizar documentos:', err);
          callback(err, null);
        } else {
          callback(null, reporteId);
        }
      });
    }
  });
};

export const getReporteTurnitinById = (id, callback) => {
  const query = `
    SELECT 
      id,
      file_url,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM
      reporte_turnitin
    WHERE
      id = $1
  `;
  executeQuery(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener reporte de Turnitin por ID:', err);
      callback(err, null);
    } else {
      callback(null, results[0]); // Ya no es necesario usar results.rows[0]
    }
  });
};

export const deleteReporteTurnitinById = (id, callback) => {
  const queryUpdateDocumentos = 'UPDATE documentos SET repturnitin_id = NULL WHERE repturnitin_id = $1';

  executeQuery(queryUpdateDocumentos, [id], (err) => {
    if (err) {
      console.error('Error al actualizar documentos:', err);
      return callback(err, null);
    }

    const queryDeleteReporte = 'DELETE FROM reporte_turnitin WHERE id = $1';

    executeQuery(queryDeleteReporte, [id], (err, results) => {
      if (err) {
        console.error('Error al eliminar reporte de Turnitin:', err);
        return callback(err, null);
      }

      callback(null, results.rowCount); // Ya no es necesario usar results.rowCount
    });
  });
};
