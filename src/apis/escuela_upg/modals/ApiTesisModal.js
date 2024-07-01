const getToken = () => localStorage.getItem('token');

// Función para crear o editar una tesis
export const saveTesis = async (tesisData) => {
  console.log('saveTesis', tesisData);
  try {
    const response = await fetch('http://localhost:3000/api/files/tesis/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(tesisData),
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('No se pudo guardar la tesis');
    }
  } catch (error) {
    console.error('Error al guardar la tesis:', error);
    throw error;
  }
};

// Función para obtener los datos de una tesis por ID
export const fetchTesisById = async (tesisId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/tesis/${tesisId}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error al obtener los datos de la tesis:', error);
    throw error;
  }
};

// Función para cargar el archivo PDF a MinIO
export const uploadTesisFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'TESIS'); // Asegúrate de usar mayúsculas

  // Log each entry in the FormData
  for (let pair of formData.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }
  console.log('formData', formData);

  try {
    const response = await fetch('http://localhost:3000/api/files/upload', {
      method: 'POST',
      body: formData,
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('No se pudo cargar el archivo de tesis');
    }
  } catch (error) {
    console.error('Error al cargar el archivo de tesis:', error);
    throw error;
  }
};

// Función para obtener la URL de visualización del archivo PDF desde MinIO
export const fetchTesisFileUrl = async (type, filename) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/view/${type}/${filename}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error al obtener la URL del archivo:', error);
    throw error;
  }
};

// Función para eliminar una tesis
export const deleteTesis = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/tesis/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error al eliminar la tesis:', error);
    throw error;
  }
};

// Función para obtener los detalles de una tesis por ID
export const getTesisById = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/tesis/${id}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error al obtener los detalles de la tesis:', error);
    throw error;
  }
};

// Función para obtener las tesis de un estudiante por su ID
export const getTesisByStudentId = async (studentId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/tesis/student/${studentId}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error al obtener las tesis del estudiante:', error);
    throw error;
  }
};
