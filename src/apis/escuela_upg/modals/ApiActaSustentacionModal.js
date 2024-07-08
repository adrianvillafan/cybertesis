const getToken = () => localStorage.getItem('token');

export const fetchActaById = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/acta/${id}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error al obtener Acta de Sustentación:', error);
    throw error;
  }
};

export const uploadActaFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'ACTAS'); // Asegúrate de usar mayúsculas

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
      throw new Error('No se pudo cargar el archivo de acta');
    }
  } catch (error) {
    console.error('Error al cargar el archivo de acta:', error);
    throw error;
  }
};

export const createActaSustentacion = async (data) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/acta/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error al crear Acta de Sustentación:', error);
    throw error;
  }
};

export const deleteActa = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/acta/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error al eliminar Acta de Sustentación:', error);
    throw error;
  }
};
