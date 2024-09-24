import React, { useState, useEffect } from 'react';
import { Modal, Button, SpaceBetween } from '@cloudscape-design/components';
import { deleteMetadata, fetchMetadataById } from '../../../../../../api';

const MetadatosModalDelete = ({ visible, onClose, onConfirm, documentos, user }) => {
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
      // Detalles del evento para la eliminación
      const eventoDetails = {
        actor_user_id: user.user_id,
        actor_tipo_user_id: user.current_team_id, // Ajustar según el rol del usuario
        target_user_id: documentos.estudiante_id, // ID del estudiante o el usuario afectado
        target_tipo_user_id: 2, // Tipo de usuario afectado
        document_id: documentos.id, // ID del documento
        tipo_documento_id: 5, // Tipo de documento (metadatos)
        action_type: 'Eliminación de hoja de metadatos',
        event_description: `Se eliminó la hoja de metadatos del estudiante ${documentos.estudiante_id}.`,
        is_notificacion: 1
      };
  
      // Llamamos a la función para eliminar metadatos y registrar el evento
      await deleteMetadata(documentos.metadatos_id, eventoDetails);
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
