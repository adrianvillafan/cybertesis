// src/api/authAPI.js

import axios from 'axios';
import { LOGIN, LOGOUT } from '../constants/apiRoutes';

const authAPI = {
  login: async (credentials) => {
    try {
      const response = await axios.post(LOGIN, credentials);
      return response.data;
    } catch (error) {
      console.error('Error en el login:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(LOGOUT, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al cerrar sesión:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default authAPI;
