import React from 'react';
import { Modal, Button, SpaceBetween } from '@cloudscape-design/components';
import { deleteReporteTurnitin } from '../../../../../../src/apis/escuela_upg/modals/ApiRepTurnitin'; // Asegúrate de importar la API correcta

const RepTurnitinModalDelete = ({ visible, onClose, onConfirm, documentos }) => {

  const handleDelete = async () => {
    try {
      // Detalles del evento para registrar la eliminación del reporte
      const eventoDetails = {
        actor_user_id: user.user_id,
        actor_tipo_user_id: user.current_team_id, // Ajustar según el rol del usuario
        target_user_id: documentos.estudiante_id, // ID del estudiante o el usuario afectado
        target_tipo_user_id: 2, // Tipo de usuario target
        document_id: documentos.id, // ID del documento
        tipo_documento_id: 6, // Tipo de documento (Reporte de Turnitin)
        action_type: 'Eliminación de reporte de Turnitin',
        event_description: `El usuario eliminó un archivo de reporte de Turnitin.`,
        is_notificacion: 1
      };
  
      // Llama a la API para eliminar el documento y registrar el evento
      await deleteReporteTurnitin(documentos.repturnitin_id, eventoDetails);
  
      onConfirm(); // Llama a la función de confirmación
      onClose();   // Cierra el modal después de eliminar
    } catch (error) {
      console.error('Error al eliminar el reporte de Turnitin:', error);
    }
  };
  

  return (
    <Modal
      onDismiss={onClose}
      visible={visible}
      closeAriaLabel="Close modal"
      header="Eliminar Reporte de Turnitin"
    >
      <SpaceBetween direction="vertical" size="l">
        <p>¿Estás seguro de que deseas eliminar el reporte de Turnitin?</p>
        <SpaceBetween direction="horizontal" size="xs">
          <Button onClick={onClose} variant="link">Cancelar</Button>
          <Button onClick={handleDelete} variant="primary">Eliminar</Button>
        </SpaceBetween>
      </SpaceBetween>
    </Modal>
  );
};

export default RepTurnitinModalDelete;
