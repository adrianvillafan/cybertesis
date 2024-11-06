// src/api/escuela_upg/modals/tesisAPI.js

import axios from 'axios';
import {
  INSERT_TESIS,
  DELETE_TESIS,
  GET_TESIS,
  GET_TESIS_BY_STUDENT,
  UPLOAD_FILE,
  VIEW_FILE,
} from '../../../constants/fileApiRoutes';

const getToken = () => localStorage.getItem('token');

const tesisAPI = {
  saveTesis: async (tesisData) => {
    const response = await axios.post(INSERT_TESIS, tesisData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  uploadTesisFile: async (file, eventoDetails) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'TESIS');

    for (let key in eventoDetails) {
      formData.append(key, eventoDetails[key]);
    }

    const response = await axios.post(UPLOAD_FILE, formData, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  deleteTesis: async (id, eventoDetails) => {
    const response = await axios.delete(DELETE_TESIS.replace('{id}', id), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      data: eventoDetails,
    });
    return response.data;
  },

  fetchTesisById: async (tesisId) => {
    const response = await axios.get(GET_TESIS.replace('{id}', tesisId), {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  fetchTesisFileUrl: async (type, filename) => {
    const response = await axios.get(VIEW_FILE.replace('{type}', type).replace('{filename}', filename), {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  getTesisByStudentId: async (studentId) => {
    const response = await axios.get(GET_TESIS_BY_STUDENT.replace('{studentId}', studentId), {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },
};

export default tesisAPI;
