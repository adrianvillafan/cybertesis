import { executeQuery } from '../config/db.js';

export function fetchStudentData(userId, callback) {
  const sql = `
    SELECT 
      estudiante.id, 
      estudiante.codigo_estudiante, 
      estudiante.dni, 
      facultad.id AS facultad_id, 
      facultad.nombre AS nombre_facultad, 
      escuela.id AS escuela_id, 
      escuela.nombre AS nombre_escuela, 
      grado.id AS grado_id, 
      grado.grado AS nombre_grado,
      users.name AS nombre_usuario, 
      users.current_team_id
    FROM estudiante
    INNER JOIN facultad ON estudiante.facultad_id = facultad.id
    INNER JOIN escuela ON estudiante.escuela_id = escuela.id
    INNER JOIN grado ON estudiante.grado_id = grado.id
    INNER JOIN users ON estudiante.user_id = users.id
    WHERE estudiante.user_id = ?;
  `;

  executeQuery(sql, [userId], (studentErr, studentResults) => {
    if (studentErr || studentResults.length === 0) {
      console.error('Error al buscar datos del estudiante:', studentErr);
      callback({ message: 'Error al buscar datos del estudiante' }, null);
    } else {
      console.log('Resultados de la consulta:', studentResults[0]);
      callback(null, studentResults[0]);
    }
  });
}

export function insertDocument(documentDetails, callback) {
  const query = `INSERT INTO documentos (tipo, url_documento, estudiante_id, estado_id, Tamaño, Fecha_Carga, usuarioCarga_id, Ultima_Modificacion, solicitud_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    documentDetails.tipo,
    documentDetails.urlDocumento,
    documentDetails.estudianteId,
    documentDetails.estadoId,
    documentDetails.tamano,
    documentDetails.fechaCarga,
    documentDetails.usuarioCargaId,
    documentDetails.ultimaModificacion,
    documentDetails.solicitudId
  ];

  executeQuery(query, values, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      callback(err, null);  // Llama al callback con error
    } else {
      // Asumimos que 'results' contiene la propiedad 'insertId'
      callback(null, results.insertId);  // Llama al callback con el ID del documento insertado
    }
  });
}


export async function deleteDocumentByFilename(filename) {
  const query = `DELETE FROM documentos WHERE url_documento = ?`;
  try {
    const result = await executeQuery(query, [filename]);
    return result.affectedRows; // Devuelve el número de filas afectadas
  } catch (error) {
    throw new Error('Error al eliminar el documento de la base de datos: ' + error.message);
  }
}

export const createSolicitud = (solicitud, callback) => {
  const sql = `INSERT INTO solicitud (estudiante_id, tipoSolicitud_id, estado_id, fechaRegistro) VALUES (?, ?, ?, ?)`;
  const values = [solicitud.estudianteId, solicitud.tipoSolicitudId, solicitud.estadoId, new Date()];
  executeQuery(sql, values, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

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
    WHERE solicitud.estudiante_id = ?;
  `;

  executeQuery(sql, [estudianteId], (error, results) => {
    if (error) {
      console.error('Error al obtener las solicitudes:', error);
      callback(error, null);
    } else {
      console.log('Solicitudes obtenidas:', results);
      callback(null, results);
    }
  });
}




