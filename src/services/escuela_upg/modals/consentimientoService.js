// src/services/escuela_upg/modals/consentimientoService.js

import consentimientoAPI from '../../../api/escuela_upg/modals/consentimientoAPI';

const consentimientoService = {
  fetchConsentimientoById: async (id) => {
    try {
      const consentimiento = await consentimientoAPI.fetchConsentimientoById(id);
      console.log('Consentimiento Informado encontrado:', consentimiento);
      return consentimiento;
    } catch (error) {
      console.error('Error al obtener Consentimiento Informado:', error);
      throw error;
    }
  },

  createConsentimiento: async (consentimientoData) => {
    try {
      const result = await consentimientoAPI.createConsentimiento(consentimientoData);
      console.log('Consentimiento Informado creado:', result);
      return result;
    } catch (error) {
      console.error('Error al guardar Consentimiento Informado:', error);
      throw error;
    }
  },

  uploadConsentimientoFile: async (file, eventoDetails) => {
    try {
      const result = await consentimientoAPI.uploadConsentimientoFile(file, eventoDetails);
      console.log('Archivo de Consentimiento Informado cargado correctamente:', result);
      return result;
    } catch (error) {
      console.error('Error al cargar el archivo del Consentimiento Informado:', error);
      throw error;
    }
  },

  deleteConsentimiento: async (id, eventoDetails) => {
    try {
      const result = await consentimientoAPI.deleteConsentimiento(id, eventoDetails);
      console.log('Consentimiento Informado eliminado:', result);
      return result;
    } catch (error) {
      console.error('Error al eliminar Consentimiento Informado:', error);
      throw error;
    }
  },
};

export default consentimientoService;
