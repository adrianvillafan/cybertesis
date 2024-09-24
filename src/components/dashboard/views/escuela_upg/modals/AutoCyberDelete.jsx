import React from 'react';
import { Modal, Button, SpaceBetween } from '@cloudscape-design/components';
import { deleteAutoCyber } from '../../../../../../src/apis/escuela_upg/modals/ApiAutoCyber'; // Asegúrate de importar la API correcta

const AutoCyberDelete = ({ visible, onClose, onConfirm, documentos, user }) => {

  const handleDelete = async () => {
    try {
      // Detalles del evento para la eliminación de AutoCyber
      const eventoDetails = {
        actor_user_id: user.user_id,
        actor_tipo_user_id: user.current_team_id, // Ajustar según el rol del usuario
        target_user_id: documentos.estudiante_id, // ID del estudiante o usuario afectado
        target_tipo_user_id: 2, // Tipo de usuario afectado
        document_id: documentos.id, // ID del documento
        tipo_documento_id: 4, // Tipo de documento (AutoCyber)
        action_type: 'Eliminación de AutoCyber',
        event_description: `Se ha eliminado el AutoCyber para el estudiante ${documentos.estudiante_id}.`,
        is_notificacion: 1
      };
  
      // Llama a la API para eliminar el documento y registra el evento
      await deleteAutoCyber(documentos.autocyber_id, eventoDetails);
  
      onConfirm(); // Llama a la función de confirmación (puede actualizar el estado en el componente padre)
      onClose(); // Cierra el modal después de eliminar
    } catch (error) {
      console.error('Error al eliminar el documento:', error);
      // Aquí puedes manejar errores, como mostrar una notificación al usuario
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
      header="Eliminar Autorización para el Depósito de Obra en Cybertesis"
    >
      ¿Está seguro de que desea eliminar este documento?
    </Modal>
  );
};

export default AutoCyberDelete;
