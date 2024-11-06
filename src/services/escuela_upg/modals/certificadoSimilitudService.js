// src/services/escuela_upg/modals/certificadoSimilitudService.js

import certificadoSimilitudAPI from '../../../api/escuela_upg/modals/certificadoSimilitudAPI';

const certificadoSimilitudService = {
  fetchCertificadoById: async (id) => {
    try {
      const certificado = await certificadoSimilitudAPI.fetchCertificadoById(id);
      console.log('Certificado de Similitud encontrado:', certificado);
      return certificado;
    } catch (error) {
      console.error('Error al obtener Certificado de Similitud:', error);
      throw error;
    }
  },

  createCertificadoSimilitud: async (certificadoData) => {
    try {
      const result = await certificadoSimilitudAPI.createCertificadoSimilitud(certificadoData);
      console.log('Certificado de Similitud creado:', result);
      return result;
    } catch (error) {
      console.error('Error al guardar Certificado de Similitud:', error);
      throw error;
    }
  },

  uploadCertificadoFile: async (file, eventoDetails) => {
    try {
      const result = await certificadoSimilitudAPI.uploadCertificadoFile(file, eventoDetails);
      console.log('Archivo de Certificado de Similitud cargado correctamente:', result);
      return result;
    } catch (error) {
      console.error('Error al cargar el archivo del Certificado de Similitud:', error);
      throw error;
    }
  },

  deleteCertificadoSimilitud: async (id, eventoDetails) => {
    try {
      const result = await certificadoSimilitudAPI.deleteCertificadoSimilitud(id, eventoDetails);
      console.log('Certificado de Similitud eliminado:', result);
      return result;
    } catch (error) {
      console.error('Error al eliminar Certificado de Similitud:', error);
      throw error;
    }
  },
};

export default certificadoSimilitudService;
