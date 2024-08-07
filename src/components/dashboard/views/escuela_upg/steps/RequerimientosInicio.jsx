import React from 'react';
import { Box, Button, SpaceBetween } from '@cloudscape-design/components';

const RequerimientosInicio = ({ handleStart }) => (
  <Box textAlign="center">
    <SpaceBetween size="xs">
      <h1>Requerimientos para iniciar la solicitud</h1>
      <p>La Dirección de la Escuela Profesional (EP) o la Dirección de la Unidad de Posgrado (UPG) enviará la tesis y la documentación al correo:</p>
      
      <Button variant="primary" onClick={handleStart}>Iniciar Solicitud</Button>
    </SpaceBetween>
  </Box>
);

export default RequerimientosInicio;
