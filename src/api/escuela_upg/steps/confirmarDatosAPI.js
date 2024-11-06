// src/api/escuela_upg/steps/confirmarDatosAPI.js

import axios from 'axios';
import {
  GET_ALL_ALUMNOS_BY_UNIDAD,
  GET_ALL_ALUMNOS_BY_PROGRAMA,
  GET_ALUMNO_DATA,
  GET_PROGRAMAS_BY_FACULTAD,
} from '../../../constants/usuariosApiRoutes';
import { CREATE_OR_FETCH_DOCUMENTOS } from '../../../constants/fileApiRoutes';

const getToken = () => localStorage.getItem('token');

const confirmarDatosAPI = {
  fetchAlumnadoByEscuelaId: async (escuelaId, gradoId) => {
    const response = await axios.get(GET_ALL_ALUMNOS_BY_UNIDAD(escuelaId, gradoId));
    return response.data;
  },

  fetchAlumnadoByProgramaId: async (programaId) => {
    const response = await axios.get(GET_ALL_ALUMNOS_BY_PROGRAMA(programaId));
    return response.data;
  },

  fetchDatosByStudentId: async (studentId) => {
    const response = await axios.get(GET_ALUMNO_DATA(studentId));
    return response.data;
  },

  createOrFetchDocumentos: async (gradeId, studentId, userId) => {
    const response = await axios.post(CREATE_OR_FETCH_DOCUMENTOS, { gradeId, studentId, userId }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  fetchProgramasByFacultadId: async (facultadId) => {
    const response = await axios.get(GET_PROGRAMAS_BY_FACULTAD(facultadId));
    return response.data;
  },
};

export default confirmarDatosAPI;
