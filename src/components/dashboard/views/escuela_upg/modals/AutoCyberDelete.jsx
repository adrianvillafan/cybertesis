import React from 'react';
import { Modal, Button, SpaceBetween } from '@cloudscape-design/components';
import { deleteAutoCyber } from '../../../../../../src/apis/escuela_upg/modals/ApiAutoCyber'; // Asegúrate de importar la API correcta

const AutoCyberDelete = ({ visible, onClose, onConfirm, documentos }) => {

  const handleDelete = async () => {
    try {
      await deleteAutoCyber(documentos.autocyber_id); // Llama a la API para eliminar el documento
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
