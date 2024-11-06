// src/api/escuela_upg/modals/postergacionAPI.js

import axios from 'axios';
import {
  GET_POSTERGACION,
  INSERT_POSTERGACION,
  UPLOAD_FILE,
  DELETE_POSTERGACION,
} from '../../../constants/fileApiRoutes';

const getToken = () => localStorage.getItem('token');

const postergacionAPI = {
  fetchPostergacionById: async (id) => {
    const response = await axios.get(`${GET_POSTERGACION.replace('{id}', id)}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  createPostergacionPublicacion: async (postergacionData) => {
    const response = await axios.post(`${INSERT_POSTERGACION}`, postergacionData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  uploadPostergacionPublicacionFile: async (file, eventoDetails) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'POSTERGACION');

    // Añadir los detalles del evento al FormData
    for (let key in eventoDetails) {
      formData.append(key, eventoDetails[key]);
    }

    const response = await axios.post(`${UPLOAD_FILE}`, formData, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  deletePostergacionPublicacion: async (id, eventoDetails) => {
    const response = await axios.delete(`${DELETE_POSTERGACION.replace('{id}', id)}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      data: eventoDetails,
    });
    return response.data;
  },
};

export default postergacionAPI;
