import { executeQuery } from '../config/db.js';

export function getSolicitudesByEstudianteId(estudianteId, callback) {
  const sql = `
    SELECT 
      solicitud.id,
      solicitud.tipoSolicitud_id,
      solicitud.estado_id,
      solicitud.fechaRegistro,
      tiposolicitud.nombre AS tipoSolicitud,
      estado.nombre AS estado
    FROM solicitud
    LEFT JOIN tiposolicitud ON solicitud.tipoSolicitud_id = tiposolicitud.id
    LEFT JOIN estado ON solicitud.estado_id = estado.id
    WHERE solicitud.estudiante_id = $1;
  `;

  executeQuery(sql, [estudianteId], (error, results) => {
    if (error) {
      console.error('Error al obtener las solicitudes:', error);
      callback(error, null);
    } else {
      console.log('Solicitudes obtenidas:', results.rows);
      callback(null, results.rows);
    }
  });
}

export const updateEstadoIdByDocumentId = (documentId, estadoId, callback) => {
  const sql = `UPDATE documentos SET estado_id = $1 WHERE id = $2`;
  const values = [estadoId, documentId];
  executeQuery(sql, values, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results.rowCount);
    }
  });
};
