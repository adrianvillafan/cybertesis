// src/services/eventsService.js

import eventsAPI from '../api/eventsAPI';

const eventsService = {
  getUnreadEventsForTarget: async (userId, tipoUserId) => {
    try {
      return await eventsAPI.fetchEventosNoLeidosPorTarget(userId, tipoUserId);
    } catch (error) {
      console.error('Error al obtener eventos no leídos para el target:', error);
      throw error;
    }
  },

  getUnreadEventsForActor: async (userId, tipoUserId) => {
    try {
      return await eventsAPI.fetchEventosNoLeidosPorActor(userId, tipoUserId);
    } catch (error) {
      console.error('Error al obtener eventos no leídos para el actor:', error);
      throw error;
    }
  },

  getAllEventsForTarget: async (userId, tipoUserId) => {
    try {
      return await eventsAPI.fetchEventosPorTarget(userId, tipoUserId);
    } catch (error) {
      console.error('Error al obtener eventos para el target:', error);
      throw error;
    }
  },

  getAllEventsForActor: async (userId, tipoUserId) => {
    try {
      return await eventsAPI.fetchEventosPorActor(userId, tipoUserId);
    } catch (error) {
      console.error('Error al obtener eventos para el actor:', error);
      throw error;
    }
  },

  getEventsByDocument: async (documentId, actorTipoUserId, targetTipoUserId) => {
    try {
      return await eventsAPI.fetchEventosPorDocumento(documentId, actorTipoUserId, targetTipoUserId);
    } catch (error) {
      console.error('Error al obtener eventos por documento:', error);
      throw error;
    }
  },

  markEventAsRead: async (eventId) => {
    try {
      return await eventsAPI.markEventoAsRead(eventId);
    } catch (error) {
      console.error('Error al marcar evento como leído:', error);
      throw error;
    }
  },
};

export default eventsService;
