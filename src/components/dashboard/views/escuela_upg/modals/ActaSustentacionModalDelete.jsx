import React, { useState, useEffect } from 'react';
import { Modal, Button, SpaceBetween } from '@cloudscape-design/components';
import { fetchActaById, deleteActa } from '../../../../../../src/apis/escuela_upg/modals/ApiActaSustentacionModal';

const ActaSustentacionModalDelete = ({ visible, onClose, onConfirm, documentos }) => {
  const [actaData, setActaData] = useState(null);

  useEffect(() => {
    if (documentos.actasust_id) {
      fetchActaById(documentos.actasust_id).then(data => {
        setActaData(data);
      }).catch(error => {
        console.error('Error al obtener el acta:', error);
      });
    }
  }, [documentos.actasust_id]);

  const handleDelete = async () => {
    try {
      await deleteActa(documentos.actasust_id);
      onConfirm();
    } catch (error) {
      console.error('Error al eliminar el acta:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      closeAriaLabel="Cerrar"
      header="Eliminar Acta de Sustentación"
      footer={
        <SpaceBetween direction="horizontal" size="xs">
          <Button onClick={onClose} variant="link">Cancelar</Button>
          <Button onClick={handleDelete} variant="primary">Eliminar</Button>
        </SpaceBetween>
      }
    >
      <p>¿Está seguro de que desea eliminar esta acta de sustentación? Esta acción no se puede deshacer.</p>
      {actaData && (
        <p>
          <strong>Título:</strong> {actaData.titulo}
          <br />
          <strong>Presidente:</strong> {actaData.presidente_nombre}
          <br />
          <strong>Miembros:</strong> {actaData.miembros.map(miembro => miembro.nombre).join(', ')}
        </p>
      )}
    </Modal>
  );
};

export default ActaSustentacionModalDelete;
