import React from 'react';
import { Modal, Button, SpaceBetween } from '@cloudscape-design/components';
import { deleteConsentimiento } from '../../../../../../api'; // Asegúrate de importar la API correcta

const ConsentimientoInformadoDelete = ({ visible, onClose, onConfirm, documentos, user }) => {

  const handleDelete = async () => {
    try {
      // Detalles del evento para registrar la eliminación
      const eventoDetails = {
        actor_user_id: user.user_id,
        actor_tipo_user_id: user.current_team_id, // Ajustar según el rol del usuario
        target_user_id: documentos.estudiante_id, // ID del estudiante afectado
        target_tipo_user_id: 2, // Tipo de usuario target
        document_id: documentos.id, // ID del documento
        tipo_documento_id: 7, // Tipo Consentimiento Informado
        action_type: 'Eliminación de consentimiento informado',
        event_description: `Se eliminó el consentimiento informado del estudiante ${documentos.estudiante_id}.`,
        is_notificacion: 1
      };
  
      // Llama a la API para eliminar el documento y registrar el evento
      await deleteConsentimiento(documentos.consentimiento_id, eventoDetails);
      onConfirm();
      onClose();
    } catch (error) {
      console.error('Error al eliminar el documento:', error);
      // Manejo de errores, como mostrar una notificación al usuario
    }
  };
  

  return (
    <Modal
      onDismiss={onClose}
      visible={visible}
      closeAriaLabel="Cerrar"
      footer={
        <SpaceBetween direction="horizontal" size="s">
          <Button onClick={onClose} variant="link">Cancelar</Button>
          <Button onClick={handleDelete} variant="primary">Eliminar</Button>
        </SpaceBetween>
      }
      header="Eliminar Consentimiento Informado"
    >
      ¿Está seguro de que desea eliminar este documento?
    </Modal>
  );
};

export default ConsentimientoInformadoDelete;
