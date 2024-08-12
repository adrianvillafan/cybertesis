import React, { useState } from 'react';
import { Box, Button, Container, Input, SpaceBetween, FormField, Grid } from '@cloudscape-design/components';

const NewAlumno = () => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [dni, setDni] = useState('');
  const [codigoEstudiante, setCodigoEstudiante] = useState('');
  const [facultad, setFacultad] = useState('');
  const [programa, setPrograma] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    // Aquí podrías manejar el envío de los datos, por ejemplo, haciendo una llamada a una API
    console.log({
      nombres,
      apellidos,
      dni,
      codigoEstudiante,
      facultad,
      programa,
      especialidad,
      email,
    });
  };

  return (
    <Box padding="l">
      <Container header={<h2>Datos del Estudiante</h2>}>
        <form>
          <SpaceBetween size="l">
            <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
              <FormField label="Nombres">
                <Input value={nombres} onChange={(e) => setNombres(e.detail.value)} />
              </FormField>

              <FormField label="Apellidos">
                <Input value={apellidos} onChange={(e) => setApellidos(e.detail.value)} />
              </FormField>
            </Grid>

            <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
              <FormField label="DNI">
                <Input value={dni} onChange={(e) => setDni(e.detail.value)} />
              </FormField>

              <FormField label="Código de estudiante">
                <Input value={codigoEstudiante} onChange={(e) => setCodigoEstudiante(e.detail.value)} />
              </FormField>
            </Grid>

            <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
              <FormField label="Facultad">
                <Input value={facultad} onChange={(e) => setFacultad(e.detail.value)} />
              </FormField>

              <FormField label="Programa">
                <Input value={programa} onChange={(e) => setPrograma(e.detail.value)} />
              </FormField>
            </Grid>

            <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
              <FormField label="Especialidad">
                <Input value={especialidad} onChange={(e) => setEspecialidad(e.detail.value)} />
              </FormField>

              <FormField label="Email UNMSM">
                <Input value={email} onChange={(e) => setEmail(e.detail.value)} />
              </FormField>
            </Grid>

            <Box textAlign="center">
              <Button variant="primary" onClick={handleSubmit}>
                Inscribir
              </Button>
            </Box>
          </SpaceBetween>
        </form>
      </Container>
    </Box>
  );
};

export default NewAlumno;
