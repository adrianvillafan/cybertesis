const getToken = () => localStorage.getItem('token');

// Función para obtener documentos por estudiante, facultad, grado, y escuelas
export const fetchDocumentosPorEstudiante = async (facultadId, gradoId, escuelaIds) => {
  try {
    const response = await fetch(`http://localhost:3000/api/solicitudes/documentos/tabla/upg/${facultadId}/${gradoId}/${escuelaIds.join(',')}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    });
    if (!response.ok) {
      throw new Error('No se pudieron obtener los documentos');
    }
    return response.json();
  } catch (error) {
    console.error('Error al obtener los documentos:', error);
    throw error;
  }
};
