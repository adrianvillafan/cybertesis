// src/services/escuela_upg/solicitudesService.js

import solicitudesAPI from '../../api/escuela_upg/solicitudesAPI';

const solicitudesService = {
  fetchDocumentosPorEstudiante: async (facultadId, gradoId, escuelaIds) => {
    try {
      const documentos = await solicitudesAPI.fetchDocumentosPorEstudiante(facultadId, gradoId, escuelaIds);
      console.log('Documentos encontrados:', documentos);
      return documentos;
    } catch (error) {
      console.error('Error al obtener los documentos:', error);
      throw error;
    }
  },
};

export default solicitudesService;
