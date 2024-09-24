import React, { useState, useRef, useEffect } from 'react';
import { Modal, Box, SpaceBetween, Spinner, Grid } from '@cloudscape-design/components';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ModalTwoDocs = ({ onClose, fileUrls, headerText }) => {
  const [numPages1, setNumPages1] = useState(null);
  const [numPages2, setNumPages2] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onDocumentLoadSuccess = (setNumPages) => ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  return (
    <Modal
      visible={true}
      onDismiss={onClose}
      closeAriaLabel="Cerrar modal"
      header={headerText}
      size="large"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="m">
            <Box variant="span">Ambos documentos cargados correctamente</Box>
          </SpaceBetween>
        </Box>
      }
    >
      {isLoading ? (
        <Spinner size="large" />
      ) : (
        <div ref={containerRef} style={{ height: '70vh', overflowY: 'auto' }}>
          <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
            <Document
              file={fileUrls[0]}
              onLoadSuccess={onDocumentLoadSuccess(setNumPages1)}
              onLoadError={() => console.error('Error al cargar el archivo')}
            >
              {Array.from(new Array(numPages1), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} width={width / 2} />
              ))}
            </Document>

            <Document
              file={fileUrls[1]}
              onLoadSuccess={onDocumentLoadSuccess(setNumPages2)}
              onLoadError={() => console.error('Error al cargar el archivo')}
            >
              {Array.from(new Array(numPages2), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} width={width / 2} />
              ))}
            </Document>
          </Grid>
        </div>
      )}
    </Modal>
  );
};

export default ModalTwoDocs;
