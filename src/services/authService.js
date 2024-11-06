// src/services/authService.js

import authAPI from '../api/authAPI';

const authService = {
  login: async (credentials) => {
    try {
      const data = await authAPI.login(credentials);
      if (data.token && data.userData) {
        console.log("Login Data (authService.js):", data);
        // Guardar token y datos del usuario en localStorage directamente
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.userData));
        return data;
      } else {
        throw new Error('El servidor no devolvió un token de sesión válido o los datos del usuario');
      }
    } catch (error) {
      console.error('Error al procesar el login:', error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible para cerrar sesión');
      }

      await authAPI.logout(token);

      // Eliminar token y datos del usuario del localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.reload();

    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
      throw error;
    }
  },
};

export default authService;
