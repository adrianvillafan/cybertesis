import axios from 'axios';
import {
    GET_ALL_UOARI_DOCUMENTS,
    GET_ALL_UOARI_INFO
} from '../constants/uoariApiRoutes';

const uoariAPI = {

    uoariSolicitudesDatosTabla: async () => {
      const response = await axios.get(GET_ALL_UOARI_DOCUMENTS);
      return response.data;
    },

    uoariDatosSolicitud: async (solicitudId) => {
      const response = await axios.get(GET_ALL_UOARI_INFO.replace('{solicitudId}', solicitudId));
      return response.data;
    },
  
  };
  
  export default uoariAPI;