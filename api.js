//CONTROL DE INICIO/FIN SESION

export async function handleSubmit(form, handleLoginSuccess) {
  console.log('Formulario:', form);
  try {
    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }

    const data = await response.json();  // Espera que la respuesta sea un objeto JSON
    console.log('Respuesta del servidor:', data);

    if (data.token && data.userData) {
      localStorage.setItem('token', data.token);  // Guarda el token en localStorage
      handleLoginSuccess(data.token, data.userData);  // Invoca el manejador de éxito con el token y los datos del usuario
    } else {
      throw new Error('El servidor no devolvió un token de sesión válido o los datos del usuario');
    }
  } catch (error) {
    console.error('Error al procesar el login:', error.message);
    throw error;
  }
}



export async function handleLogout() {
  try {
    const response = await fetch('http://localhost:3000/api/users/logout', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    if (response.ok) {
      localStorage.removeItem('token'); // Asegúrate de que se elimina
      localStorage.removeItem('userData'); // No olvides remover los datos del usuario
      window.location.reload(); // Esto recargará la aplicación, restableciendo el estado
    } else {
      throw new Error('Error al cerrar sesión en el servidor');
    }
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}

//CONTROL DE DOCUMENTOS ESTUDIANTE

export const previewDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('http://localhost:3000/api/files/preview', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.blob();
      return URL.createObjectURL(data);
    } else {
      throw new Error('No se pudo previsualizar el documento');
    }
  } catch (error) {
    console.error('Error al previsualizar el documento:', error);
    throw error;
  }
};

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('http://localhost:3000/api/files/upload', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('No se pudo cargar el documento');
    }
  } catch (error) {
    console.error('Error al cargar el documento:', error);
    throw error;
  }
};

export const confirmUploadDocument = async (fileId, tipo, estudianteId, solicitudId, usuarioCargaId) => {
  try {
    const response = await fetch('http://localhost:3000/api/files/confirm-upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileId, tipo, estudianteId, solicitudId, usuarioCargaId })
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('No se pudo confirmar la carga del documento');
    }
  } catch (error) {
    console.error('Error al confirmar la carga del documento:', error);
    throw error;
  }
};

export const downloadDocument = async (filename) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/download/${filename}`);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('No se pudo descargar el documento');
    }
  } catch (error) {
    console.error('Error al descargar el documento:', error);
    throw error;
  }
};

export const deleteDocument = async (filename) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/delete/${filename}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      return response.json();  // Podrías retornar el mensaje de confirmación desde el servidor
    } else {
      throw new Error('No se pudo eliminar el documento');
    }
  } catch (error) {
    console.error('Error al eliminar el documento:', error);
    throw error;
  }
};

export const submitSolicitud = async (solicitudData) => {
  try {
    // Llamada al backend para crear la solicitud
    const response = await fetch('http://localhost:3000/api/solicitudes/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(solicitudData)
    });

    if (!response.ok) throw new Error('No se pudo crear la solicitud');
    
    const result = await response.json();
    return result.solicitudId;  // Devuelve el ID de la solicitud creada
  } catch (error) {
    console.error('Error al enviar la solicitud:', error);
    throw error;
  }
};


