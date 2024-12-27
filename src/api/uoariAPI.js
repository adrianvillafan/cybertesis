import axios from 'axios';
import {
  GET_ALL_UOARI_DOCUMENTS, // DATOS DE TABLA //
  GET_ALL_UOARI_ABIERTO, // DATOS DE TABLA //
  GET_ALL_UOARI_CERRADO, // DATOS DE TABLA //
  GET_ALL_UOARI_EMBARGADO, // DATOS DE TABLA //

  SET_ALL_UOARI_INFO, // INSERTAR DATOS //

  GET_ALL_UOARI_INFO, // MOSTRAR DATOS DE FORMULARIO //
  UPDATE_UOARI_INFO, // EDITAR FORMULARIO //

  DELETE_UOARI_INFO // ELIMINAR REGISTROS //
} from '../constants/uoariApiRoutes';

const uoariAPI = {

  // DATOS DE TABLA //
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

  
  // INSERTAR DATOS //
  insertUoariDatos: async (uoariDetails) => {
    const response = await axios.post(SET_ALL_UOARI_INFO, uoariDetails);
    return response.data;
  },

  // MOSTRAR DATOS DE FORMULARIO // // EDITAR FORMULARIO //
  allUoariInfo: async (uoariData) => {
    const response = await axios.get(GET_ALL_UOARI_INFO(uoariData));
    return response.data;
  },

  updateUoariDatos: async () => {
    const response = await axios.put(UPDATE_UOARI_INFO);
    return response.data;
  },


  // ELIMINAR REGISTROS //
  deleteUoariDatos: async (uoariID) => {
    const response = await axios.delete(DELETE_UOARI_INFO(uoariID));
    return response.data;
  },
};

export default uoariAPI;
