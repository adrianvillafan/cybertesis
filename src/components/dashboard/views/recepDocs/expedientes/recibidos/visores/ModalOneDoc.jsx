import React, { useState, useRef, useEffect } from 'react';
import { Modal, Box, Spinner, Button, Icon, SpaceBetween, FormField, Input, RadioGroup } from '@cloudscape-design/components';
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
  const [fileUrl, setFileUrl] = useState(null);
  const [view, setView] = useState('document'); // Estado para gestionar la vista actual (documento, aprobar, observar)
  const [selectedReason, setSelectedReason] = useState(''); // Razón de observación seleccionada
  const [comment, setComment] = useState(''); // Comentario para observación
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1.0); // Estado para el nivel de zoom

  // Función para calcular la escala en función del ancho del contenedor
  const ajustarEscala = () => {
    if (containerRef.current) {
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

  const handleAprobarClick = () => {
    setView('aprobar'); // Cambiar la vista a 'aprobar'
  };

  const handleObservarClick = () => {
    setView('observar'); // Cambiar la vista a 'observar'
  };

  const handleConfirmAprobar = () => {
    console.log('Documento aprobado');
    setView('document');
  };

  const handleConfirmObservar = () => {
    console.log('Razón seleccionada:', selectedReason);
    console.log('Comentario:', comment);
    setView('document');
  };

  const renderDocumentView = () => (
    <>
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
              <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={scale} />
            ))}
          </Document>
        ) : (
          <Box color="red">No se pudo cargar el documento</Box>
        )}
      </div>

      {/* Botones para Aprobar y Observar, sobrepuestos en la parte inferior */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 10,
          display: 'flex',
          gap: '10px',
        }}
      >
        <Button onClick={handleAprobarClick}>Aprobar</Button>
        <Button onClick={handleObservarClick} variant="warning">
          Observar
        </Button>
      </div>
    </>
  );

  const renderAprobarView = () => (
    <Box padding="m">
      <h3>¿Estás seguro de que deseas aprobar este documento?</h3>
      <SpaceBetween direction="horizontal" size="m">
        <Button onClick={handleConfirmAprobar} variant="primary">
          Sí, aprobar
        </Button>
        <Button onClick={() => setView('document')}>Cancelar</Button>
      </SpaceBetween>
    </Box>
  );

  const renderObservarView = () => (
    <Box padding="m">
      <h3>Observaciones del Documento</h3>
      <FormField label="Razón de la observación">
        <RadioGroup
          onChange={({ detail }) => setSelectedReason(detail.value)}
          value={selectedReason}
          items={[
            { label: 'Contenido insuficiente', value: 'contenido_insuficiente' },
            { label: 'Errores en la gramática', value: 'errores_gramatica' },
            { label: 'Faltan referencias', value: 'faltan_referencias' },
            { label: 'Otro', value: 'otro' },
          ]}
        />
      </FormField>
      <FormField label="Comentarios adicionales">
        <Input value={comment} onChange={({ detail }) => setComment(detail.value)} />
      </FormField>
      <SpaceBetween direction="horizontal" size="m">
        <Button onClick={handleConfirmObservar} variant="warning">
          Enviar observación
        </Button>
        <Button onClick={() => setView('document')}>Cancelar</Button>
      </SpaceBetween>
    </Box>
  );

  return (
    <Modal
      visible={true}
      onDismiss={onClose}
      closeAriaLabel="Cerrar modal"
      header={`Visualizando: ${documento.nombre}`}
      size="medium"
    >
      {isLoading ? (
        <Spinner size="large" />
      ) : view === 'document' ? (
        renderDocumentView()
      ) : view === 'aprobar' ? (
        renderAprobarView()
      ) : (
        renderObservarView()
      )}
    </Modal>
  );
};

export default ModalOneDoc;
