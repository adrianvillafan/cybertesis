import React from 'react';
import { Box, Header, Link, Button } from '@cloudscape-design/components';

const RequerimientosInicio = ({ handleStart }) => (
  <Box margin={{ vertical: 'm' }}>
    <Header variant="h1">Requerimientos para iniciar la solicitud</Header>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. IMPORTANTE: Leer los requerimientos necesarios para evitar que su solicitud sea OBSERVADA. Asegurarse de tener todos los documentos necesarios para realizar la solicitud.</p>
    <Link href="/path/to/document.pdf" external={true}>¿Aún no tienes los documentos? Descarga aquí.</Link>
    <Button variant="primary" onClick={handleStart}>Iniciar Solicitud</Button>
  </Box>
);

export default RequerimientosInicio;
