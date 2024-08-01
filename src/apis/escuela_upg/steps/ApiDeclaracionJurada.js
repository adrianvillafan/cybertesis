const getToken = () => localStorage.getItem('token');

// Función para actualizar el estado_id en la tabla de documentos
export const updateEstadoId = async (documentId, estadoId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/solicitudes/documentos/${documentId}/estado`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ estadoId })
    });

    if (!response.ok) {
      throw new Error('No se pudo actualizar el estado_id');
    }

    return response.json();
  } catch (error) {
    console.error('Error al actualizar el estado_id:', error);
    throw error;
  }
};