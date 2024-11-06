// src/services/studentService.js

import studentAPI from '../api/studentAPI';

const studentService = {
  fetchDatosByDni: async (tipoIdentificacionId, identificacionId) => {
    try {
      const datos = await studentAPI.fetchDatosByDni(tipoIdentificacionId, identificacionId);
      console.log('Datos del estudiante encontrados:', datos);
      return datos;
    } catch (error) {
      console.error('Error al obtener datos del estudiante:', error);
      throw error;
    }
  },

  fetchDatosOrcid: async (orcid) => {
    try {
      const datos = await studentAPI.fetchDatosOrcid(orcid);
      console.log('Datos de ORCID encontrados:', datos);
      return datos;
    } catch (error) {
      console.error('Error al obtener datos de ORCID:', error);
      throw error;
    }
  },

  fetchExpedientes: async (estudianteId, gradoId) => {
    try {
      const expedientes = await studentAPI.fetchExpedientes(estudianteId, gradoId);
      console.log('Expedientes encontrados:', expedientes);
      return expedientes;
    } catch (error) {
      console.error('Error al obtener expedientes:', error);
      throw error;
    }
  },

  createSolicitud: async (idFacultad, idDocumento) => {
    try {
      const result = await studentAPI.createSolicitud(idFacultad, idDocumento);
      console.log('Solicitud creada y documento actualizado:', result);
      return result;
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      throw error;
    }
  },

  fetchSolicitudesByAlumno: async (idAlumno) => {
    try {
      const solicitudes = await studentAPI.fetchSolicitudesByAlumno(idAlumno);
      console.log('Solicitudes encontradas:', solicitudes);
      return solicitudes;
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
      throw error;
    }
  },
};

export default studentService;
