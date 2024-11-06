// src/api/escuela_upg/modals/consentimientoAPI.js

import axios from 'axios';
import {
  GET_CONSENTIMIENTO,
  INSERT_CONSENTIMIENTO,
  UPLOAD_FILE,
  DELETE_CONSENTIMIENTO,
} from '../../../constants/fileApiRoutes';

const getToken = () => localStorage.getItem('token');

const consentimientoAPI = {
  fetchConsentimientoById: async (id) => {
    const response = await axios.get(`${GET_CONSENTIMIENTO.replace('{id}', id)}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  createConsentimiento: async (consentimientoData) => {
    console.log('consentimientoDataAPI:', consentimientoData);
    const response = await axios.post(`${INSERT_CONSENTIMIENTO}`, consentimientoData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  uploadConsentimientoFile: async (file, eventoDetails) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'CONSENTIMIENTO');

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

  deleteConsentimiento: async (id, eventoDetails) => {
    const response = await axios.delete(`${DELETE_CONSENTIMIENTO.replace('{id}', id)}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      data: eventoDetails,
    });
    return response.data;
  },
};

export default consentimientoAPI;
