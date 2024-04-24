export async function handleSubmit(form, handleLoginSuccess) {
  console.log('Formulario:', form);
  try {
    const response = await fetch('http://localhost:3306/login', {
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
    const response = await fetch('http://localhost:3306/logout', {
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

