const getToken = () => localStorage.getItem('token');

// Función para crear o editar una tesis
export const saveTesis = async (tesisData) => {
  try {
    const response = await axios.post('http://localhost:3000/api/tesis/insert', tesisData, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al guardar la tesis:', error);
    throw error;
  }
};

// Función para obtener los datos de una tesis por ID
export const fetchTesisById = async (tesisId) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/tesis/${tesisId}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos de la tesis:', error);
    throw error;
  }
};

// Función para cargar el archivo PDF a MinIO
export const uploadTesisFile = async (file, fileName) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', fileName);

  try {
    const response = await axios.post('http://localhost:3000/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    throw error;
  }
};

// Función para obtener la URL de visualización del archivo PDF desde MinIO
export const fetchTesisFileUrl = async (type, filename) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/files/view/${type}/${filename}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener la URL del archivo:', error);
    throw error;
  }
};

// Función para actualizar el documento con el ID de la tesis
export const updateDocumentos = async (documentId, tesisId) => {
  try {
    const response = await axios.put(`http://localhost:3000/api/documentos/${documentId}`, { tesisId }, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el documento:', error);
    throw error;
  }
};

// Función para confirmar la carga del archivo de tesis y guardar sus detalles
export const confirmUploadTesisFile = async (tesisDetails) => {
  try {
    const response = await axios.post('http://localhost:3000/api/tesis/insert', tesisDetails, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al confirmar la carga del archivo de tesis:', error);
    throw error;
  }
};

// Función para actualizar los detalles de la tesis
export const updateTesisDetails = async (id, tesisDetails) => {
  try {
    const response = await axios.put(`http://localhost:3000/api/tesis/update/${id}`, tesisDetails, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar los detalles de la tesis:', error);
    throw error;
  }
};

// Función para eliminar una tesis
export const deleteTesis = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:3000/api/tesis/delete/${id}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la tesis:', error);
    throw error;
  }
};

// Función para obtener los detalles de una tesis por ID
export const getTesisById = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/tesis/${id}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los detalles de la tesis:', error);
    throw error;
  }
};

// Función para obtener las tesis de un estudiante por su ID
export const getTesisByStudentId = async (studentId) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/tesis/student/${studentId}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las tesis del estudiante:', error);
    throw error;
  }
};
