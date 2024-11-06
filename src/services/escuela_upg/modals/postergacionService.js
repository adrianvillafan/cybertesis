// src/services/escuela_upg/modals/postergacionService.js

import postergacionAPI from '../../../api/escuela_upg/modals/postergacionAPI';

const postergacionService = {
  fetchPostergacionById: async (id) => {
    try {
      const postergacion = await postergacionAPI.fetchPostergacionById(id);
      console.log('Postergación encontrada:', postergacion);
      return postergacion;
    } catch (error) {
      console.error('Error al obtener Postergación de Publicación:', error);
      throw error;
    }
  },

  createPostergacionPublicacion: async (postergacionData) => {
    try {
      const result = await postergacionAPI.createPostergacionPublicacion(postergacionData);
      console.log('Postergación creada:', result);
      return result;
    } catch (error) {
      console.error('Error al guardar la Postergación de Publicación:', error);
      throw error;
    }
  },

  uploadPostergacionPublicacionFile: async (file, eventoDetails) => {
    try {
      const result = await postergacionAPI.uploadPostergacionPublicacionFile(file, eventoDetails);
      console.log('Archivo de Postergación cargado correctamente:', result);
      return result;
    } catch (error) {
      console.error('Error al cargar el archivo de Postergación de Publicación:', error);
      throw error;
    }
  },

  deletePostergacionPublicacion: async (id, eventoDetails) => {
    try {
      const result = await postergacionAPI.deletePostergacionPublicacion(id, eventoDetails);
      console.log('Postergación eliminada:', result);
      return result;
    } catch (error) {
      console.error('Error al eliminar Postergación de Publicación:', error);
      throw error;
    }
  },
};

export default postergacionService;
