import uoariAPI from '../api/uoariAPI';

const uoariService = {

    Datos_Tabla_Principal: async () => {
      try {
        const datos = await uoariAPI.uoariSolicitudesDatosTabla();
        console.log('Datos del estudiante encontrados:', datos);
        return datos;
      } catch (error) {
        console.error('Error al obtener datos del estudiante:', error);
        throw error;
      }
    },
  
  };
  
  export default uoariService;