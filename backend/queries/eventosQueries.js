import { executeQuery } from '../config/db.js';

// Crear un nuevo evento
export const insertEvento = (eventoDetails, callback) => {
  const queryEvento = `
    INSERT INTO eventos (
      actor_user_id,
      target_user_id,
      action_type,
      document_id,
      event_description,
      created_at
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING event_id
  `;
  const eventoValues = [
    eventoDetails.actor_user_id,
    eventoDetails.target_user_id,
    eventoDetails.action_type,
    eventoDetails.document_id || null, // Documento puede ser null
    eventoDetails.event_description,
    new Date()  // Usamos la fecha actual para created_at
  ];

  // Ejecutar la consulta de inserción del evento
  executeQuery(queryEvento, eventoValues, (err, results) => {
    if (err) {
      console.error('Error al insertar evento:', err);
      callback(err, null);
    } else {
      const eventId = results[0].event_id;  // Obtener el ID del evento insertado
      callback(null, eventId);  // Devolvemos el ID del evento insertado
    }
  });
};

// Marcar un evento como leído
export const markEventoAsRead = (eventId, callback) => {
  const query = `
    UPDATE eventos 
    SET read_at = NOW() 
    WHERE event_id = $1
  `;

  // Ejecutar la consulta para marcar el evento como leído
  executeQuery(query, [eventId], (err, results) => {
    if (err) {
      console.error('Error al marcar evento como leído:', err);
      callback(err, null);
    } else {
      callback(null, results.rowCount);  // Devolvemos el número de filas afectadas
    }
  });
};

// Obtener eventos no leídos donde el usuario es target
export const getEventosNoLeidosByTargetUserId = (userId, callback) => {
  const query = `
    SELECT * FROM eventos 
    WHERE target_user_id = $1 AND read_at IS NULL
    ORDER BY created_at DESC
  `;

  // Ejecutar la consulta para obtener los eventos no leídos
  executeQuery(query, [userId], (err, results) => {
    if (err) {
      console.error('Error al obtener eventos no leídos por target_user_id:', err);
      callback(err, null);
    } else {
      callback(null, results);  // Devolvemos los eventos no leídos
    }
  });
};

// Obtener eventos no leídos donde el usuario es actor
export const getEventosNoLeidosByActorUserId = (userId, callback) => {
  const query = `
    SELECT * FROM eventos 
    WHERE actor_user_id = $1 AND read_at IS NULL
    ORDER BY created_at DESC
  `;

  // Ejecutar la consulta para obtener los eventos no leídos
  executeQuery(query, [userId], (err, results) => {
    if (err) {
      console.error('Error al obtener eventos no leídos por actor_user_id:', err);
      callback(err, null);
    } else {
      callback(null, results);  // Devolvemos los eventos no leídos
    }
  });
};

// Obtener todos los eventos donde el usuario es target
export const getEventosByTargetUserId = (userId, callback) => {
  const query = `
    SELECT * FROM eventos 
    WHERE target_user_id = $1
    ORDER BY created_at DESC
  `;

  // Ejecutar la consulta para obtener los eventos relacionados con el usuario
  executeQuery(query, [userId], (err, results) => {
    if (err) {
      console.error('Error al obtener eventos por target_user_id:', err);
      callback(err, null);
    } else {
      callback(null, results);  // Devolvemos los eventos
    }
  });
};

// Obtener todos los eventos donde el usuario es actor
export const getEventosByActorUserId = (userId, callback) => {
  const query = `
    SELECT * FROM eventos 
    WHERE actor_user_id = $1
    ORDER BY created_at DESC
  `;

  // Ejecutar la consulta para obtener los eventos relacionados con el usuario
  executeQuery(query, [userId], (err, results) => {
    if (err) {
      console.error('Error al obtener eventos por actor_user_id:', err);
      callback(err, null);
    } else {
      callback(null, results);  // Devolvemos los eventos
    }
  });
};

// Obtener eventos relacionados con un documento específico
export const getEventosByDocumentId = (documentId, callback) => {
  const query = `
    SELECT * FROM eventos 
    WHERE document_id = $1
    ORDER BY created_at DESC
  `;

  // Ejecutar la consulta para obtener los eventos relacionados con un documento
  executeQuery(query, [documentId], (err, results) => {
    if (err) {
      console.error('Error al obtener eventos por document_id:', err);
      callback(err, null);
    } else {
      callback(null, results);  // Devolvemos los eventos relacionados con el documento
    }
  });
};
