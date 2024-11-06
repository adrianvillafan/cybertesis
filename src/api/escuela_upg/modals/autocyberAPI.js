// src/api/escuela_upg/modals/autocyberAPI.js

import axios from 'axios';
import {
  GET_AUTOCYBER,
  INSERT_AUTOCYBER,
  UPLOAD_FILE,
  DELETE_AUTOCYBER,
} from '../../../constants/fileApiRoutes';

const getToken = () => localStorage.getItem('token');

const autocyberAPI = {
  fetchAutoCyberById: async (id) => {
    const response = await axios.get(`${GET_AUTOCYBER.replace('{id}', id)}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  createAutoCyber: async (autoCyberData) => {
    const response = await axios.post(`${INSERT_AUTOCYBER}`, autoCyberData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  uploadAutoCyberFile: async (file, eventoDetails) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'CYBER');

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

  deleteAutoCyber: async (id, eventoDetails) => {
    const response = await axios.delete(`${DELETE_AUTOCYBER.replace('{id}', id)}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      data: eventoDetails,
    });
    return response.data;
  },
};

export default autocyberAPI;
