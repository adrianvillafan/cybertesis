import React, { useEffect, useState } from 'react';
import {
  Modal,
  Table,
  Button,
  Box,
  SpaceBetween,
  Spinner,
  TextContent
} from '@cloudscape-design/components';

//import {fetchDocumentosBySolicitudId,getDownloadUrlFromMinIO} from '../../../../../../api'; // Asegúrate de que la ruta es correcta

const DetallesModal = ({ solicitud, onClose }) => {
  const [documentos, setDocumentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [documentoActual, setDocumentoActual] = useState(null);
  const [datoDocumento, setDatoDocumento] = useState(null);


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
    if (!documento) {
      console.error('Documento no definido');
      return;
    }
    try {
      const viewUrl = await getDownloadUrlFromMinIO(documento);
      setDocumentoActual(viewUrl);
    } catch (error) {
      console.error('Error al ver el documento:', error);
      // Maneja el error de manera adecuada
    }
  };
  
  const cerrarDocumento = () => {
    setDocumentoActual(null);
  };


  const descargarDocumento = async (documento) => {
    if (!documento) {
      console.error('Documento o nombre de archivo no definido');
      return;
    }
    try {
      const downloadUrl = await getDownloadUrlFromMinIO(documento);
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = documento.nombre; // Asume que el documento tiene una propiedad 'nombre'
      link.click();
    } catch (error) {
      console.error('Error al descargar el documento:', error);
      // Maneja el error de manera adecuada
    }
  };


  const descargarTodos = async () => {
    try {
      for (const documento of documentos) {
        await descargarDocumento(documento.url_documento);
        // Esperar 1 segundo antes de descargar el siguiente documento
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error('Error al descargar todos los documentos:', error);
      // Manejar el error de manera adecuada (por ejemplo, mostrar un mensaje al usuario)
    }
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
            <Button onClick={descargarTodos}>Descargar todo</Button>
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
        <>
          {documentoActual ? (
            <>
            <SpaceBetween direction="vertical" size="s">
            {datoDocumento && <TextContent><h3>{datoDocumento.id} - {datoDocumento.tipo_documento}</h3></TextContent>}
              <iframe id="documentoIframe" width="100%" height="600" src={documentoActual}></iframe>
              <Button onClick={cerrarDocumento}>Volver</Button>
            </SpaceBetween>
            </>
          ) : (
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
                 
                  <Button onClick={() => (verDocumento(item.url_documento) , setDatoDocumento(item))}>Ver</Button>
                  <Button onClick={() => descargarDocumento(item.url_documento)}>Descargar</Button>
                </div>
              ),
              minWidth: 235, // Suficiente para acomodar los botones sin apretar
              width: 240,
              maxWidth: 300
            }
          ]}
        />
      )}
    </>
  )}
  {error && <p>Error al cargar documentos: {error}</p>}
</Modal>

  );
};

export default DetallesModal;
