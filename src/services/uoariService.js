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

    Datos_Tabla_Abierto: async () => {
      try {
        const datos = await uoariAPI.uoariAbiertoDatosTabla();
        console.log('Datos encontrados:', datos);
        return datos;
      } catch (error) {
        console.error('Error al obtener datos:', error);
        throw error;
      }
    },

    Datos_Tabla_Cerrado: async () => {
      try {
        const datos = await uoariAPI.uoariCerradoDatosTabla();
        console.log('Datos encontrados:', datos);
        return datos;
      } catch (error) {
        console.error('Error al obtener datos:', error);
        throw error;
      }
    },

    Datos_Tabla_Embargo: async () => {
      try {
        const datos = await uoariAPI.uoariEmbargoDatosTabla();
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
  
    
    Insert_Uoari_Datos: async (uoariDetails) => {
      try {
        const datosInsertados = await uoariAPI.insertUoariDatos(uoariDetails); // Llama a la función que realiza el POST
        console.log('Datos insertados:', datosInsertados);
        return datosInsertados; // Devuelve la respuesta de la API
      } catch (error) {
        console.error('Error al insertar datos:', error);
        throw error; // Lanza el error para manejarlo en el llamado
      }
    },
    
    Update_Uoari_Datos: async (uoariDetails) => {
      try {
        const datosActualizados = await uoariAPI.updateUoariDatos(uoariDetails);
        console.log('Datos actualizados:', datosActualizados);
        return datosActualizados;
      } catch (error) {
        console.error('Error al actualizar datos:', error);
        throw error;
      }
    },
    
  };
  
  export default uoariService;