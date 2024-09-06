import React from 'react';
import { Box, Header, Button, SpaceBetween } from '@cloudscape-design/components';
import { updateEstadoId } from '../../../../../../api'; // Importa la función para actualizar el estado

const DeclaracionJurada = ({ setStep, documentos }) => {
  console.log(documentos);
  const handleEnviarSolicitud = async () => {
    try {
      // Suponiendo que documentos tiene el id del documento actual
      const documentId = documentos.id;
      const nombre = 'Adrian Marcel Villafan Virhuez'; // Nombre del alumno
      const email = 'adrian.villafan@unmsm.edu.pe';
      await updateEstadoId(documentId, 1); // Llama a la función para actualizar el estado_id a 1
      
      // URL de tu Google Apps Script para enviar el correo de "Expediente Cargado Exitosamente"
      /* const emailUrl = `https://script.google.com/macros/s/AKfycbwB7mnqFkYTanszqDLGj33CpqRd0K-p6KGoBuuWx_bTG7k9x_KcJ3X_xKbEQ1JEojKnEA/exec?email=adrian.villafan@unmsm.edu.pe&contentId=1&customerName=${nombre}&solicitudId=${documentId}`;

      // Realiza la solicitud fetch para enviar el correo
      await fetch(emailUrl, {
        method: 'GET'
      });
 */
      await sendMail(email, 'Registro Exitoso - Código de Verificación', nombre, documentId);

    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      // Muestra un mensaje de error al usuario si es necesario
    }
    setStep(5); // Cambia el paso a 5
  };

  return (
    <Box>
      <Header variant="h2">Paso 4: Confirmación de Registro</Header>
      <p>
        Al hacer clic en "Confirmar Registro", se iniciará un proceso que culminará con la notificación al alumno sobre el estado de sus documentos. En primer lugar, el sistema enviará un correo electrónico automático al alumno, informándole que todos los documentos requeridos han sido cargados correctamente y que el proceso de registro ha sido exitoso. Este correo servirá como una confirmación formal y permitirá al alumno estar al tanto del progreso de su solicitud.
      </p>
      <p>
        Además de la notificación por correo, este paso es crucial ya que desbloquea una funcionalidad adicional en el sistema para el alumno. Una vez que el registro esté confirmado, se le habilitará la opción de proceder con la solicitud de carga de su Tesis o Trabajo de Investigación en la plataforma Cybertesis. Esta opción no estará disponible hasta que se confirme el registro, asegurando que todos los documentos estén en orden antes de avanzar en el proceso académico.
      </p>
      <p>
        Es importante destacar que la acción de confirmar el registro es irreversible y formaliza la recepción de los documentos por parte del sistema. Por lo tanto, asegúrate de que toda la información ingresada y los documentos cargados estén correctos antes de proceder. Este paso garantiza que el alumno puede continuar con las etapas finales de su programa académico, culminando en la publicación de su trabajo en Cybertesis, una plataforma global que asegura la visibilidad y preservación de su investigación.
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
