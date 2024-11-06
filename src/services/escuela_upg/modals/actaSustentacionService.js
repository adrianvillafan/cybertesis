// src/services/escuela_upg/modals/actaSustentacionService.js

import actaSustentacionAPI from '../../../api/escuela_upg/modals/actaSustentacionAPI';

const actaSustentacionService = {
  fetchActaById: async (id) => {
    try {
      const acta = await actaSustentacionAPI.fetchActaById(id);
      console.log('Acta de Sustentación encontrada:', acta);
      return acta;
    } catch (error) {
      console.error('Error al obtener Acta de Sustentación:', error);
      throw error;
    }
  },

  createActaSustentacion: async (actaData) => {
    try {
      const result = await actaSustentacionAPI.createActaSustentacion(actaData);
      console.log('Acta de Sustentación creada:', result);
      return result;
    } catch (error) {
      console.error('Error al guardar el acta de sustentación:', error);
      throw error;
    }
  },

  uploadActaFile: async (file, eventoDetails) => {
    try {
      const result = await actaSustentacionAPI.uploadActaFile(file, eventoDetails);
      console.log('Archivo del Acta de Sustentación cargado correctamente:', result);
      return result;
    } catch (error) {
      console.error('Error al cargar el archivo del acta:', error);
      throw error;
    }
  },

  deleteActa: async (id, eventoDetails) => {
    try {
      const result = await actaSustentacionAPI.deleteActa(id, eventoDetails);
      console.log('Acta de Sustentación eliminada:', result);
      return result;
    } catch (error) {
      console.error('Error al eliminar Acta de Sustentación:', error);
      throw error;
    }
  },
};

export default actaSustentacionService;
