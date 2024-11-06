// src/api/escuela_upg/solicitudesAPI.js

import axios from 'axios';
import { GET_DOCUMENTS_BY_STUDENT } from '../../constants/solicitudApiRoutes';

const getToken = () => localStorage.getItem('token');

const solicitudesAPI = {
  fetchDocumentosPorEstudiante: async (facultadId, gradoId, escuelaIds) => {
    const endpoint = GET_DOCUMENTS_BY_STUDENT
      .replace('{facultadId}', facultadId)
      .replace('{gradoId}', gradoId)
      .replace('{escuelaIds}', escuelaIds.join(','));

    const response = await axios.get(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },
};

export default solicitudesAPI;
