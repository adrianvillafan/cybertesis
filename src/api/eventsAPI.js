// src/api/eventsAPI.js

import axios from 'axios';
import { 
  GET_EVENTOS_NO_LEIDOS_POR_TARGET, 
  GET_EVENTOS_NO_LEIDOS_POR_ACTOR,
  GET_EVENTOS_POR_TARGET,
  GET_EVENTOS_POR_ACTOR,
  GET_EVENTOS_POR_DOCUMENTO,
  MARK_EVENTO_AS_READ
} from '../constants/usuariosApiRoutes';

const getToken = () => localStorage.getItem('token');

const eventsAPI = {
  fetchEventosNoLeidosPorTarget: async (userId, tipoUserId) => {
    const response = await axios.get(GET_EVENTOS_NO_LEIDOS_POR_TARGET.replace('{userId}', userId).replace('{tipoUserId}', tipoUserId), {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  },

  fetchEventosNoLeidosPorActor: async (userId, tipoUserId) => {
    const response = await axios.get(GET_EVENTOS_NO_LEIDOS_POR_ACTOR.replace('{userId}', userId).replace('{tipoUserId}', tipoUserId), {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  },

  fetchEventosPorTarget: async (userId, tipoUserId) => {
    const response = await axios.get(GET_EVENTOS_POR_TARGET.replace('{userId}', userId).replace('{tipoUserId}', tipoUserId), {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  },

  fetchEventosPorActor: async (userId, tipoUserId) => {
    const response = await axios.get(GET_EVENTOS_POR_ACTOR.replace('{userId}', userId).replace('{tipoUserId}', tipoUserId), {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  },

  fetchEventosPorDocumento: async (documentId, actorTipoUserId, targetTipoUserId) => {
    const response = await axios.get(GET_EVENTOS_POR_DOCUMENTO.replace('{documentId}', documentId)
      .replace('{actorTipoUserId}', actorTipoUserId).replace('{targetTipoUserId}', targetTipoUserId), {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  },

  markEventoAsRead: async (eventId) => {
    const response = await axios.put(MARK_EVENTO_AS_READ.replace('{eventId}', eventId), null, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  },
};

export default eventsAPI;
