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

// Función para crear un acta de sustentación
export const createActaSustentacion = async (actaData) => {
  try {
    const response = await fetch('http://localhost:3000/api/files/acta/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(actaData),
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('No se pudo guardar el acta de sustentación');
    }
  } catch (error) {
    console.error('Error al guardar el acta de sustentación:', error);
    throw error;
  }
};

// Función para cargar el archivo PDF a MinIO y registrar el evento de subida
export const uploadActaFile = async (file, eventoDetails) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'ACTAS'); // Asegúrate de usar mayúsculas

  // Añadir los detalles del evento al FormData
  for (let key in eventoDetails) {
    formData.append(key, eventoDetails[key]);
  }

  // Log cada entrada de FormData para depuración
  for (let pair of formData.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }
  
  try {
    const response = await fetch('http://localhost:3000/api/files/upload', {
      method: 'POST',
      body: formData,
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('No se pudo cargar el archivo del acta');
    }
  } catch (error) {
    console.error('Error al cargar el archivo del acta:', error);
    throw error;
  }
};


// Función para eliminar un acta de sustentación y registrar el evento de eliminación
export const deleteActa = async (id, eventoDetails) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/acta/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventoDetails) // Enviar los detalles del evento junto con la solicitud
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('No se pudo eliminar el acta de sustentación');
    }
  } catch (error) {
    console.error('Error al eliminar Acta de Sustentación:', error);
    throw error;
  }
};

