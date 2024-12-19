import uoariAPI from '../api/uoariAPI';

const uoariService = {

    Datos_Tabla_Principal: async () => {
      try {
        const datos = await uoariAPI.uoariSolicitudesDatosTabla();
        console.log('Datos encontrados:', datos);
        return datos;
      } catch (error) {
        console.error('Error al obtener datos:', error);
        throw error;
      }
    },

    Datos_Solicitud: async (solicitudId) => {
      try {
        const datos = await uoariAPI.uoariDatosSolicitud(solicitudId);
        console.log('Datos de la solicitud encontrado:', datos);
        return datos;
      } catch (error) {
        console.error('Error al obtener de la solicitud:', error);
        throw error;
      }
    },
  
  };
  
  export default uoariService;