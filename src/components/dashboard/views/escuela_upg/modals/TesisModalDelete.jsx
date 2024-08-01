import React, { useState, useEffect } from 'react';
import { Modal, Button, SpaceBetween } from '@cloudscape-design/components';
import { deleteTesis, fetchTesisById } from '../../../../../apis/escuela_upg/modals/ApiTesisModal';

const TesisModalDelete = ({ visible, onClose, onConfirm, documentos }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [tesisDetails, setTesisDetails] = useState(null);

  useEffect(() => {
    if (documentos && documentos.tesis_id) {
      fetchTesisById(documentos.tesis_id)
        .then((data) => setTesisDetails(data))
        .catch((error) => console.error('Error al obtener los detalles de la tesis:', error));
    }
  }, [documentos]);
  console.log('Documentos:', tesisDetails);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTesis(documentos.tesis_id);
      onConfirm();
      onClose();
    } catch (error) {
      console.error('Error al eliminar la tesis:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      onDismiss={onClose}
      visible={visible}
      closeAriaLabel="Cerrar modal"
      header="Confirmar eliminación"
      size="medium"
      footer={
        <SpaceBetween direction="horizontal" size="m">
          <Button onClick={onClose} variant="link">Cancelar</Button>
          <Button onClick={handleDelete} variant="primary" loading={isDeleting}>Eliminar</Button>
        </SpaceBetween>
      }
    >
      <p>¿Estás seguro de que deseas eliminar esta tesis? Esta acción <b>también eliminará</b> los registros asociados en <b>Acta de Sustentación</b> y <b>Hoja de Metadatos</b>.</p>
      {tesisDetails && (
        <div>
          <p><strong>Título:</strong> {tesisDetails.titulo}</p>
          <p><strong>Autor:</strong> {tesisDetails.autor1_dni}</p>
        </div>
      )}
    </Modal>
  );
};

export default TesisModalDelete;
