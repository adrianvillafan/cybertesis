// src/api/solicitudAPI.js

import axios from 'axios';
import {
  FETCH_EXPEDIENTES_BY_ESTADO,
  GET_EXPEDIENTE_DETAILS,
  GET_RELATED_DOCUMENTS,
  UPDATE_DOCUMENT_STATUS,
  UPDATE_EXPEDIENTE_STATE, // Nueva ruta importada
} from '../constants/solicitudApiRoutes';

const getToken = () => localStorage.getItem('token');

const solicitudAPI = {
  fetchExpedientesByEstado: async (estadoId) => {
    const response = await axios.get(FETCH_EXPEDIENTES_BY_ESTADO.replace('{estadoId}', estadoId), {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  fetchExpedienteDetails: async (solicitudId, expedienteId) => {
    const response = await axios.get(GET_EXPEDIENTE_DETAILS.replace('{solicitudId}', solicitudId).replace('{expedienteId}', expedienteId), {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  fetchDocumentosRelacionados: async (solicitudId, expedienteId) => {
    const response = await axios.get(GET_RELATED_DOCUMENTS.replace('{solicitudId}', solicitudId).replace('{expedienteId}', expedienteId), {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  updateEstadoDocumento: async (solicitudId, tipoDocumento, estado, motivoObservacion, comentariosRevision, revisorId) => {
    const response = await axios.put(UPDATE_DOCUMENT_STATUS.replace('{solicitudId}', solicitudId).replace('{tipoDocumento}', tipoDocumento), {
      estado,
      motivoObservacion,
      comentariosRevision,
      revisorId,
    }, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Nueva función para actualizar el estado del expediente completo
  updateEstadoExpediente: async (solicitudId, nuevoEstado) => {
    const response = await axios.put(UPDATE_EXPEDIENTE_STATE.replace('{solicitudId}', solicitudId), {
      nuevoEstado,
    }, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },
  
};

export default solicitudAPI;
