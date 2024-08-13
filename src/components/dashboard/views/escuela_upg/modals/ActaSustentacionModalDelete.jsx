import React, { useState, useEffect } from 'react';
import { Modal, Button, SpaceBetween } from '@cloudscape-design/components';
import { fetchActaById, deleteActa } from '../../../../../../src/apis/escuela_upg/modals/ApiActaSustentacionModal';
import { fetchDatosByDni } from '../../../../../../api';

const ActaSustentacionModalDelete = ({ visible, onClose, onConfirm, documentos }) => {
  const [actaData, setActaData] = useState(null);
  const [presidente, setPresidente] = useState(null);
  const [miembro1, setMiembro1] = useState(null);
  const [miembro2, setMiembro2] = useState(null);
  const [miembro3, setMiembro3] = useState(null);

  useEffect(() => {
    if (documentos.actasust_id) {
      fetchActaById(documentos.actasust_id)
        .then(data => {
          console.log('Acta:', data);
          setActaData(data);
          fetchDatosByDni(1,data.presidente_dni).then(presidente => setPresidente(presidente));
          fetchDatosByDni(1,data.miembro1_dni).then(miembro1 => setMiembro1(miembro1));
          fetchDatosByDni(1,data.miembro2_dni).then(miembro2 => setMiembro2(miembro2));
          if (data.miembro3_dni) {
            fetchDatosByDni(data.miembro3_dni).then(miembro3 => setMiembro3(miembro3));
          }
        })
        .catch(error => {
          console.error('Error al obtener el acta:', error);
        });
    }
  }, [documentos.actasust_id]);

  const handleDelete = async () => {
    try {
      await deleteActa(documentos.actasust_id);
      onConfirm();
      onClose();
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
        <div>
          <p><strong>Presidente:</strong> {presidente ? `${presidente.nombre} ${presidente.apellido}` : 'Cargando...'}</p>
          <p><strong>Miembro 1:</strong> {miembro1 ? `${miembro1.nombre} ${miembro1.apellido}` : 'Cargando...'}</p>
          <p><strong>Miembro 2:</strong> {miembro2 ? `${miembro2.nombre} ${miembro2.apellido}` : 'Cargando...'}</p>
          {actaData.miembro3_dni && (
            <p><strong>Miembro 3:</strong> {miembro3 ? `${miembro3.nombre} ${miembro3.apellido}` : 'Cargando...'}</p>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ActaSustentacionModalDelete;
