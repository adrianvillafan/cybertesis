import axios from 'axios';
import {
  GET_ALL_UOARI_DOCUMENTS,
  GET_ALL_UOARI_ABIERTO,
  GET_ALL_UOARI_CERRADO,
  GET_ALL_UOARI_EMBARGADO,
  GET_ALL_UOARI_INFO,
  SET_ALL_UOARI_INFO,
  UPDATE_UOARI_INFO // Asegúrate de importar esta constante
} from '../constants/uoariApiRoutes';

const uoariAPI = {
  uoariSolicitudesDatosTabla: async () => {
    const response = await axios.get(GET_ALL_UOARI_DOCUMENTS);
    return response.data;
  },

  uoariAbiertoDatosTabla: async () => {
    const response = await axios.get(GET_ALL_UOARI_ABIERTO);
    return response.data;
  },

  uoariCerradoDatosTabla: async () => {
    const response = await axios.get(GET_ALL_UOARI_CERRADO);
    return response.data;
  },

  uoariEmbargoDatosTabla: async () => {
    const response = await axios.get(GET_ALL_UOARI_EMBARGADO);
    return response.data;
  },

  uoariDatosSolicitud: async (solicitudId) => {
    const response = await axios.get(GET_ALL_UOARI_INFO.replace('{solicitudId}', solicitudId));
    return response.data;
  },
  
  insertUoariDatos: async (uoariDetails) => {
    const response = await axios.post(SET_ALL_UOARI_INFO, uoariDetails);
    return response.data;
  },

  // NUEVA FUNCIÓN: Actualizar datos de Uoari
  updateUoariDatos: async (uoariDetails) => {
    const response = await axios.put(UPDATE_UOARI_INFO, uoariDetails);
    return response.data;
  },
};

export default uoariAPI;
