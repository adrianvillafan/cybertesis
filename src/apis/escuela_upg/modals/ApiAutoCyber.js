const getToken = () => localStorage.getItem('token');

export const fetchAutoCyberById = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/autocyber/${id}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error al obtener AutoCyber:', error);
    throw error;
  }
};

export const createAutoCyber = async (autoCyberData) => {
  try {
    const response = await fetch('http://localhost:3000/api/files/autocyber/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(autoCyberData),
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('No se pudo guardar AutoCyber');
    }
  } catch (error) {
    console.error('Error al guardar AutoCyber:', error);
    throw error;
  }
};

// Función para cargar el archivo PDF a MinIO
export const uploadAutoCyberFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'CYBER'); // Asegúrate de usar mayúsculas

  try {
    const response = await fetch('http://localhost:3000/api/files/upload', {
      method: 'POST',
      body: formData,
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('No se pudo cargar el archivo de AutoCyber');
    }
  } catch (error) {
    console.error('Error al cargar el archivo de AutoCyber:', error);
    throw error;
  }
};

export const deleteAutoCyber = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/autocyber/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error al eliminar AutoCyber:', error);
    throw error;
  }
};