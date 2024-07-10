const getToken = () => localStorage.getItem('token');

export const fetchMetadataById = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/metadata/${id}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error al obtener Metadata:', error);
    throw error;
  }
};

// Función para crear metadata
export const createMetadata = async (metadataData) => {
  try {
    const response = await fetch('http://localhost:3000/api/files/metadata/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(metadataData),
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('No se pudo guardar la metadata');
    }
  } catch (error) {
    console.error('Error al guardar la metadata:', error);
    throw error;
  }
};

// Función para cargar el archivo PDF a MinIO
export const uploadMetadataFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'METADATOS'); // Asegúrate de usar mayúsculas

  try {
    const response = await fetch('http://localhost:3000/api/files/upload', {
      method: 'POST',
      body: formData,
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('No se pudo cargar el archivo de metadata');
    }
  } catch (error) {
    console.error('Error al cargar el archivo de metadata:', error);
    throw error;
  }
};

export const deleteMetadata = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/metadata/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error al eliminar Metadata:', error);
    throw error;
  }
};

//----------------   Fetch Datos de Grupos , Lineas y Disciplinas   ----------------

export const fetchLineasInvestigacion = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/files/lineas-investigacion', {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error al obtener líneas de investigación:', error);
    throw error;
  }
};

export const fetchGruposInvestigacion = async (facultadId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/grupos-investigacion/${facultadId}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error al obtener grupos de investigación:', error);
    throw error;
  }
};

export const fetchDisciplinasOCDE = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/files/disciplinas-ocde', {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error al obtener disciplinas OCDE:', error);
    throw error;
  }
};
