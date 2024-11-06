// src/services/escuela_upg/modals/tesisService.js

import tesisAPI from '../../../api/escuela_upg/modals/tesisAPI';

const tesisService = {
  saveTesis: async (tesisData) => {
    try {
      const result = await tesisAPI.saveTesis(tesisData);
      console.log('Tesis guardada:', result);
      return result;
    } catch (error) {
      console.error('Error al guardar la tesis:', error);
      throw error;
    }
  },

  uploadTesisFile: async (file, eventoDetails) => {
    try {
      const result = await tesisAPI.uploadTesisFile(file, eventoDetails);
      console.log('Archivo de tesis cargado:', result);
      return result;
    } catch (error) {
      console.error('Error al cargar el archivo de tesis:', error);
      throw error;
    }
  },

  deleteTesis: async (id, eventoDetails) => {
    try {
      const result = await tesisAPI.deleteTesis(id, eventoDetails);
      console.log('Tesis eliminada:', result);
      return result;
    } catch (error) {
      console.error('Error al eliminar la tesis:', error);
      throw error;
    }
  },

  fetchTesisById: async (tesisId) => {
    try {
      const result = await tesisAPI.fetchTesisById(tesisId);
      console.log('Datos de tesis obtenidos:', result);
      return result;
    } catch (error) {
      console.error('Error al obtener los datos de la tesis:', error);
      throw error;
    }
  },

  fetchTesisFileUrl: async (type, filename) => {
    try {
      const result = await tesisAPI.fetchTesisFileUrl(type, filename);
      console.log('URL del archivo de tesis:', result);
      return result;
    } catch (error) {
      console.error('Error al obtener la URL del archivo de tesis:', error);
      throw error;
    }
  },

  getTesisByStudentId: async (studentId) => {
    try {
      const result = await tesisAPI.getTesisByStudentId(studentId);
      console.log('Tesis del estudiante obtenidas:', result);
      return result;
    } catch (error) {
      console.error('Error al obtener las tesis del estudiante:', error);
      throw error;
    }
  },
};

export default tesisService;
