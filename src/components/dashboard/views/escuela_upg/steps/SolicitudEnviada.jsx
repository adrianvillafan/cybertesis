import React from 'react';
import { Box, Header, Button } from '@cloudscape-design/components';

const SolicitudEnviada = ({ solicitudId, setStep }) => {
  return (
    <Box>
      <Header variant="h2">Solicitud Enviada</Header>
      <p>Su solicitud ha sido enviada exitosamente. Su número de solicitud es {solicitudId}.</p>
      <Box margin={{ top: 'l' }}>
        <Button onClick={() => setStep(1)}>Inicio</Button>
      </Box>
    </Box>
  );
};

export default SolicitudEnviada;
