const getToken = () => localStorage.getItem('token');

export async function fetchDatosByDni(tipoIdentificacionId, identificacionId) {
  try {
    const response = await fetch(`http://localhost:3000/api/estudiantes/datospersona/${tipoIdentificacionId}/${identificacionId}`);
    if (!response.ok) {
        throw new Error('No se pudo obtener los datos del estudiante');
    }
    const datos = await response.json();
    console.log(datos);
    return datos;
  } catch (error) {
    console.error('Error al obtener datos del estudiante:', error);
    throw error;
  }
}


export async function fetchDatosOrcid(orcid) {
  console.log(`Obteniendo datos de ORCID (APICALL): ${orcid}`);
  try {
    const response = await fetch(`http://localhost:3000/api/estudiantes/datosorcid/${orcid}`);
    if (!response.ok) {
        throw new Error('No se pudo obtener los datos del estudiante');
    }
    const datos = await response.json();
    console.log(datos);
    return datos;
  } catch (error) {
    console.error('Error al obtener datos del estudiante:', error);
    throw error;
  }
}

// Función para obtener expedientes del estudiante
export async function fetchExpedientes(estudianteId, gradoId) {
  try {
    const response = await fetch(`http://localhost:3000/api/solicitudes/expedientes/${estudianteId}/${gradoId}`);
    if (!response.ok) {
      throw new Error('No se pudo obtener los expedientes');
    }
    const expedientes = await response.json();
    console.log('Expedientes encontrados:', expedientes);
    return expedientes;
  } catch (error) {
    console.error('Error al obtener expedientes:', error);
    throw error;
  }
}

// Función para crear una solicitud y actualizar la tabla documentos
export async function createSolicitud(idFacultad, idDocumento) {
  try {
    const response = await fetch('http://localhost:3000/api/solicitudes/solicitudes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ idFacultad, idDocumento }),
    });
    if (!response.ok) {
      throw new Error('No se pudo crear la solicitud');
    }
    const result = await response.json();
    console.log('Solicitud creada y documento actualizado:', result);
    return result;
  } catch (error) {
    console.error('Error al crear la solicitud:', error);
    throw error;
  }
}

// Nueva función para obtener solicitudes por alumno
export async function fetchSolicitudesByAlumno(idAlumno) {
  try {
    const response = await fetch(`http://localhost:3000/api/solicitudes/solicitudes/${idAlumno}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error('No se pudo obtener las solicitudes');
    }
    const solicitudes = await response.json();
    console.log('Solicitudes encontradas:', solicitudes);
    return solicitudes;
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    throw error;
  }
}
