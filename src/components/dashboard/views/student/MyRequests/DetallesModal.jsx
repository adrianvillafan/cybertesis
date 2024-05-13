import React, { useEffect, useState } from 'react';
import {
  Modal,
  Table,
  Button,
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
    if (solicitud && solicitud.id) {
      setIsLoading(true);
      fetchDocumentosBySolicitudId(solicitud.id)
        .then(data => {
          setDocumentos(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error al cargar documentos:', err);
          setError('Error al cargar documentos');
          setIsLoading(false);
        });
    }
  }, [solicitud]);

  if (!solicitud) return null;

  const verDocumento = async (documento) => {
    try {
      // Lógica para obtener el URL de vista del documento, podría ser similar a la lógica de obtener un URL de descarga temporal
      const viewUrl = await getViewUrlForDocument(documento);
      window.open(viewUrl, '_blank'); // Abre el documento en una nueva pestaña
    } catch (error) {
      console.error('Error al ver el documento:', error);
      // Maneja el error de manera adecuada, posiblemente mostrando un mensaje al usuario
    }
  };
  
  const descargarDocumento = async (documento) => {
    try {
      // Lógica para obtener el URL de descarga del documento
      const downloadUrl = await getDownloadUrlFromMinIO(BUCKET_NAME, documento.fileName);
      window.open(downloadUrl, '_blank'); // Descarga el documento
    } catch (error) {
      console.error('Error al descargar el documento:', error);
      // Maneja el error de manera adecuada, posiblemente mostrando un mensaje al usuario
    }
  };

  

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
      {isLoading && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <Spinner size="large" />
        </div>
      )}
      {!isLoading && !error && (
        <Table
          items={documentos}
          resizableColumns
          columnDefinitions={[
            {
              header: 'ID',
              cell: item => item.id,
              minWidth: 40, // Puedes ajustar según tus necesidades
              width: 50,
              maxWidth: 60 // Asegura que esta columna siempre tenga el mismo tamaño
            },
            {
              header: 'Documento',
              cell: item => (
                <span style={{ display: 'flex', alignItems: 'left' }}>
                  {item.tipo_documento}
                </span>
              ),
              width: 200,
              minWidth: 160, // Ancho mínimo necesario para evitar que se comprima demasiado
              maxWidth: 250 // Asegura que esta columna no crezca más allá de 200px
            },
            {
              header: 'Fecha de Carga',
              cell: item => {
                const date = new Date(item.fecha_carga);
                return `${date.toLocaleDateString('es-ES')} ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
              },
              width: 150,
              minWidth: 120, // Ajusta según lo que consideres adecuado para la fecha
              maxWidth: 180
            },
            {
              header: 'Estado',
              cell: item => "Activo", // Cambia "Activo" por item.estado si tienes esa data
              minWidth: 60,
              width: 90,
              maxWidth: 120
            },
            
            {
              header: 'Acciones',
              cell: item => (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button onClick={() => verDocumento(item)}>Ver</Button>
                  <Button onClick={() => descargarDocumento(item)}>Descargar</Button>
                </div>
              ),
              minWidth: 235, // Suficiente para acomodar los botones sin apretar
              width: 240,
              maxWidth: 300
            }
          ]}
        />)}
      {error && <p>Error al cargar documentos: {error}</p>}
    </Modal>

  );
};

export default DetallesModal;
