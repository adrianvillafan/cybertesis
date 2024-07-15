import React from 'react';
import { Modal, Button, SpaceBetween } from '@cloudscape-design/components';

const AutoCyberDelete = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal
      onDismiss={onClose}
      visible={visible}
      closeAriaLabel="Cerrar"
      footer={
        <SpaceBetween direction="horizontal" size="s">
          <Button onClick={onClose} variant="link">Cancelar</Button>
          <Button onClick={onConfirm} variant="primary">Eliminar</Button>
        </SpaceBetween>
      }
      header="Eliminar Autorización para el Depósito de Obra en Cybertesis"
    >
      ¿Está seguro de que desea eliminar este documento?
    </Modal>
  );
};

export default AutoCyberDelete;
