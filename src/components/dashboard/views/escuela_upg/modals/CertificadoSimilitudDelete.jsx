import React from 'react';
import { Modal, Button } from '@cloudscape-design/components';
import { deleteCertificadoSimilitud } from '../../../../../../api';

const CertificadoSimilitudDelete = ({ visible, onClose, onConfirm, documentos, user }) => {
  const handleDelete = async () => {
    try {
      // Definir los detalles del evento
      const eventoDetails = {
        actor_user_id: user.user_id,
        actor_tipo_user_id: user.current_team_id, // Ajustar según el rol del usuario
        target_user_id: documentos.estudiante_id, // ID del estudiante afectado
        target_tipo_user_id: 2, // Tipo de usuario target
        document_id: documentos.certsimil_id, // ID del certificado de similitud
        tipo_documento_id: 3, // Tipo certificado de similitud
        action_type: 'Eliminación de certificado de similitud',
        event_description: `Se eliminó el certificado de similitud para el estudiante ${documentos.estudiante_id}.`,
        is_notificacion: 1
      };
  
      await deleteCertificadoSimilitud(documentos.certsimil_id, eventoDetails); // Llamar a la API para eliminar el documento con evento
      onConfirm(); // Actualizar estado en el componente padre
      onClose(); // Cierra el modal
    } catch (error) {
      console.error('Error al eliminar el certificado de similitud:', error);
      // Aquí puedes manejar errores, como mostrar una notificación al usuario
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
