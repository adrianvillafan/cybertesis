const getToken = () => localStorage.getItem('token');

export async function fetchSolicitudesByStudentId(studentId) {
  try {
    const response = await fetch(`http://localhost:3000/api/files/solicitudes/${studentId}`);
    if (!response.ok) {
      throw new Error('Algo salió mal al cargar las solicitudes');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchDocumentosBySolicitudId(solicitudId) {
  try {
    const response = await fetch(`http://localhost:3000/api/solicitudes/documentos/${solicitudId}`);
    if (!response.ok) {
      throw new Error('No se pudo obtener los documentos');
    }
    const documentos = await response.json();
    return documentos;
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    throw error;
  }
}



export async function fetchEscuelaByuserId(userId) {
  try {
    const response = await fetch(`http://localhost:3000/api/estudiantes/datosunidades/${userId}`);
    if (!response.ok) {
      throw new Error('No se pudo obtener los datos de la escuela o upg');
    }
    const datos = await response.json();
    console.log(datos);
    return datos;
  } catch (error) {
    console.error('Error al obtener lista de la escuela:', error);
    throw error;
  }
}

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



export async function submitDocumentos(estudianteId) {
    try {
      const response = await fetch(`http://localhost:3000/api/documentos/submit/${estudianteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('No se pudo actualizar el estado de los documentos');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error al actualizar el estado de los documentos:', error);
      throw error;
    }
  }