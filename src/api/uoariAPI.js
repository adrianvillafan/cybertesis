import axios from 'axios';
import {
    GET_ALL_UOARI_DOCUMENTS
} from '../constants/uoariApiRoutes';

const uoariAPI = {

    uoariSolicitudesDatosTabla: async () => {
      const response = await axios.get(GET_ALL_UOARI_DOCUMENTS);
      return response.data;
    },
  
  };
  
  export default uoariAPI;