// src/api/studentAPI.js

import axios from 'axios';
import {
  GET_DATOS_BY_DNI,
  GET_DATOS_ORCID,
  GET_EXPEDIENTES,
  CREATE_SOLICITUD,
  GET_SOLICITUDES_BY_ALUMNO
} from '../constants/studentApiRoutes';

const getToken = () => localStorage.getItem('token');

const studentAPI = {
  fetchDatosByDni: async (tipoIdentificacionId, identificacionId) => {
    const response = await axios.get(GET_DATOS_BY_DNI.replace('{tipoIdentificacionId}', tipoIdentificacionId).replace('{identificacionId}', identificacionId));
    return response.data;
  },

  fetchDatosOrcid: async (orcid) => {
    const response = await axios.get(GET_DATOS_ORCID.replace('{orcid}', orcid));
    return response.data;
  },

  fetchExpedientes: async (estudianteId, gradoId) => {
    const response = await axios.get(GET_EXPEDIENTES.replace('{estudianteId}', estudianteId).replace('{gradoId}', gradoId));
    return response.data;
  },

  createSolicitud: async (idFacultad, idDocumento) => {
    const response = await axios.post(CREATE_SOLICITUD, {
      idFacultad,
      idDocumento,
    }, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  fetchSolicitudesByAlumno: async (idAlumno) => {
    const response = await axios.get(GET_SOLICITUDES_BY_ALUMNO.replace('{idAlumno}', idAlumno), {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },
};

export default studentAPI;
