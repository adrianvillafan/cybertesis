// src/services/escuela_upg/modals/reporteTurnitinService.js

import reporteTurnitinAPI from '../../../api/escuela_upg/modals/reporteTurnitinAPI';

const reporteTurnitinService = {
  fetchTurnitinById: async (id) => {
    try {
      const reporte = await reporteTurnitinAPI.fetchTurnitinById(id);
      console.log('Reporte de Turnitin encontrado:', reporte);
      return reporte;
    } catch (error) {
      console.error('Error al obtener Reporte de Turnitin:', error);
      throw error;
    }
  },

  createReporteTurnitin: async (reporteData) => {
    try {
      const result = await reporteTurnitinAPI.createReporteTurnitin(reporteData);
      console.log('Reporte de Turnitin creado:', result);
      return result;
    } catch (error) {
      console.error('Error al guardar el reporte de Turnitin:', error);
      throw error;
    }
  },

  uploadReporteTurnitinFile: async (file, eventoDetails) => {
    try {
      const result = await reporteTurnitinAPI.uploadReporteTurnitinFile(file, eventoDetails);
      console.log('Archivo del reporte de Turnitin cargado correctamente:', result);
      return result;
    } catch (error) {
      console.error('Error al cargar el archivo del reporte de Turnitin:', error);
      throw error;
    }
  },

  deleteReporteTurnitin: async (id, eventoDetails) => {
    try {
      const result = await reporteTurnitinAPI.deleteReporteTurnitin(id, eventoDetails);
      console.log('Reporte de Turnitin eliminado:', result);
      return result;
    } catch (error) {
      console.error('Error al eliminar Reporte de Turnitin:', error);
      throw error;
    }
  },
};

export default reporteTurnitinService;
