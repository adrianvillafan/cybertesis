// src/services/solicitudService.js

import solicitudAPI from '../api/solicitudAPI';

const solicitudService = {
  fetchExpedientesByEstado: async (estadoId) => {
    try {
      const expedientes = await solicitudAPI.fetchExpedientesByEstado(estadoId);
      console.log('Expedientes encontrados:', expedientes);
      return expedientes;
    } catch (error) {
      console.error('Error al obtener expedientes por estado:', error);
      throw error;
    }
  },

  fetchExpedienteDetails: async (solicitudId, expedienteId) => {
    try {
      const detalles = await solicitudAPI.fetchExpedienteDetails(solicitudId, expedienteId);
      console.log('Detalles del expediente encontrados:', detalles);
      return detalles;
    } catch (error) {
      console.error('Error al obtener los detalles del expediente:', error);
      throw error;
    }
  },

  fetchDocumentosRelacionados: async (solicitudId, expedienteId) => {
    try {
      const documentos = await solicitudAPI.fetchDocumentosRelacionados(solicitudId, expedienteId);
      console.log('Documentos relacionados encontrados:', documentos);
      return documentos;
    } catch (error) {
      console.error('Error al obtener los documentos relacionados:', error);
      throw error;
    }
  },

  updateEstadoDocumento: async (solicitudId, tipoDocumento, estado, motivoObservacion, comentariosRevision, revisorId) => {
    try {
      const result = await solicitudAPI.updateEstadoDocumento(solicitudId, tipoDocumento, estado, motivoObservacion, comentariosRevision, revisorId);
      console.log('Estado del documento actualizado correctamente:', result);
      return result;
    } catch (error) {
      console.error('Error al actualizar el estado del documento:', error);
      throw error;
    }
  },

  // Nuevo método para actualizar el estado del expediente completo
  updateEstadoExpediente: async (solicitudId, nuevoEstado) => {
    try {
      const result = await solicitudAPI.updateEstadoExpediente(solicitudId, nuevoEstado);
      console.log('Estado del expediente actualizado correctamente:', result);
      return result;
    } catch (error) {
      console.error('Error al actualizar el estado del expediente:', error);
      throw error;
    }
  },

  // Nuevo método para obtener solicitudes observadas por facultad y grado
  fetchSolicitudesObservadasPorFacultadYGrado: async (facultadId, gradoId) => {
    try {
      const solicitudes = await solicitudAPI.fetchSolicitudesObservadasPorFacultadYGrado(facultadId, gradoId);
      console.log('Solicitudes observadas encontradas:', solicitudes);
      return solicitudes;
    } catch (error) {
      console.error('Error al obtener solicitudes observadas por facultad y grado:', error);
      throw error;
    }
  },
};

export default solicitudService;
