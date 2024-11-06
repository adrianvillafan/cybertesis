// src/api/solicitudAPI.js

import axios from 'axios';
import {
  GET_EXPEDIENTES_BY_ESTADO,
  GET_EXPEDIENTE_DETAILS,
  GET_DOCUMENTOS_RELACIONADOS,
  UPDATE_ESTADO_DOCUMENTO,
} from '../constants/solicitudApiRoutes';

const getToken = () => localStorage.getItem('token');

const solicitudAPI = {
  fetchExpedientesByEstado: async (estadoId) => {
    const response = await axios.get(GET_EXPEDIENTES_BY_ESTADO.replace('{estadoId}', estadoId), {
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
    const response = await axios.get(GET_DOCUMENTOS_RELACIONADOS.replace('{solicitudId}', solicitudId).replace('{expedienteId}', expedienteId), {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  updateEstadoDocumento: async (solicitudId, tipoDocumento, estado, motivoObservacion, comentariosRevision, revisorId) => {
    const response = await axios.put(UPDATE_ESTADO_DOCUMENTO.replace('{solicitudId}', solicitudId).replace('{tipoDocumento}', tipoDocumento), {
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
};

export default solicitudAPI;
