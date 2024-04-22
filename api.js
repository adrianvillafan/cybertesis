export async function handleSubmit( form, handleLoginSuccess) {
  console.log('Formulario:', form);
  try {
    const response = await fetch('http://localhost:3306/login' , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      throw new Error('Error en la solicitud');
    }

    // Manejar la respuesta del servidor
    const data = await response.json();
    console.log('Respuesta del servidor:', data);
    localStorage.setItem('token', data.token);
    // Verificar si la respuesta contiene un token de sesión
    if (data.token) {
      // Inicio de sesión exitoso, llamar a la función handleLoginSuccess
      
      handleLoginSuccess(data.token);
    } else {
      throw new Error('El servidor no devolvió un token de sesión válido');
    }
  } catch (error) {
    console.error('Error:', error);
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
      localStorage.removeItem('token');  // Limpia el token del almacenamiento local
      window.location.reload();  // O considera usar navigate para la redirección
    } else {
      throw new Error('Error al cerrar sesión en el servidor');
    }
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}

