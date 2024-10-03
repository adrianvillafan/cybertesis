import React, { useState, useRef, useEffect } from 'react';
import { Modal, Box, SpaceBetween, Spinner, Button, Icon } from '@cloudscape-design/components';
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

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ModalOneDoc = ({ onClose, documento }) => {
  const [numPages, setNumPages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1.0); // Estado para el nivel de zoom
  const [containerWidth, setContainerWidth] = useState(0); // Estado para el ancho del contenedor

  // Función para calcular la escala en función del ancho del contenedor
  const ajustarEscala = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      setScale(containerRef.current.offsetWidth / 650); // Ajustar escala a 650 de ancho base
    }
  };

  // Efecto para ajustar el ancho del contenedor después de cargar el modal
  useEffect(() => {
    const handleResize = () => {
      ajustarEscala();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
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

      // Ajustar la escala cuando el documento está listo
      setTimeout(() => {
        ajustarEscala(); // Llamar a ajustar escala después de la carga del documento
      }, 100); // Asegurarse de que el modal esté completamente cargado
    };

    obtenerDocumento();
  }, [documento]);

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

  return (
    <Modal
      visible={true}
      onDismiss={onClose}
      closeAriaLabel="Cerrar modal"
      header={`Visualizando: ${documento.nombre}`}
      size="medium"
      footer={
        <SpaceBetween direction="horizontal" size="m">
          <Button disabled={isSubmitting} onClick={() => console.log('Aprobar')}>
            Aprobar
          </Button>
          <Button disabled={isSubmitting} onClick={() => console.log('Observar')} variant="warning">
            Observar
          </Button>
          <Button disabled={isSubmitting} onClick={onClose}>
            Cerrar
          </Button>
        </SpaceBetween>
      }
    >
      {isLoading ? (
        <Spinner size="large" />
      ) : (
        <div ref={containerRef} style={{ height: '70vh', overflowY: 'auto', position: 'relative' }}>
          {/* Botones para zoom, superpuestos sobre el contenedor del PDF */}
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
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  scale={scale} // Usar la escala calculada
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              ))}
            </Document>
          ) : (
            <Box color="red">No se pudo cargar el documento</Box>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ModalOneDoc;
