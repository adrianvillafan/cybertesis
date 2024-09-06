import React from 'react';
import { Box, Header, Button, SpaceBetween } from '@cloudscape-design/components';
import { updateEstadoId, sendNotificationEmail } from '../../../../../../api'; // Importa sendNotificationEmail

const DeclaracionJurada = ({ setStep, documentos }) => {
  console.log(documentos);

  const handleEnviarSolicitud = async () => {
    try {
      // Obtener el ID del documento y los datos del alumno
      const documentId = documentos.id;
      const nombre = 'Adrian Marcel Villafan Virhuez'; // Nombre del alumno
      const email = 'adrian.villafan@unmsm.edu.pe';  // Correo del alumno

      // Actualizar el estado_id del documento a 1 (por ejemplo, "Confirmado")
      await updateEstadoId(documentId, 1);
      // Llamar a sendNotificationEmail para enviar el correo de notificación
      await sendNotificationEmail(email, nombre, `Su documento ha sido registrado con éxito. ID del documento: ${documentId}`);
      // Cambiar el paso del formulario después de la operación exitosa
      setStep(5); 
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      // Manejar los errores de forma adecuada
    }
  };

  return (
    <Box>
      <Header variant="h2">Paso 4: Confirmación de Registro</Header>
      <p>
        Al hacer clic en "Confirmar Registro", se iniciará un proceso que culminará con la notificación al alumno sobre el estado de sus documentos. En primer lugar, el sistema enviará un correo electrónico automático al alumno, informándole que todos los documentos requeridos han sido cargados correctamente y que el proceso de registro ha sido exitoso.
      </p>
      <p>
        Este correo servirá como una confirmación formal y permitirá al alumno estar al tanto del progreso de su solicitud. Además de la notificación por correo, este paso desbloquea una funcionalidad adicional en el sistema para el alumno, permitiendo la carga de su Tesis o Trabajo de Investigación en la plataforma Cybertesis.
      </p>
      <Box margin={{ top: 'l' }}>
        <SpaceBetween direction="horizontal" size="xs">
          <Button onClick={() => setStep(3)}>Atrás</Button>
          <Button variant="primary" onClick={handleEnviarSolicitud}>Confirmar Registro</Button>
        </SpaceBetween>
      </Box>
    </Box>
  );
};

export default DeclaracionJurada;
