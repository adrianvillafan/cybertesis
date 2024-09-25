const getToken = () => localStorage.getItem('token');

// Función para obtener eventos no leídos donde el usuario es el target
export const fetchEventosNoLeidosPorTarget = async (userId, tipoUserId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/estudiantes/eventos/target/no-leidos/${userId}/${tipoUserId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    });
    if (!response.ok) {
      throw new Error('No se pudieron obtener los eventos no leídos del target');
    }
    return response.json();
  } catch (error) {
    console.error('Error al obtener eventos no leídos del target:', error);
    throw error;
  }
};

// Función para obtener eventos no leídos donde el usuario es el actor
export const fetchEventosNoLeidosPorActor = async (userId, tipoUserId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/estudiantes/eventos/actor/no-leidos/${userId}/${tipoUserId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    });
    if (!response.ok) {
      throw new Error('No se pudieron obtener los eventos no leídos del actor');
    }
    return response.json();
  } catch (error) {
    console.error('Error al obtener eventos no leídos del actor:', error);
    throw error;
  }
};

// Función para obtener todos los eventos donde el usuario es el target
export const fetchEventosPorTarget = async (userId, tipoUserId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/estudiantes/eventos/target/${userId}/${tipoUserId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    });
    if (!response.ok) {
      throw new Error('No se pudieron obtener los eventos del target');
    }
    return response.json();
  } catch (error) {
    console.error('Error al obtener eventos del target:', error);
    throw error;
  }
};

// Función para obtener todos los eventos donde el usuario es el actor
export const fetchEventosPorActor = async (userId, tipoUserId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/estudiantes/eventos/actor/${userId}/${tipoUserId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('No se pudieron obtener los eventos del actor');
    }

    return response.json();
  } catch (error) {
    console.error('Error al obtener eventos del actor:', error);
    throw error;
  }
};

// Función para obtener eventos relacionados con un documento específico
export const fetchEventosPorDocumento = async (documentId, actorTipoUserId, targetTipoUserId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/estudiantes/eventos/documento/${documentId}/${actorTipoUserId}/${targetTipoUserId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('No se pudieron obtener los eventos relacionados con el documento');
    }

    return response.json();
  } catch (error) {
    console.error('Error al obtener eventos relacionados con el documento:', error);
    throw error;
  }
};

// Función para marcar un evento como leído
export const markEventoAsRead = async (eventId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/estudiantes/eventos/read/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('No se pudo marcar el evento como leído');
    }

    return response.json();
  } catch (error) {
    console.error('Error al marcar el evento como leído:', error);
    throw error;
  }
};
