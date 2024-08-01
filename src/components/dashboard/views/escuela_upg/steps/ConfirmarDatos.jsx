import React, { useState, useEffect, useContext } from 'react';
import { Box, Header, Button, Select, ColumnLayout, Container, SpaceBetween } from '@cloudscape-design/components';
import UserContext from '../../../contexts/UserContext';
import { fetchAlumnadoByEscuelaId, fetchDatosByStudentId, createOrFetchDocumentos } from '../../../../../../api';

const ConfirmarDatos = ({ setStep, handleAlumnoSelection, setDocumentos }) => {
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

  const handleAlumnoChange = (event) => {
    const selectedOption = event.detail.selectedOption;
    setSelectedAlumno(selectedOption);
    setIsLoading(true);
    fetchDatosByStudentId(selectedOption.value)
      .then(alumnoInfo => {
        setAlumnoData(alumnoInfo);
        handleAlumnoSelection(alumnoInfo);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Error al obtener los datos del alumno.');
        setIsLoading(false);
      });
  };

  const handleSiguiente = async () => {
    if (selectedAlumno) {
      try {
        const fetchedDocumentos = await createOrFetchDocumentos(user.grado_id, alumnoData.id, user.user_id);
        console.log(fetchedDocumentos)
        setDocumentos(fetchedDocumentos);
        setStep(3);
      } catch (error) {
        console.error('Error al crear o recuperar documentos:', error);
        setError('Error al crear o recuperar documentos.');
      }
    }
  };

  const handleEscuelaChange = (event) => {
    const selectedOption = event.detail.selectedOption;
    setSelectedEscuela(selectedOption);
    setSelectedAlumno(null);
    setAlumnoData(null);
  };

  const handleCancelar = () => {
    setStep(1);
  };

  return (
    <Box>
      <SpaceBetween direction="vertical" size="l">
        <Header variant="h2">Paso 1: Confirmar Datos</Header>
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <>
            <SpaceBetween direction="vertical" size="s">
              {user.grado_id === 2 && (
                <Select
                  selectedOption={selectedEscuela}
                  onChange={handleEscuelaChange}
                  placeholder="Seleccione una escuela"
                  options={user.escuelas.map(escuela => ({ label: escuela.nombre_escuela, value: String(escuela.id_escuela) }))}
                />
              )}
              {(user.grado_id === 1 || selectedEscuela) && (
                <Select
                  selectedOption={selectedAlumno}
                  onChange={handleAlumnoChange}
                  placeholder="Seleccione un alumno"
                  options={alumnos.map(alumno => ({
                    label: `${alumno.nombre} ${alumno.apellidos}`,
                    value: String(alumno.codigo_estudiante),
                    description: `ID: ${alumno.dni} - Cod. Alumno: ${alumno.codigo_estudiante}`
                  }))}
                  loadingText="Cargando alumnos..."
                  empty="No hay alumnos disponibles"
                  statusType={isLoading ? 'loading' : undefined}
                  loading={isLoading}
                  filteringType="auto"
                />
              )}
            </SpaceBetween>
            {alumnoData && (
              <Container margin={{ top: 'l' }} header={<Header variant="h3">Datos del Alumno</Header>}>
                <ColumnLayout columns={2} variant="default">
                  <Box margin="s" textAlign="center">
                    <img
                      src={alumnoData.foto || `https://sisbib.unmsm.edu.pe/fotos/3/${alumnoData.identificacion_id}.jpg`}
                      alt="Foto del alumno"
                      style={{ width: 200, height: 250 }}
                    />
                  </Box>
                  <Box margin="s">
                    <p><strong>DNI:</strong> {alumnoData.identificacion_id}</p>
                    <p><strong>Nombre:</strong> {alumnoData.nombre}</p>
                    <p><strong>Apellidos:</strong> {`${alumnoData.apellidos_pat} ${alumnoData.apellidos_mat}`}</p>
                    <p><strong>Código:</strong> {alumnoData.codigo_estudiante}</p>
                    <p><strong>Correo Institucional:</strong> {alumnoData.correo_institucional}</p>
                    <p><strong>Teléfono:</strong> {alumnoData.telefono}</p>
                    <p><strong>ORCID:</strong> {alumnoData.orcid}</p>
                  </Box>
                </ColumnLayout>
              </Container>
            )}
            <Box>
              <SpaceBetween direction="horizontal" size="xs" >
                <Button onClick={handleCancelar}>Cancelar</Button>
                <Button onClick={handleSiguiente} disabled={!selectedAlumno}>Siguiente</Button>
              </SpaceBetween>

            </Box>
          </>
        )}
      </SpaceBetween>
    </Box>
  );
};

export default ConfirmarDatos;
