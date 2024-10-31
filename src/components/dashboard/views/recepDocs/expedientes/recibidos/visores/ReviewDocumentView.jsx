import React, { useState, useRef, useEffect, useContext } from 'react';
import { Modal, Box, Spinner, Button, Icon, SpaceBetween, FormField, Textarea, RadioGroup, ColumnLayout, Tiles } from '@cloudscape-design/components';
import { Document, Page, pdfjs } from 'react-pdf';
import 'pdfjs-dist/web/pdf_viewer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import UserContext from '../../../../../contexts/UserContext';
import { updateEstadoDocumento } from '../../../../../../../../api';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ReviewDocumentView = ({ onClose, documento, fileUrl, actionType, solicitudId, actualizarDocumentos }) => {
  const { user } = useContext(UserContext);
  console.log('documento', documento);
  const [numPages, setNumPages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReason, setSelectedReason] = useState(''); // Razón de observación seleccionada
  const [comment, setComment] = useState(''); // Comentario para observación
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.95); // Estado para el nivel de zoom

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
    setIsLoading(true);
    if (fileUrl) {
      setTimeout(() => {
        ajustarEscala(); // Llamar a ajustar escala después de la carga del documento
        setIsLoading(false);
      }, 100); // Asegurarse de que el modal esté completamente cargado
    } else {
      console.error('No se pudo obtener la URL del documento');
      setIsLoading(false);
    }
  }, [fileUrl]);

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

  const handleConfirmAprobar = async () => {
    try {
      console.log('Datos enviando:', solicitudId, documento.idtable, 1, null, null, user.id);
      await updateEstadoDocumento(solicitudId, documento.idtable, 1, null, null, user.id); // Estado 1 = Aprobado, revisorId = user.id (ejemplo)
      console.log('Documento aprobado');
      actualizarDocumentos();
      onClose();
    } catch (error) {
      console.error('Error al aprobar el documento:', error);
    }
  };

  const handleConfirmObservar = async () => {
    try {
      console.log('Datos enviando:', solicitudId, documento.idtable, 2, selectedReason, comment, user.id);
      await updateEstadoDocumento(solicitudId, documento.idtable, 2, selectedReason, comment, user.id); // Estado 2 = Observado, revisorId = 123 (ejemplo)
      console.log('Documento observado');
      actualizarDocumentos();
      onClose();
    } catch (error) {
      console.error('Error al observar el documento:', error);
    }
  };

  return (
    <Modal
      visible={true}
      onDismiss={onClose}
      closeAriaLabel="Cerrar modal"
      header={`Visualizando: ${documento.nombre}`}
      size="max"
    >
      {isLoading ? (
        <Spinner size="large" />
      ) : (
        <ColumnLayout columns={2} variant="default">
          <div ref={containerRef} style={{ height: '70vh', overflowY: 'auto', position: 'relative', width: '100%' }}>
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
          </div>

          <Box padding="m">
            {actionType === 'aprobar' ? (
              <>
                <Box variant="h3" margin={{ bottom: 'm' }}>¿Estás seguro de que deseas aprobar este documento?</Box>
                <Box textAlign="center" margin={{ top: 'm' }}>
                  <Button onClick={handleConfirmAprobar} variant="primary">
                    Sí, aprobar
                  </Button>
                </Box>
              </>
            ) : actionType === 'observar' ? (
              <>
                <Box variant="h3" margin={{ bottom: 'm' }}>Observaciones del Documento</Box>
                <Tiles
                  items={[
                    { label: 'Contenido insuficiente', value: 'contenido_insuficiente' },
                    { label: 'Errores en la gramática', value: 'errores_gramatica' },
                    { label: 'Faltan referencias', value: 'faltan_referencias' },
                    { label: 'Otro', value: 'otro' },
                  ]}
                  value={selectedReason}
                  onChange={({ detail }) => setSelectedReason(detail.value)}
                  columns={1}
                  spacing="s"
                />

                {selectedReason === 'otro' && (
                  <FormField label="Comentarios adicionales" margin={{ top: 'm' }}>
                    <Textarea value={comment} onChange={({ detail }) => setComment(detail.value)} />
                  </FormField>
                )}

                <Box textAlign="center" margin={{ top: 'm' }}>
                  <Button onClick={handleConfirmObservar} variant="warning">
                    Enviar observación
                  </Button>
                </Box>
              </>
            ) : null}
          </Box>
        </ColumnLayout>
      )}
    </Modal>
  );
};

export default ReviewDocumentView;
