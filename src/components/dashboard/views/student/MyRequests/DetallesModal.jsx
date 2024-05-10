import React, { useEffect, useState } from 'react';
import {
  Modal,
  Table,
  Button,
  Icon,
  Box,
  SpaceBetween,
  Spinner
} from '@cloudscape-design/components';
import { fetchDocumentosBySolicitudId } from '../../../../../../api'; // Asegúrate de que la ruta es correcta

const DetallesModal = ({ solicitud, onClose }) => {
  const [documentos, setDocumentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!solicitud) return;

    const cargarDocumentos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const docs = await fetchDocumentosBySolicitudId(solicitud.id);
        setDocumentos(docs);
      } catch (err) {
        setError(err.message);
        console.error('Error al cargar documentos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDocumentos();
  }, [solicitud]);

  if (!solicitud) return null;

  if (isLoading) {
    return <Spinner size="normal" />;
  }

  if (error) {
    return <p>Error al cargar documentos: {error}</p>;
  }

  const descargarTodos = () => {
    documentos.forEach(doc => {
      window.open(doc.url, '_blank');
    });
  };

  return (
    <Modal
      header="Detalles de la Solicitud"
      visible={true}
      onDismiss={onClose}
      size="large"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={descargarTodos}>Descargar todos</Button>
            <Button onClick={onClose}>Cerrar</Button>
          </SpaceBetween>
        </Box>
      }
    >
      <Table
        items={documentos}
        columnDefinitions={[
          {
            header: 'Tipo',
            cell: item => item.tipo // Asegúrate de que este campo exista en la respuesta del servidor
          },
          {
            header: 'Documento',
            cell: item => (
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <Icon name="document" />
                {item.nombre}
              </span>
            )
          },
          {
            header: 'Acciones',
            cell: item => (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button onClick={() => window.open(item.url, '_blank')}>Descargar</Button>
                <Button onClick={() => window.open(item.url, '_blank')}>Visualizar</Button>
              </div>
            )
          }
        ]}
      />
    </Modal>
  );
};

export default DetallesModal;
