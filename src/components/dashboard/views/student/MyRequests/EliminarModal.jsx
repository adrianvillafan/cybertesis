import React from 'react';
import { Modal, Button, Box, SpaceBetween } from '@cloudscape-design/components';

const EliminarModal = ({ solicitud, onClose, onConfirm }) => {
  return (
    <Modal
      header="Confirmar eliminación"
      visible={true}
      onDismiss={onClose}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={onClose}>Cancelar</Button>
            <Button variant="primary" onClick={onConfirm}>Eliminar</Button>
          </SpaceBetween>
        </Box>
      }
    >
      <p>¿Está seguro de que desea eliminar la solicitud "{solicitud.descripcion}"?</p><p> Esta acción no se puede deshacer.</p>
    </Modal>
  );
};

export default EliminarModal;
