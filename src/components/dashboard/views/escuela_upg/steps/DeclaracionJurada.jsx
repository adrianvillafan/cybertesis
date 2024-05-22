import React from 'react';
import { Box, Header, Button } from '@cloudscape-design/components';

const DeclaracionJurada = ({ enviarSolicitud, setStep }) => {
  return (
    <Box>
      <Header variant="h2">Paso 4: Declaración Jurada</Header>
      <p>Por favor, lea y acepte los términos y condiciones antes de enviar la solicitud.</p>
      <Box margin={{ top: 'l' }}>
        <Button onClick={() => setStep(3)}>Atrás</Button>
        <Button onClick={enviarSolicitud}>Enviar Solicitud</Button>
      </Box>
    </Box>
  );
};

export default DeclaracionJurada;
