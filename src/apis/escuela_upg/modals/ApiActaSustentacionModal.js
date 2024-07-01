const getToken = () => localStorage.getItem('token');

export const fetchActaById = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/files/acta-sustentacion/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error al obtener Acta de Sustentación:', error);
      throw error;
    }
  };
  
  export const createOrUpdateActaSustentacion = async (data) => {
    try {
      const response = await fetch(`http://localhost:3000/api/files/acta-sustentacion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Error al crear o actualizar Acta de Sustentación:', error);
      throw error;
    }
  };
  
  export const deleteActa = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/files/acta-sustentacion/${id}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      console.error('Error al eliminar Acta de Sustentación:', error);
      throw error;
    }
  };
  