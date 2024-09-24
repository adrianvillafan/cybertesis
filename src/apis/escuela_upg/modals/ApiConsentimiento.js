const getToken = () => localStorage.getItem('token');

// Función para obtener un consentimiento informado por ID
export const fetchConsentimientoById = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/consentimiento/${id}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error al obtener Consentimiento Informado:', error);
    throw error;
  }
};

// Función para crear un consentimiento informado con detalles del evento
export const createConsentimiento = async (consentimientoData) => {
  console.log('consentimientoDataAPI:', consentimientoData);
  try {
    const response = await fetch('http://localhost:3000/api/files/consentimiento/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(consentimientoData), // Incluye los detalles del evento también
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('No se pudo guardar el Consentimiento Informado');
    }
  } catch (error) {
    console.error('Error al guardar el Consentimiento Informado:', error);
    throw error;
  }
};

// Función para cargar el archivo PDF del consentimiento y enviar detalles del evento
export const uploadConsentimientoFile = async (file, eventoDetails) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'CONSENTIMIENTO');

  // Añadimos los detalles del evento al FormData
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
      throw new Error('No se pudo cargar el archivo del Consentimiento Informado');
    }
  } catch (error) {
    console.error('Error al cargar el archivo del Consentimiento Informado:', error);
    throw error;
  }
};


// Función para eliminar un consentimiento informado por ID y registrar el evento
export const deleteConsentimiento = async (id, eventoDetails) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/consentimiento/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(eventoDetails) // Enviamos los detalles del evento
    });

    return await response.json();
  } catch (error) {
    console.error('Error al eliminar Consentimiento Informado:', error);
    throw error;
  }
};

