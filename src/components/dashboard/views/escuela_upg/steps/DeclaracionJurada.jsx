import React from 'react';
import { Box, Header, Button } from '@cloudscape-design/components';
import { updateEstadoId } from '../../../../../../api'; // Importa la función para actualizar el estado

const DeclaracionJurada = ({ setStep, documentos }) => {
  console.log(documentos);
  const handleEnviarSolicitud = async () => {
    try {
      // Suponiendo que documentos tiene el id del documento actual
      const documentId = documentos.id;
      await updateEstadoId(documentId, 1); // Llama a la función para actualizar el estado_id a 1
      
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      // Muestra un mensaje de error al usuario si es necesario
    }
    setStep(5); // Cambia el paso a 5
  };

  return (
    <Box>
      <Header variant="h2">Paso 4: Declaración Jurada</Header>
      <p>Por favor, lea y acepte los términos y condiciones antes de enviar la solicitud.</p>
      <Box margin={{ top: 'l' }}>
      <SpaceBetween direction="horizontal" size="xs" >
        <Button onClick={() => setStep(3)}>Atrás</Button>
        <Button onClick={handleEnviarSolicitud}>Enviar Solicitud</Button>
      </SpaceBetween>
      </Box>
    </Box>
  );
};

export default DeclaracionJurada;
