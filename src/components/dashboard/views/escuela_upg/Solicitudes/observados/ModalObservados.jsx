import React from 'react';
import { Modal, Table, Button, Box } from '@cloudscape-design/components';

const ModalObservados = ({ isVisible, onClose, documentosObservados }) => {
  return (
    <Modal
      onDismiss={onClose}
      visible={isVisible}
      closeAriaLabel="Cerrar modal"
      header="Documentos Observados"
    >
      {documentosObservados.length > 0 ? (
        <Table
          items={documentosObservados}
          columnDefinitions={[
            {
              id: 'tipoDocumento',
              header: 'Tipo de Documento',
              cell: item => item.tipo_documento_observado,
            },
            {
              id: 'idDocumento',
              header: 'ID del Documento',
              cell: item => item.id_documento_observado,
            },
          ]}
          ariaLabels={{
            allItemsSelectionLabel: () => 'Seleccionar todos los documentos',
            itemSelectionLabel: (item) => `Seleccionar ${item.tipo_documento_observado}`,
          }}
        />
      ) : (
        <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
          No hay documentos observados para este expediente.
        </Box>
      )}
      <Box float="right" margin={{ top: 'm' }}>
        <Button variant="primary" onClick={() => alert('Funcionalidad de corregir pendiente de implementar')}>Corregir</Button>
      </Box>
    </Modal>
  );
};

export default ModalObservados;
