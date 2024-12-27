import uoariAPI from '../api/uoariAPI';

const uoariService = {

  // DATOS DE TABLA //
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

  // INSERTAR DATOS //
  Insert_Uoari_Datos: async (uoariDetails) => {
    try {
      const datosInsertados = await uoariAPI.insertUoariDatos(uoariDetails);
      console.log('Datos insertados:', datosInsertados);
      return datosInsertados;
    } catch (error) {
      console.error('Error al insertar datos:', error);
      throw error;
    }
  },

  
  // MOSTRAR DATOS DE FORMULARIO // // EDITAR FORMULARIO //
  Get_Uoari_Form: async (uoariData) => {
    try {
      const getalldatos = await uoariAPI.allUoariInfo(uoariData);
      console.log('Datos obtenidos:', deletedatos);
      return getalldatos;
    } catch (error) {
      console.error("Error al obtener datos:", error); // Manejador de errores
      throw error;
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

  // ELIMINAR REGISTROS //
  Delete_Uoari_Datos: async (uoariID) => {
    try {
      const deletedatos = await uoariAPI.deleteUoariDatos(uoariID);
      console.log('Datos insertados:', deletedatos);
      return deletedatos;
    } catch (error) {
      console.error("Error al eliminar:", error); // Manejador de errores
      throw error;
    }
  },
  
};

export default uoariService;
