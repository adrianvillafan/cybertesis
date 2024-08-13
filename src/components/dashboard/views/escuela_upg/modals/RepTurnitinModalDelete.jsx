import React from 'react';
import { Modal, Button, SpaceBetween } from '@cloudscape-design/components';
import { deleteReporteTurnitin } from '../../../../../../src/apis/escuela_upg/modals/ApiRepTurnitin'; // Asegúrate de importar la API correcta

const RepTurnitinModalDelete = ({ visible, onClose, onConfirm, documentos }) => {

  const handleDelete = async () => {
    try {
      await deleteReporteTurnitin(documentos.repturnitin_id); // Llama a la API para eliminar el documento
      onConfirm(); // Llama a la función de confirmación (puede actualizar el estado en el componente padre)
      onClose(); // Cierra el modal después de eliminar
    } catch (error) {
      console.error('Error al eliminar el reporte de Turnitin:', error);
      // Aquí puedes manejar errores, como mostrar una notificación al usuario
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
