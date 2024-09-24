const getToken = () => localStorage.getItem('token');

// Función para obtener un certificado de similitud por ID
export const fetchCertificadoById = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/certificado/${id}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error al obtener Certificado de Similitud:', error);
    throw error;
  }
};

// Función para crear un certificado de similitud
export const createCertificadoSimilitud = async (certificadoData) => {
  try {
    const response = await fetch('http://localhost:3000/api/files/certificado/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(certificadoData)
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('No se pudo guardar el certificado de similitud');
    }
  } catch (error) {
    console.error('Error al guardar el certificado de similitud:', error);
    throw error;
  }
};

// Función para cargar el archivo PDF a MinIO
export const uploadCertificadoFile = async (file, eventoDetails) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'CERTIFICADOS');

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
      throw new Error('No se pudo cargar el archivo del certificado de similitud');
    }
  } catch (error) {
    console.error('Error al cargar el archivo del certificado de similitud:', error);
    throw error;
  }
};


// Función para eliminar un certificado de similitud por ID
export const deleteCertificadoSimilitud = async (id, eventoDetails) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/certificado/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventoDetails) // Enviar los detalles del evento
    });

    return await response.json();
  } catch (error) {
    console.error('Error al eliminar Certificado de Similitud:', error);
    throw error;
  }
};

