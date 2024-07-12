import React, { useState, useEffect } from 'react';
import { Modal, Button, SpaceBetween } from '@cloudscape-design/components';
import { deleteMetadata, fetchMetadataById } from '../../../../../../api';

const MetadatosModalDelete = ({ visible, onClose, onConfirm, documentos }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [metadataDetails, setMetadataDetails] = useState(null);

  console.log('Documentos:', documentos);

  useEffect(() => {
    if (documentos && documentos.metadata_id) {
      fetchMetadataById(documentos.metadata_id)
        .then((data) => setMetadataDetails(data))
        .catch((error) => console.error('Error al obtener los detalles de la hoja de metadatos:', error));
    }
  }, [documentos]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMetadata(documentos.metadatos_id);
      onConfirm();
      onClose();
    } catch (error) {
      console.error('Error al eliminar la hoja de metadatos:', error);
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
      <p>¿Estás seguro de que deseas eliminar esta hoja de metadatos? Esta acción no se puede deshacer.</p>
      {metadataDetails && (
        <div>
          <p><strong>Autor:</strong> {metadataDetails.autores.map(autor => autor.nombre).join(', ')}</p>
          <p><strong>Presidente:</strong> {metadataDetails.presidente.nombre}</p>
          <p><strong>Jurado:</strong> {metadataDetails.jurados.map(jurado => jurado.nombre).join(', ')}</p>
        </div>
      )}
    </Modal>
  );
};

export default MetadatosModalDelete;
