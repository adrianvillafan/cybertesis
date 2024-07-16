const getToken = () => localStorage.getItem('token');

// Función para obtener un reporte de Turnitin por ID
export const fetchTurnitinById = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/reporte-turnitin/${id}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error al obtener Reporte de Turnitin:', error);
    throw error;
  }
};

// Función para crear un reporte de Turnitin
export const createReporteTurnitin = async (reporteData) => {
  console.log('reporteDataAPI:', reporteData);
  try {
    const response = await fetch('http://localhost:3000/api/files/reporte-turnitin/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(reporteData),
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('No se pudo guardar el reporte de Turnitin');
    }
  } catch (error) {
    console.error('Error al guardar el reporte de Turnitin:', error);
    throw error;
  }
};

// Función para cargar el archivo PDF a MinIO
export const uploadReporteTurnitinFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'TURNITIN');

  try {
    const response = await fetch('http://localhost:3000/api/files/upload', {
      method: 'POST',
      body: formData,
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('No se pudo cargar el archivo del reporte de Turnitin');
    }
  } catch (error) {
    console.error('Error al cargar el archivo del reporte de Turnitin:', error);
    throw error;
  }
};

// Función para eliminar un reporte de Turnitin por ID
export const deleteReporteTurnitin = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/reporte-turnitin/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error al eliminar Reporte de Turnitin:', error);
    throw error;
  }
};
