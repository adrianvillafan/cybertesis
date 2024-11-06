// src/api/escuela_upg/modals/metadataAPI.js

import axios from 'axios';
import {
  GET_METADATA,
  INSERT_METADATA,
  UPLOAD_FILE,
  DELETE_METADATA,
  GET_LINEAS_INVESTIGACION,
  GET_GRUPOS_INVESTIGACION,
  GET_DISCIPLINAS_OCDE,
} from '../../../constants/fileApiRoutes';

const getToken = () => localStorage.getItem('token');

const metadataAPI = {
  fetchMetadataById: async (id) => {
    const response = await axios.get(`${GET_METADATA.replace('{id}', id)}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  createMetadata: async (metadataData) => {
    const response = await axios.post(`${INSERT_METADATA}`, metadataData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  uploadMetadataFile: async (file, eventoDetails) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'METADATOS');

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

  deleteMetadata: async (id, eventoDetails) => {
    const response = await axios.delete(`${DELETE_METADATA.replace('{id}', id)}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      data: eventoDetails,
    });
    return response.data;
  },

  fetchLineasInvestigacion: async (facultadId) => {
    const response = await axios.get(`${GET_LINEAS_INVESTIGACION.replace('{facultadId}', facultadId)}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  fetchGruposInvestigacion: async (facultadId) => {
    const response = await axios.get(`${GET_GRUPOS_INVESTIGACION.replace('{facultadId}', facultadId)}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  fetchDisciplinasOCDE: async () => {
    const response = await axios.get(`${GET_DISCIPLINAS_OCDE}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },
};

export default metadataAPI;
