const getToken = () => localStorage.getItem('token');

// Función para obtener una postergación de publicación por ID
export const fetchPostergacionById = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/postergacion/${id}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error al obtener Postergación de Publicación:', error);
    throw error;
  }
};

// Función para crear una postergación de publicación y registrar evento
export const createPostergacionPublicacion = async (postergacionData) => {
  console.log('postergacionDataAPI:', postergacionData);
  try {
    const response = await fetch('http://localhost:3000/api/files/postergacion/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(postergacionData),
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('No se pudo guardar la Postergación de Publicación');
    }
  } catch (error) {
    console.error('Error al guardar la Postergación de Publicación:', error);
    throw error;
  }
};

// Función para cargar el archivo PDF a MinIO y registrar evento
export const uploadPostergacionPublicacionFile = async (file, eventoDetails) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'POSTERGACION');

  // Añadir los detalles del evento al FormData
  for (let key in eventoDetails) {
    formData.append(key, eventoDetails[key]);
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
      throw new Error('No se pudo cargar el archivo de la Postergación de Publicación');
    }
  } catch (error) {
    console.error('Error al cargar el archivo de la Postergación de Publicación:', error);
    throw error;
  }
};


// Función para eliminar una postergación de publicación por ID y registrar evento
export const deletePostergacionPublicacion = async (id, eventoDetails) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/postergacion/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(eventoDetails)
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('No se pudo eliminar la Postergación de Publicación');
    }
  } catch (error) {
    console.error('Error al eliminar Postergación de Publicación:', error);
    throw error;
  }
};

