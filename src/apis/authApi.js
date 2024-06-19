const getToken = () => localStorage.getItem('token');

// Authentication APIs
export async function handleSubmit(form, handleLoginSuccess) {
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

    const data = await response.json();

    if (data.token && data.userData) {
      localStorage.setItem('token', data.token);
      handleLoginSuccess(data.token, data.userData);
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
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.reload();
    } else {
      throw new Error('Error al cerrar sesión en el servidor');
    }
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}
