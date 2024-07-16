import { executeQuery } from '../config/db.js';

export const insertReporteTurnitin = (reporteDetails, callback) => {
  const queryReporte = `
    INSERT INTO reporte_turnitin (
      file_url,
      created_by,
      updated_by,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?)
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
      const reporteId = results.insertId;

      const queryUpdateDocumentos = `
        UPDATE documentos SET repturnitin_id = ? WHERE id = ?
      `;
      executeQuery(queryUpdateDocumentos, [reporteId, reporteDetails.documentos_id], (err, results) => {
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
      id = ?
  `;
  executeQuery(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener reporte de Turnitin por ID:', err);
      callback(err, null);
    } else {
      callback(null, results[0]);
    }
  });
};

export const deleteReporteTurnitinById = (id, callback) => {
  const queryUpdateDocumentos = 'UPDATE documentos SET repturnitin_id = NULL WHERE repturnitin_id = ?';

  executeQuery(queryUpdateDocumentos, [id], (err, results) => {
    if (err) {
      console.error('Error al actualizar documentos:', err);
      return callback(err, null);
    }

    const queryDeleteReporte = 'DELETE FROM reporte_turnitin WHERE id = ?';

    executeQuery(queryDeleteReporte, [id], (err, results) => {
      if (err) {
        console.error('Error al eliminar reporte de Turnitin:', err);
        return callback(err, null);
      }

      callback(null, results.affectedRows);
    });
  });
};
