// src/services/escuela_upg/modals/metadataService.js

import metadataAPI from '../../../api/escuela_upg/modals/metadataAPI';

const metadataService = {
  fetchMetadataById: async (id) => {
    try {
      const metadata = await metadataAPI.fetchMetadataById(id);
      console.log('Metadata encontrada:', metadata);
      return metadata;
    } catch (error) {
      console.error('Error al obtener Metadata:', error);
      throw error;
    }
  },

  createMetadata: async (metadataData) => {
    try {
      const result = await metadataAPI.createMetadata(metadataData);
      console.log('Metadata creada:', result);
      return result;
    } catch (error) {
      console.error('Error al guardar la Metadata:', error);
      throw error;
    }
  },

  uploadMetadataFile: async (file, eventoDetails) => {
    try {
      const result = await metadataAPI.uploadMetadataFile(file, eventoDetails);
      console.log('Archivo de Metadata cargado correctamente:', result);
      return result;
    } catch (error) {
      console.error('Error al cargar el archivo de Metadata:', error);
      throw error;
    }
  },

  deleteMetadata: async (id, eventoDetails) => {
    try {
      const result = await metadataAPI.deleteMetadata(id, eventoDetails);
      console.log('Metadata eliminada:', result);
      return result;
    } catch (error) {
      console.error('Error al eliminar Metadata:', error);
      throw error;
    }
  },

  fetchLineasInvestigacion: async (facultadId) => {
    try {
      const lineas = await metadataAPI.fetchLineasInvestigacion(facultadId);
      console.log('Líneas de Investigación encontradas:', lineas);
      return lineas;
    } catch (error) {
      console.error('Error al obtener Líneas de Investigación:', error);
      throw error;
    }
  },

  fetchGruposInvestigacion: async (facultadId) => {
    try {
      const grupos = await metadataAPI.fetchGruposInvestigacion(facultadId);
      console.log('Grupos de Investigación encontrados:', grupos);
      return grupos;
    } catch (error) {
      console.error('Error al obtener Grupos de Investigación:', error);
      throw error;
    }
  },

  fetchDisciplinasOCDE: async () => {
    try {
      const disciplinas = await metadataAPI.fetchDisciplinasOCDE();
      console.log('Disciplinas OCDE encontradas:', disciplinas);
      return disciplinas;
    } catch (error) {
      console.error('Error al obtener Disciplinas OCDE:', error);
      throw error;
    }
  },
};

export default metadataService;
