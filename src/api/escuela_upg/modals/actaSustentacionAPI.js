// src/api/escuela_upg/modals/actaSustentacionAPI.js

import axios from 'axios';
import {
  GET_ACTA,
  INSERT_ACTA,
  UPLOAD_FILE,
  DELETE_ACTA,
} from '../../../constants/fileApiRoutes';

const getToken = () => localStorage.getItem('token');

const actaSustentacionAPI = {
  fetchActaById: async (id) => {
    const response = await axios.get(`${GET_ACTA.replace('{id}', id)}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  },

  createActaSustentacion: async (actaData) => {
    const response = await axios.post(`${INSERT_ACTA}`, actaData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  uploadActaFile: async (file, eventoDetails) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'ACTAS');

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

  deleteActa: async (id, eventoDetails) => {
    const response = await axios.delete(`${DELETE_ACTA.replace('{id}', id)}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      data: eventoDetails,
    });
    return response.data;
  },
};

export default actaSustentacionAPI;
