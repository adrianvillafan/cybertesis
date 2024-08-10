import React from 'react';
import { Box, Header, Button } from '@cloudscape-design/components';

const SolicitudEnviada = ({ documentoId, setStep }) => {
  return (
    <Box>
      <Header variant="h2">Documentos Cargados Satisfactoriamente</Header>
      <p>
        Sus documentos han sido cargados exitosamente en el sistema, y se ha enviado una notificación de confirmación al correo electrónico del alumno. Esta notificación incluye todos los detalles relevantes y sirve como prueba de que el proceso de carga se ha completado de manera satisfactoria.
      </p>
      <p>
        El número de registro de su expediente es <b>#{documentoId}</b>. Este número es único y le permitirá hacer un seguimiento preciso de su solicitud en el futuro. Por favor, guarde este número de registro para sus archivos personales, ya que lo necesitará para cualquier consulta o seguimiento posterior.
      </p>
      <p>
        Para revisar el estado de sus documentos en cada etapa del proceso, desde la carga inicial hasta la aceptación o rechazo final en la plataforma Cybertesis, puede acceder al apartado de expedientes en su cuenta. Aquí podrá verificar el progreso de su solicitud y recibir actualizaciones sobre su estado, asegurando que está al tanto de todos los pasos hasta la culminación de su trámite.
      </p>
      <Box margin={{ top: 'l' }}>
        <Button onClick={() => setStep(1)}>Inicio</Button>
      </Box>
    </Box>
  );
};

export default SolicitudEnviada;
