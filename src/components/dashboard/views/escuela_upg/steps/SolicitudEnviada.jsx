import React from 'react';
import { Box, Header, Button } from '@cloudscape-design/components';

const SolicitudEnviada = ({ documentoId, setStep }) => {
  return (
    <Box>
      <Header variant="h2">Documentos Cargados</Header>
      <p>Sus documentos han sido cargados exitosamente. Su número de registro de documentos es <b>#{documentoId}</b>.</p>
      <Box margin={{ top: 'l' }}>
        <Button onClick={() => setStep(1)}>Inicio</Button>
      </Box>
    </Box>
  );
};

export default SolicitudEnviada;
