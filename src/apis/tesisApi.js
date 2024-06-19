const getToken = () => localStorage.getItem('token');

export const uploadTesisFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://localhost:3000/api/tesis/upload', {
      method: 'POST',
      body: formData,
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('No se pudo cargar el archivo de tesis');
    }
  } catch (error) {
    console.error('Error al cargar el archivo de tesis:', error);
    throw error;
  }
};

export const confirmUploadTesisFile = async (tesisDetails) => {
  try {
    const response = await fetch('http://localhost:3000/api/tesis/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(tesisDetails),
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('No se pudo confirmar la carga del archivo de tesis');
    }
  } catch (error) {
    console.error('Error al confirmar la carga del archivo de tesis:', error);
    throw error;
  }
};

export const updateTesisDetails = async (id, tesisDetails) => {
  try {
    const response = await fetch(`http://localhost:3000/api/tesis/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(tesisDetails),
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('No se pudo actualizar los detalles de la tesis');
    }
  } catch (error) {
    console.error('Error al actualizar los detalles de la tesis:', error);
    throw error;
  }
};

export const deleteTesis = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/tesis/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('No se pudo eliminar la tesis');
    }
  } catch (error) {
    console.error('Error al eliminar la tesis:', error);
    throw error;
  }
};

export const getTesisById = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/tesis/${id}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('No se pudo obtener los detalles de la tesis');
    }
  } catch (error) {
    console.error('Error al obtener los detalles de la tesis:', error);
    throw error;
  }
};

export const getTesisByStudentId = async (studentId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/tesis/student/${studentId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('No se pudo obtener las tesis del estudiante');
    }
  } catch (error) {
    console.error('Error al obtener las tesis del estudiante:', error);
    throw error;
  }
};
