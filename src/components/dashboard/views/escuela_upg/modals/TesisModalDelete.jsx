import React, { useState, useEffect } from 'react';
import { Modal, Button, SpaceBetween } from '@cloudscape-design/components';
import { deleteTesis, fetchTesisById } from '../../../../../apis/escuela_upg/modals/ApiTesisModal';

const TesisModalDelete = ({ visible, onClose, onConfirm, documentos, user }) => {
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
        // Define los detalles del evento de eliminación
        const eventoDetails = {
            actor_user_id: user.user_id,                  // Usuario que está eliminando
            actor_tipo_user_id: user.current_team_id,     // Tipo de usuario
            target_user_id: documentos.estudiante_id,     // Usuario afectado (por ejemplo, el estudiante)
            target_tipo_user_id: 2,                       // Tipo de usuario afectado (por ejemplo, 2 = estudiante)
            document_id: documentos.tesis_id,             // ID de la tesis
            tipo_documento_id: 1,                         // Tipo de documento (1 para tesis)
            action_type: 'Eliminación de tesis',          // Acción realizada
            event_description: `Se eliminó la tesis ${documentos.titulo} con id ${documentos.tesis_id}`, // Descripción del evento
            is_notificacion: 1                            // Notificación habilitada
        };

        // Enviar solicitud para eliminar la tesis con los detalles del evento
        await deleteTesis(documentos.tesis_id, eventoDetails);
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
