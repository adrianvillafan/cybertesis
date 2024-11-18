//src/components/dashboard/views/recepDocs/expedientes/recibidos/visores/ModalOneDoc.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Modal, Box, Spinner, Button, Icon, Badge, SpaceBetween } from '@cloudscape-design/components';
import { Document, Page, pdfjs } from 'react-pdf';
import 'pdfjs-dist/web/pdf_viewer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import {
  fetchTesisById,
  fetchActaById,
  fetchCertificadoById,
  fetchAutoCyberById,
  fetchMetadataById,
  fetchTurnitinById,
  fetchConsentimientoById,
  fetchPostergacionById,
} from '../../../../../../../../api';
import ReviewDocumentView from './ReviewDocumentView';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ModalOneDoc = ({ onClose, solicitudId, documento: initialDocumento, actualizarDocumentos }) => {
  const [documento, setDocumento] = useState(initialDocumento);
  const [numPages, setNumPages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState(null);
  const [reviewMode, setReviewMode] = useState(null); // Estado para manejar el modo de revisión
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1.25); // Estado para el nivel de zoom

  // Sincroniza el `documento` cada vez que se actualice en `RevisarExpediente`
  useEffect(() => {
    // Utiliza un clon para asegurarte de que React detecte la actualización del objeto
    setDocumento({ ...initialDocumento });
  }, [initialDocumento]);

  useEffect(() => {
    if (documento) {
      obtenerDocumento();
    }
  }, [documento]);

  const obtenerDocumento = async () => {
    setIsLoading(true);
    try {
      let response;
      const id = documento.id;

      switch (documento.idtable) {
        case 1:
          response = await fetchTesisById(id);
          break;
        case 2:
          response = await fetchActaById(id);
          break;
        case 3:
          response = await fetchCertificadoById(id);
          break;
        case 4:
          response = await fetchAutoCyberById(id);
          break;
        case 5:
          response = await fetchMetadataById(id);
          break;
        case 6:
          response = await fetchTurnitinById(id);
          break;
        case 7:
          response = await fetchConsentimientoById(id);
          break;
        case 8:
          response = await fetchPostergacionById(id);
          break;
        default:
          throw new Error('Tipo de documento desconocido');
      }

      if (response && response.file_url) {
        setFileUrl(response.file_url);
      } else {
        console.error('No se pudo obtener la URL del documento');
      }
    } catch (error) {
      console.error('Error al obtener el documento:', error);
    }
    setIsLoading(false);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const onDocumentLoadError = () => {
    console.error('Error al cargar el archivo');
    setIsLoading(false);
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.2, 3.0)); // Limitar el zoom máximo a 3.0x
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5)); // Limitar el zoom mínimo a 0.5x
  };

  const handleAprobar = () => {
    setReviewMode('aprobar');
  };

  const handleObservar = () => {
    setReviewMode('observar');
  };

  // Función para manejar la actualización completa del estado del documento
  const handleActualizarDocumento = async () => {
    const documentosActualizados = await actualizarDocumentos(); // Actualiza los documentos en RevisarExpediente.jsx y obtiene los actualizados
    const documentoActualizado = documentosActualizados.find(doc => doc.id === documento.id);
    if (documentoActualizado) {
      setDocumento({ ...documentoActualizado }); // Actualiza el documento en este modal
    }
  };

  if (reviewMode) {
    return (
      <ReviewDocumentView
        onClose={() => setReviewMode(null)}
        documento={documento}
        solicitudId={solicitudId}
        fileUrl={fileUrl}
        actionType={reviewMode}
        actualizarDocumentos={handleActualizarDocumento}
      />
    );
  }

  return (
    <Modal
      visible={true}
      onDismiss={onClose}
      closeAriaLabel="Cerrar modal"
      header={`Visualizando: ${documento.nombre}`}
      size="large"
    >
      {isLoading ? (
        <Spinner size="large" />
      ) : (
        <div ref={containerRef} style={{ height: '70vh', overflowY: 'auto', position: 'relative' }}>
          {/* Botones para zoom, sobrepuestos sobre el contenedor del PDF */}
          <div
            style={{
              position: 'fixed',
              top: '50px',
              left: '20px',
              zIndex: 10,
              display: 'flex',
              gap: '10px',
            }}
          >
            <Button onClick={handleZoomIn} variant="primary" size="small">
              <Icon name="zoom-in" />
            </Button>
            <Button onClick={handleZoomOut} variant="primary" size="small">
              <Icon name="zoom-out" />
            </Button>
          </div>

          {fileUrl ? (
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={scale} />
              ))}
            </Document>
          ) : (
            <Box color="red">No se pudo cargar el documento</Box>
          )}

          {/* Mostrar estado o botones según el estado del documento */}
          <div
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '20px',
              zIndex: 10,
            }}
          >
            {documento.estado === 1 ? (
              <Badge color="green">Aceptado</Badge>
            ) : documento.estado === 2 ? (
              <Badge color="red">Observado</Badge>
            ) : (
              <SpaceBetween size="xs" direction="horizontal">
                <Button onClick={handleAprobar} variant="primary">
                  Aprobar
                </Button>
                <Button onClick={handleObservar} variant="warning">
                  Observar
                </Button>
              </SpaceBetween>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ModalOneDoc;
