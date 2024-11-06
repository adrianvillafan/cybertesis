// src/services/escuela_upg/modals/autocyberService.js

import autocyberAPI from '../../../api/escuela_upg/modals/autocyberAPI';

const autocyberService = {
  fetchAutoCyberById: async (id) => {
    try {
      const autocyber = await autocyberAPI.fetchAutoCyberById(id);
      console.log('AutoCyber encontrado:', autocyber);
      return autocyber;
    } catch (error) {
      console.error('Error al obtener AutoCyber:', error);
      throw error;
    }
  },

  createAutoCyber: async (autoCyberData) => {
    try {
      const result = await autocyberAPI.createAutoCyber(autoCyberData);
      console.log('AutoCyber creado:', result);
      return result;
    } catch (error) {
      console.error('Error al guardar AutoCyber:', error);
      throw error;
    }
  },

  uploadAutoCyberFile: async (file, eventoDetails) => {
    try {
      const result = await autocyberAPI.uploadAutoCyberFile(file, eventoDetails);
      console.log('Archivo de AutoCyber cargado correctamente:', result);
      return result;
    } catch (error) {
      console.error('Error al cargar el archivo de AutoCyber:', error);
      throw error;
    }
  },

  deleteAutoCyber: async (id, eventoDetails) => {
    try {
      const result = await autocyberAPI.deleteAutoCyber(id, eventoDetails);
      console.log('AutoCyber eliminado:', result);
      return result;
    } catch (error) {
      console.error('Error al eliminar AutoCyber:', error);
      throw error;
    }
  },
};

export default autocyberService;
