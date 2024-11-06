// src/services/escuela_upg/steps/confirmarDatosService.js

import confirmarDatosAPI from '../../../api/escuela_upg/steps/confirmarDatosAPI';

const confirmarDatosService = {
  fetchAlumnadoByEscuelaId: async (escuelaId, gradoId) => {
    try {
      const alumnado = await confirmarDatosAPI.fetchAlumnadoByEscuelaId(escuelaId, gradoId);
      console.log('Alumnado de la escuela:', alumnado);
      return alumnado;
    } catch (error) {
      console.error('Error al obtener el alumnado de la escuela:', error);
      throw error;
    }
  },

  fetchAlumnadoByProgramaId: async (programaId) => {
    try {
      const alumnado = await confirmarDatosAPI.fetchAlumnadoByProgramaId(programaId);
      console.log('Alumnado del programa:', alumnado);
      return alumnado;
    } catch (error) {
      console.error('Error al obtener el alumnado del programa:', error);
      throw error;
    }
  },

  fetchDatosByStudentId: async (studentId) => {
    try {
      const alumnoData = await confirmarDatosAPI.fetchDatosByStudentId(studentId);
      console.log('Datos del alumno:', alumnoData);
      return alumnoData;
    } catch (error) {
      console.error('Error al obtener los datos del alumno:', error);
      throw error;
    }
  },

  createOrFetchDocumentos: async (gradeId, studentId, userId) => {
    try {
      const documentos = await confirmarDatosAPI.createOrFetchDocumentos(gradeId, studentId, userId);
      console.log('Documentos creados o recuperados:', documentos);
      return documentos;
    } catch (error) {
      console.error('Error al crear o recuperar documentos:', error);
      throw error;
    }
  },

  fetchProgramasByFacultadId: async (facultadId) => {
    try {
      const programas = await confirmarDatosAPI.fetchProgramasByFacultadId(facultadId);
      console.log('Programas de la facultad:', programas);
      return programas;
    } catch (error) {
      console.error('Error al obtener los programas de la facultad:', error);
      throw error;
    }
  },
};

export default confirmarDatosService;
