import React from 'react';
import { Modal, Button } from '@cloudscape-design/components';
import { deleteCertificadoSimilitud } from '../../../../../../api';

const CertificadoSimilitudDelete = ({ visible, onClose, onConfirm, documentos }) => {
  const handleDelete = async () => {
    try {
      await deleteCertificadoSimilitud(documentos.certsimil_id);
      onConfirm();
      onClose();
    } catch (error) {
      console.error('Error al eliminar el certificado de similitud:', error);
    }
  };

  return (
    <Modal
      onDismiss={onClose}
      visible={visible}
      closeAriaLabel="Close modal"
      size="small"
      footer={
        <Button variant="primary" onClick={handleDelete}>
          Confirmar
        </Button>
      }
      header="Confirmar eliminación"
    >
      <p>¿Estás seguro de que deseas eliminar el certificado de similitud?</p>
    </Modal>
  );
};

export default CertificadoSimilitudDelete;
