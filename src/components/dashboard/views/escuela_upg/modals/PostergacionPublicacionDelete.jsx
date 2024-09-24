import React from 'react';
import { Modal, Button, SpaceBetween } from '@cloudscape-design/components';
import { deletePostergacionPublicacion } from '../../../../../../api';

const PostergacionPublicacionDelete = ({ visible, onClose, onConfirm, documentos, user }) => {

  const handleDelete = async () => {
    try {
      // Definir detalles del evento para la eliminación
      const eventoDetails = {
        actor_user_id: user.user_id,
        actor_tipo_user_id: user.current_team_id, // Ajustar según el rol del usuario
        target_user_id: documentos.estudiante_id, // ID del estudiante afectado
        target_tipo_user_id: 2, // Tipo de usuario target
        document_id: documentos.id, // ID del documento
        tipo_documento_id: 8, // Tipo de documento (Postergación de Publicación)
        action_type: 'Eliminación de Postergación de Publicación',
        event_description: `Se eliminó la Postergación de Publicación.`,
        is_notificacion: 1
      };
  
      // Llamar a la API para eliminar el documento y registrar el evento
      await deletePostergacionPublicacion(documentos.postergacion_id, eventoDetails);
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
      header="Eliminar Postergación de Publicación"
    >
      ¿Está seguro de que desea eliminar este documento?
    </Modal>
  );
};

export default PostergacionPublicacionDelete;
