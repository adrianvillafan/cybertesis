// src/api/escuela_upg/modals/reporteTurnitinAPI.js

import axios from 'axios';
import {
  GET_REPORTE_TURNITIN,
  INSERT_REPORTE_TURNITIN,
  UPLOAD_FILE,
  DELETE_REPORTE_TURNITIN,
} from '../../../constants/fileApiRoutes';

const getToken = () => localStorage.getItem('token');

const reporteTurnitinAPI = {
  fetchTurnitinById: async (id) => {
    const response = await axios.get(`${GET_REPORTE_TURNITIN.replace('{id}', id)}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  createReporteTurnitin: async (reporteData) => {
    const response = await axios.post(`${INSERT_REPORTE_TURNITIN}`, reporteData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  uploadReporteTurnitinFile: async (file, eventoDetails) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'TURNITIN');

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

  deleteReporteTurnitin: async (id, eventoDetails) => {
    const response = await axios.delete(`${DELETE_REPORTE_TURNITIN.replace('{id}', id)}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      data: eventoDetails,
    });
    return response.data;
  },
};

export default reporteTurnitinAPI;
