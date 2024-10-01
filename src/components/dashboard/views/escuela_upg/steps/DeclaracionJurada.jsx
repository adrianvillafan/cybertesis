import React from 'react';
import { Box, Header, Button, SpaceBetween } from '@cloudscape-design/components';
import { updateEstadoId, sendNotificationEmail, createSolicitud } from '../../../../../../api'; // Importa createSolicitud

const DeclaracionJurada = ({ setStep, documentos, alumnoData }) => {
  console.log(alumnoData);

  const handleEnviarSolicitud = async () => {
    try {
      // Obtener el ID del documento y los datos del alumno
      const documentId = documentos.id;
      const nombre = `${alumnoData.nombre} ${alumnoData.apellidos_pat} ${alumnoData.apellidos_mat}`; // Nombre del alumno
      const email = alumnoData.correo_institucional;  // Correo del alumno
      const facultadId = alumnoData.facultad_id; // ID de la facultad

      console.log('Actualizando el estado del documento...');
      await updateEstadoId(documentId, 1);
      console.log('Estado del documento actualizado');

      console.log('Creando solicitud...');
      await createSolicitud(facultadId, documentId);
      console.log('Solicitud creada');

      console.log('Enviando correo de notificación...');
      await sendNotificationEmail(email, nombre, `Su documento ha sido registrado con éxito. ID del documento: ${documentId}`);
      console.log('Correo de notificación enviado');

      console.log('Cambiando paso a 5...');
      setStep(5); // Este debería cambiar el paso si todo ha sido exitoso
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
