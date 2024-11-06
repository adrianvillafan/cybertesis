// src/services/escuela_upg/steps/declaracionJuradaService.js

import declaracionJuradaAPI from '../../../api/escuela_upg/steps/declaracionJuradaAPI';

const declaracionJuradaService = {
  updateEstadoId: async (documentId, estadoId) => {
    try {
      const updatedDocument = await declaracionJuradaAPI.updateEstadoId(documentId, estadoId);
      console.log('Estado del documento actualizado:', updatedDocument);
      return updatedDocument;
    } catch (error) {
      console.error('Error al actualizar el estado del documento:', error);
      throw error;
    }
  },
};

export default declaracionJuradaService;
