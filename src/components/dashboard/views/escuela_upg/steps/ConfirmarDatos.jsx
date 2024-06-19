import React, { useState, useEffect, useContext } from 'react';
import { Box, Header, Button, Select, Spinner, ColumnLayout, Container, SpaceBetween } from '@cloudscape-design/components';
import UserContext from '../../../contexts/UserContext';
import { fetchAlumnadoByEscuelaId, createOrFetchDocumentos } from '../../../../../../api';

const ConfirmarDatos = ({ setStep, handleAlumnoSelection }) => {
  const { user } = useContext(UserContext);
  const [selectedEscuela, setSelectedEscuela] = useState(null);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [alumnoData, setAlumnoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedEscuela) {
      setIsLoading(true);
      fetchAlumnadoByEscuelaId(selectedEscuela.value, user.grado_id)
        .then(data => {
          setAlumnos(data);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [selectedEscuela, user.grado_id]);

  useEffect(() => {
    if (selectedAlumno) {
      const alumnoSeleccionado = alumnos.find(alumno => alumno.codigo_estudiante === selectedAlumno.value);
      if (alumnoSeleccionado) {
        const alumnoInfo = {
          nombre: alumnoSeleccionado.name,
          apellidos: alumnoSeleccionado.name,
          codigo: alumnoSeleccionado.codigo_estudiante,
          facultad: user.nombre_facultad,
          dni: alumnoSeleccionado.dni,
          escuela: selectedEscuela ? selectedEscuela.label : user.nombre_escuela,
          especialidad: alumnoSeleccionado.especialidad,
          anioEgreso: 2020,
          foto: 'https://via.placeholder.com/150'
        };
        setAlumnoData(alumnoInfo);
        handleAlumnoSelection(alumnoInfo); // Pass the selected alumno data back to IngresarDoc
      }
    }
  }, [selectedAlumno, alumnos, handleAlumnoSelection, user.nombre_facultad, user.nombre_escuela]);

  const handleCancelar = () => {
    setStep(1);
  };

  const handleSiguiente = async () => {
    try {
      const fetchedDocumentos = await createOrFetchDocumentos(user.grado_id, alumnoData.codigo, user.id);
      setDocumentos(fetchedDocumentos);
      setStep(3);
    } catch (error) {
      setError('Error al crear o recuperar documentos.');
    }
  };

  const handleEscuelaChange = (event) => {
    const selectedOption = event.detail.selectedOption;
    setSelectedEscuela(selectedOption);
    setSelectedAlumno(null);
    setAlumnoData(null);
  };

  const handleAlumnoChange = (event) => {
    const selectedOption = event.detail.selectedOption;
    setSelectedAlumno(selectedOption);
  };

  return (
    <Box>
      <SpaceBetween direction="vertical" size="l">
        <Header variant="h2">Paso 1: Confirmar Datos</Header>
        {error ? (
          <p>Error al cargar los alumnos: {error}</p>
        ) : (
          <>
            <SpaceBetween direction="vertical" size="s">
              {user.grado_id === 2 && (
                <Select
                  selectedOption={selectedEscuela}
                  onChange={handleEscuelaChange}
                  placeholder="Seleccione una escuela"
                  options={user.escuelas.map(escuela => ({ label: escuela.nombre_escuela, value: escuela.id_escuela }))}
                />
              )}
              {(user.grado_id === 1 || selectedEscuela) && (
                <Select
                  selectedOption={selectedAlumno}
                  onChange={handleAlumnoChange}
                  placeholder="Seleccione un alumno"
                  options={alumnos.map(alumno => ({ label: alumno.name, value: alumno.codigo_estudiante }))}
                  loadingText="Cargando alumnos..."
                  empty="No hay alumnos disponibles"
                  statusType={isLoading ? 'loading' : undefined}
                  loading={isLoading}
                />
              )}
            </SpaceBetween>
            {alumnoData && (
              <Container margin={{ top: 'l' }} header={<Header variant="h3">Datos del Alumno</Header>}>
                <ColumnLayout columns={2} variant="default">
                  <Box margin="s" textAlign="center">
                    <img src={alumnoData.foto} alt="Foto del alumno" style={{ width: 150, height: 150 }} />
                  </Box>
                  <Box margin="s">
                    <p><strong>DNI:</strong> {alumnoData.dni}</p>
                    <p><strong>Nombre:</strong> {alumnoData.nombre}</p>
                    <p><strong>Apellidos:</strong> {alumnoData.apellidos}</p>
                    <p><strong>Código:</strong> {alumnoData.codigo}</p>
                    <p><strong>Facultad:</strong> {alumnoData.facultad}</p>
                    <p><strong>Escuela:</strong> {alumnoData.escuela}</p>
                    <p><strong>Especialidad:</strong> {alumnoData.especialidad}</p>
                    <p><strong>Año de Egreso:</strong> {alumnoData.anioEgreso}</p>
                  </Box>
                </ColumnLayout>
              </Container>
            )}
            <Box>
              <Button onClick={handleCancelar}>Cancelar</Button>
              <Button onClick={handleSiguiente} disabled={!selectedAlumno}>Siguiente</Button>
            </Box>
          </>
        )}
      </SpaceBetween>
    </Box>
  );
};

export default ConfirmarDatos;