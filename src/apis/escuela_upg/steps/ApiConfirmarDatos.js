const getToken = () => localStorage.getItem('token');

export async function fetchAlumnadoByEscuelaId(escuelaId, gradoId) {
    try {
      const response = await fetch(`http://localhost:3000/api/estudiantes/alumnosunidades/${escuelaId}/${gradoId}`);
      if (!response.ok) {
        throw new Error('No se pudo obtener los alumnos');
      }
      const alumnado = await response.json();
      console.log(alumnado);
      return alumnado;
    } catch (error) {
      console.error('Error al obtener lista de alumnado de la escuela:', error);
      throw error;
    }
  }
  
  export async function fetchDatosByStudentId(studentId) {
    try {
      const response = await fetch(`http://localhost:3000/api/estudiantes/datosalumno/${studentId}`);
      if (!response.ok) {
        throw new Error('No se pudo obtener los datos del alumno');
      }
      const alumnoData = await response.json();
      console.log(alumnoData);
      return alumnoData;
    } catch (error) {
      console.error('Error al obtener los datos del alumno:', error);
      throw error;
    }
  }

export async function createOrFetchDocumentos(gradeId, studentId, userId) {
  try {
    const response = await fetch('http://localhost:3000/api/files/create-or-fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ gradeId, studentId, userId }),
    });

    if (!response.ok) {
      throw new Error('No se pudo crear o recuperar los documentos');
    }

    return response.json();
  } catch (error) {
    console.error('Error al crear o recuperar documentos:', error);
    throw error;
  }
}
