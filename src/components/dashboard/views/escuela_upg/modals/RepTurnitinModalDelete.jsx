import React from 'react';
import { Modal, Button, SpaceBetween } from '@cloudscape-design/components';

const RepTurnitinModalDelete = ({ visible, onClose, onConfirm }) => {
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
          <Button onClick={onConfirm} variant="primary">Eliminar</Button>
        </SpaceBetween>
      </SpaceBetween>
    </Modal>
  );
};

export default RepTurnitinModalDelete;
