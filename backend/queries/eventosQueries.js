import { executeQuery } from '../config/db.js';

// Crear un nuevo evento
export const insertEvento = (eventoDetails, callback) => {
  const queryEvento = `
    INSERT INTO eventos (
      actor_user_id,
      actor_tipo_user_id,
      target_user_id,
      target_tipo_user_id,
      action_type,
      document_id,
      tipo_documento_id,
      event_description,
      created_at,
      is_notificacion
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING event_id
  `;
  const eventoValues = [
    eventoDetails.actor_user_id,
    eventoDetails.actor_tipo_user_id,
    eventoDetails.target_user_id || null,
    eventoDetails.target_tipo_user_id || null,
    eventoDetails.action_type,
    eventoDetails.document_id || null,
    eventoDetails.tipo_documento_id,
    eventoDetails.event_description,
    new Date(),
    eventoDetails.is_notificacion || 0   // Valor por defecto 0 si no se especifica
  ];

  // Ejecutar la consulta de inserción del evento
  executeQuery(queryEvento, eventoValues, (err, results) => {
    if (err) {
      console.error('Error al insertar evento:', err);
      callback(err, null);
    } else {
      const eventId = results[0].event_id;  // Obtener el ID del evento insertado
      callback(null, eventId);              // Devolvemos el ID del evento insertado
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

  executeQuery(query, [eventId], (err, results) => {
    if (err) {
      console.error('Error al marcar evento como leído:', err);
      callback(err, null);
    } else {
      callback(null, results.rowCount);  // Devolvemos el número de filas afectadas
    }
  });
};

// Obtener eventos no leídos donde el usuario es target (usando userId, tipo de usuario y notificación)
export const getEventosNoLeidosByTargetUserId = (userId, tipoUserId, callback) => {
  const query = `
    SELECT event_id, actor_user_id, actor_tipo_user_id, target_user_id, target_tipo_user_id, action_type, document_id, tipo_documento_id, event_description, created_at, is_notificacion
    FROM eventos 
    WHERE target_user_id = $1 AND target_tipo_user_id = $2 AND read_at IS NULL
    ORDER BY created_at DESC
  `;

  executeQuery(query, [userId, tipoUserId], (err, results) => {
    if (err) {
      console.error('Error al obtener eventos no leídos por target_user_id y target_tipo_user_id:', err);
      callback(err, null);
    } else {
      callback(null, results);  // Devolvemos los eventos no leídos
    }
  });
};

// Obtener eventos no leídos donde el usuario es actor (usando userId, tipo de usuario y notificación)
export const getEventosNoLeidosByActorUserId = (userId, tipoUserId, callback) => {
  const query = `
    SELECT event_id, actor_user_id, actor_tipo_user_id, target_user_id, target_tipo_user_id, action_type, document_id, tipo_documento_id, event_description, created_at, is_notificacion
    FROM eventos 
    WHERE actor_user_id = $1 AND actor_tipo_user_id = $2 AND read_at IS NULL
    ORDER BY created_at DESC
  `;

  executeQuery(query, [userId, tipoUserId], (err, results) => {
    if (err) {
      console.error('Error al obtener eventos no leídos por actor_user_id y actor_tipo_user_id:', err);
      callback(err, null);
    } else {
      callback(null, results);  // Devolvemos los eventos no leídos
    }
  });
};

// Obtener todos los eventos donde el usuario es target (incluye is_notificacion)
export const getEventosByTargetUserId = (userId, tipoUserId, callback) => {
  const query = `
    SELECT event_id, actor_user_id, actor_tipo_user_id, target_user_id, target_tipo_user_id, action_type, document_id, tipo_documento_id, event_description, created_at, read_at, is_notificacion
    FROM eventos 
    WHERE target_user_id = $1 AND target_tipo_user_id = $2
    ORDER BY created_at DESC
  `;

  executeQuery(query, [userId, tipoUserId], (err, results) => {
    if (err) {
      console.error('Error al obtener eventos por target_user_id y target_tipo_user_id:', err);
      callback(err, null);
    } else {
      callback(null, results);  // Devolvemos los eventos
    }
  });
};

// Obtener todos los eventos donde el usuario es actor (incluye is_notificacion)
export const getEventosByActorUserId = (userId, tipoUserId, callback) => {
  const query = `
    SELECT event_id, actor_user_id, actor_tipo_user_id, target_user_id, target_tipo_user_id, action_type, document_id, tipo_documento_id, event_description, created_at, read_at, is_notificacion
    FROM eventos 
    WHERE actor_user_id = $1 AND actor_tipo_user_id = $2
    ORDER BY created_at DESC
  `;

  executeQuery(query, [userId, tipoUserId], (err, results) => {
    if (err) {
      console.error('Error al obtener eventos por actor_user_id y actor_tipo_user_id:', err);
      callback(err, null);
    } else {
      callback(null, results);  // Devolvemos los eventos
    }
  });
};

// Obtener eventos relacionados con un documento específico (incluye is_notificacion)
export const getEventosByDocumentId = (documentId, actorTipoUserId, targetTipoUserId, callback) => {
  const query = `
    SELECT event_id, actor_user_id, actor_tipo_user_id, target_user_id, target_tipo_user_id, action_type, document_id, tipo_documento_id, event_description, created_at, read_at, is_notificacion
    FROM eventos 
    WHERE document_id = $1 AND actor_tipo_user_id = $2 AND target_tipo_user_id = $3
    ORDER BY created_at DESC
  `;

  executeQuery(query, [documentId, actorTipoUserId, targetTipoUserId], (err, results) => {
    if (err) {
      console.error('Error al obtener eventos por document_id y tipos de usuario:', err);
      callback(err, null);
    } else {
      callback(null, results);  // Devolvemos los eventos relacionados con el documento
    }
  });
};
