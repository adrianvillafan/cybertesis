import React, { useState, useRef, useEffect } from 'react';
import { Modal, Box, Spinner, Button, Icon, ColumnLayout } from '@cloudscape-design/components';
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

const ModalThreeDocs = ({ onClose, documentos }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [fileUrls, setFileUrls] = useState([null, null, null]);
  const [numPagesArray, setNumPagesArray] = useState([null, null, null]); // Número de páginas de cada documento
  const containerRefs = [useRef(null), useRef(null), useRef(null)];
  const [scales, setScales] = useState([1.0, 1.0, 1.0]); // Escala de cada documento
  const [reviewMode, setReviewMode] = useState({ mode: null, index: null }); // Estado para manejar el modo de revisión

  // Función para calcular la escala según el ancho del contenedor
  const ajustarEscala = (index) => {
    if (containerRefs[index].current) {
      const containerWidth = containerRefs[index].current.offsetWidth;
      setScales((prevScales) => {
        const newScales = [...prevScales];
        newScales[index] = containerWidth / 650; // Ajustar la escala con 650 como base
        return newScales;
      });
    }
  };

  // Efecto para ajustar el tamaño del contenedor tras cargar el modal
  useEffect(() => {
    const handleResize = () => {
      ajustarEscala(0);
      ajustarEscala(1);
      ajustarEscala(2);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Efecto para obtener los documentos y sus URLs
  useEffect(() => {
    const obtenerDocumentos = async () => {
      setIsLoading(true);
      try {
        const urls = await Promise.all(documentos.map(async (documento) => {
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

          return response && response.file_url ? response.file_url : null;
        }));

        setFileUrls(urls);
      } catch (error) {
        console.error('Error al obtener los documentos:', error);
      }
      setIsLoading(false);

      setTimeout(() => {
        ajustarEscala(0);
        ajustarEscala(1);
        ajustarEscala(2); // Ajustar la escala de los tres documentos después de cargar
      }, 100);
    };

    obtenerDocumentos();
  }, [documentos]);

  const handleDocumentLoadSuccess = (docIndex, { numPages }) => {
    setNumPagesArray((prevNumPagesArray) => {
      const newNumPagesArray = [...prevNumPagesArray];
      newNumPagesArray[docIndex] = numPages;
      return newNumPagesArray;
    });
  };

  const handleDocumentLoadError = (docIndex) => {
    console.error(`Error al cargar el archivo ${docIndex + 1}`);
  };

  const handleZoomIn = (index) => {
    setScales((prevScales) => {
      const newScales = [...prevScales];
      newScales[index] = Math.min(newScales[index] + 0.2, 3.0); // Limitar el zoom máximo a 3.0x
      return newScales;
    });
  };

  const handleZoomOut = (index) => {
    setScales((prevScales) => {
      const newScales = [...prevScales];
      newScales[index] = Math.max(newScales[index] - 0.2, 0.5); // Limitar el zoom mínimo a 0.5x
      return newScales;
    });
  };

  const handleAprobar = (index) => {
    setReviewMode({ mode: 'aprobar', index });
  };

  const handleObservar = (index) => {
    setReviewMode({ mode: 'observar', index });
  };

  if (reviewMode.mode) {
    return (
      <ReviewDocumentView
        onClose={() => setReviewMode({ mode: null, index: null })}
        documento={documentos[reviewMode.index]}
        fileUrl={fileUrls[reviewMode.index]}
        actionType={reviewMode.mode}
      />
    );
  }

  return (
    <Modal
      visible={true}
      onDismiss={onClose}
      closeAriaLabel="Cerrar modal"
      header={`Visualizando: ${documentos[0].nombre}, ${documentos[1].nombre} y ${documentos[2].nombre}`}
      size="max"
    >
      {isLoading ? (
        <Spinner size="large" />
      ) : (
        <ColumnLayout columns={3} variant="default">
          {fileUrls.map((fileUrl, index) => (
            <div
              key={index}
              ref={containerRefs[index]}
              style={{ height: '70vh', overflowY: 'auto', position: 'relative', width: '95%' }}
            >
              {/* Botones para zoom, sobrepuestos sobre el contenedor del PDF */}
              <div
                style={{
                  position: 'fixed',
                  top: '50px',
                  left: `calc(${(index + 1) * 33}%+20px)`, // Distribución de los botones según el índice
                  zIndex: 10,
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <Button onClick={() => handleZoomIn(index)} variant="primary" size="small">
                  <Icon name="zoom-in" />
                </Button>
                <Button onClick={() => handleZoomOut(index)} variant="primary" size="small">
                  <Icon name="zoom-out" />
                </Button>
              </div>

              {fileUrl ? (
                <Document
                  file={fileUrl}
                  onLoadSuccess={(data) => handleDocumentLoadSuccess(index, data)}
                  onLoadError={() => handleDocumentLoadError(index)}
                >
                  {Array.from(new Array(numPagesArray[index]), (el, pageIndex) => (
                    <Page
                      key={`page_${index + 1}_${pageIndex + 1}`}
                      pageNumber={pageIndex + 1}
                      scale={scales[index]} // Escala calculada para cada documento
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  ))}
                </Document>
              ) : (
                <Box color="red">No se pudo cargar el documento</Box>
              )}

              {/* Botones para Aprobar/Observar cada documento */}
              <div
                style={{
                  position: 'fixed',
                  bottom: '20px',
                  left: `calc(${(index + 1) * 33}%+20px)`,
                  zIndex: 10,
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <Button onClick={() => handleAprobar(index)}>
                  Aprobar
                </Button>
                <Button onClick={() => handleObservar(index)} variant="warning">
                  Observar
                </Button>
              </div>
            </div>
          ))}
        </ColumnLayout>
      )}
    </Modal>
  );
};

export default ModalThreeDocs;
