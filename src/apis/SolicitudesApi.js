const getToken = () => localStorage.getItem('token');

// Función para obtener expedientes por estado (ej. Recibidos, Aceptados, Observados)
export async function fetchExpedientesByEstado(estadoId) {
  try {
    const response = await fetch(`http://localhost:3000/api/solicitudes/expedientexestado/estado/${estadoId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error('No se pudo obtener los expedientes por estado');
    }
    const expedientes = await response.json();
    console.log('Expedientes encontrados:', expedientes);
    return expedientes;
  } catch (error) {
    console.error('Error al obtener expedientes por estado:', error);
    throw error;
  }
}

// Función para obtener los detalles de un expediente específico
export async function fetchExpedienteDetails(solicitudId, expedienteId) {
  try {
    const response = await fetch(`http://localhost:3000/api/solicitudes/expedientexestado/detalles/${solicitudId}/${expedienteId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error('No se pudieron obtener los detalles del expediente');
    }
    const detalles = await response.json();
    console.log('Detalles del expediente encontrados:', detalles);
    return detalles;
  } catch (error) {
    console.error('Error al obtener los detalles del expediente:', error);
    throw error;
  }
}

// Función para obtener los documentos relacionados de un expediente específico
export async function fetchDocumentosRelacionados(solicitudId, expedienteId) {
  try {
    const response = await fetch(`http://localhost:3000/api/solicitudes/expedientexestado/documentos/${solicitudId}/${expedienteId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error('No se pudieron obtener los documentos relacionados');
    }
    const documentos = await response.json();
    console.log('Documentos relacionados encontrados:', documentos);
    return documentos;
  } catch (error) {
    console.error('Error al obtener los documentos relacionados:', error);
    throw error;
  }
}