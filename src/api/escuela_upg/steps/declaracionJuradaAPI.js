// src/api/escuela_upg/steps/declaracionJuradaAPI.js

import axios from 'axios';
import { UPDATE_DOCUMENT_STATE } from '../../../constants/solicitudesApiRoutes';

const getToken = () => localStorage.getItem('token');

const declaracionJuradaAPI = {
  updateEstadoId: async (documentId, estadoId) => {
    const endpoint = UPDATE_DOCUMENT_STATE.replace('{id}', documentId);
    const response = await axios.put(
      endpoint,
      { estadoId },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  },
};

export default declaracionJuradaAPI;
