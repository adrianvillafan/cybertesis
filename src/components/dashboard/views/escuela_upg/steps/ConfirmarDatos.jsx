import React, { useState, useEffect, useContext } from 'react';
import { Box, Header, Button, Select, Spinner, ColumnLayout, Container } from '@cloudscape-design/components';
import UserContext from '../../../contexts/UserContext';
import { fetchAlumnadoByEscuelaId } from '../../../../../../api';

const ConfirmarDatos = ({ setStep, handleAlumnoSelection }) => {
  const { user } = useContext(UserContext);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [alumnoData, setAlumnoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetchAlumnadoByEscuelaId(user.escuela_id, user.grado_id)
      .then(data => {
        setAlumnos(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (selectedAlumno) {
      const alumnoSeleccionado = alumnos.find(alumno => alumno.codigo_estudiante === selectedAlumno.value);
      if (alumnoSeleccionado) {
        const alumnoInfo = {
          nombre: alumnoSeleccionado.name,
          apellidos: alumnoSeleccionado.name,
          codigo: alumnoSeleccionado.codigo_estudiante,
          facultad: alumnoSeleccionado.dni,
          especialidad: alumnoSeleccionado.especialidad,
          anioEgreso: 2020,
          foto: 'https://via.placeholder.com/150'
        };
        setAlumnoData(alumnoInfo);
        handleAlumnoSelection(alumnoInfo); // Pass the selected alumno data back to IngresarDoc
      }
    }
  }, [selectedAlumno, alumnos, handleAlumnoSelection]);

  const handleCancelar = () => {
    setStep(1);
  };

  const handleSiguiente = () => {
    setStep(3);
  };

  const handleSelectChange = (event) => {
    const selectedOption = event.detail.selectedOption;
    setSelectedAlumno(selectedOption);
  };

  return (
    <Box>
      <Header variant="h2">Paso 1: Confirmar Datos</Header>
      {error ? (
        <p>Error al cargar los alumnos: {error}</p>
      ) : (
        <>
          <Select
            selectedOption={selectedAlumno}
            onChange={handleSelectChange}
            placeholder="Seleccione un alumno"
            options={alumnos.map(alumno => ({ label: alumno.name, value: alumno.codigo_estudiante }))}
            loadingText="Cargando alumnos..."
            empty="No hay alumnos disponibles"
            statusType={isLoading ? 'loading' : undefined}
            loading={isLoading}
          />
          {alumnoData && (
            <Container margin={{ top: 'l' }} header={<Header variant="h3">Datos del Alumno</Header>}>
              <ColumnLayout columns={2} variant="default">
                <Box margin="s" textAlign="center">
                  <img src={alumnoData.foto} alt="Foto del alumno" style={{ width: 150, height: 150 }} />
                </Box>
                <Box margin="s">
                  <p><strong>Nombre:</strong> {alumnoData.nombre}</p>
                  <p><strong>Apellidos:</strong> {alumnoData.apellidos}</p>
                  <p><strong>Código:</strong> {alumnoData.codigo}</p>
                  <p><strong>Facultad:</strong> {alumnoData.facultad}</p>
                  <p><strong>Especialidad:</strong> {alumnoData.especialidad}</p>
                  <p><strong>Año de Egreso:</strong> {alumnoData.anioEgreso}</p>
                </Box>
              </ColumnLayout>
            </Container>
          )}
          <Box margin={{ top: 'l' }}>
            <Button onClick={handleCancelar}>Cancelar</Button>
            <Button onClick={handleSiguiente} disabled={!selectedAlumno}>Siguiente</Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ConfirmarDatos;
