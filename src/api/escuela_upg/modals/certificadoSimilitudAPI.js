// src/api/escuela_upg/modals/certificadoSimilitudAPI.js

import axios from 'axios';
import {
  GET_CERTIFICADO,
  INSERT_CERTIFICADO,
  UPLOAD_FILE,
  DELETE_CERTIFICADO,
} from '../../../constants/fileApiRoutes';

const getToken = () => localStorage.getItem('token');

const certificadoSimilitudAPI = {
  fetchCertificadoById: async (id) => {
    const response = await axios.get(`${GET_CERTIFICADO.replace('{id}', id)}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  createCertificadoSimilitud: async (certificadoData) => {
    const response = await axios.post(`${INSERT_CERTIFICADO}`, certificadoData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  uploadCertificadoFile: async (file, eventoDetails) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'CERTIFICADOS');

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

  deleteCertificadoSimilitud: async (id, eventoDetails) => {
    const response = await axios.delete(`${DELETE_CERTIFICADO.replace('{id}', id)}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      data: eventoDetails,
    });
    return response.data;
  },
};

export default certificadoSimilitudAPI;
