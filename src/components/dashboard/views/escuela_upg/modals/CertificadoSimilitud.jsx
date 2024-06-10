import React, { useState, useRef } from 'react';
import { Modal, Button, Box, SpaceBetween, FileUpload, Popover, Icon } from '@cloudscape-design/components';
import { Document, Page, pdfjs } from 'react-pdf';
import 'pdfjs-dist/web/pdf_viewer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Configura pdfjs para usar el worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const CertificadoSimilitud = ({ onClose, onSave }) => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = ({ detail }) => {
    const selectedFile = detail.value[0];
    if (selectedFile.size > 15000000) {
      alert("El tamaño del archivo excede los 15MB.");
    } else {
      setFile(selectedFile);
      setShowForm(!!selectedFile);
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileContent = event.target.result;
          setFileUrl(fileContent);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files[0];
    if (selectedFile.size > 15000000) {
      alert("El tamaño del archivo excede los 15MB.");
    } else {
      setFile(selectedFile);
      setShowForm(!!selectedFile);
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileContent = event.target.result;
          setFileUrl(fileContent);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current.querySelector('input[type="file"]').click();
  };

  const handleButtonClick = (event) => {
    event.stopPropagation();
  };

  const handleSubmit = () => {
    if (fileUrl) {
      onSave({ fileUrl });
      onClose();
    } else {
      alert("Debe subir un archivo.");
    }
  };

  const handleClose = () => {
    setFile(null);
    setShowForm(false);
    onClose();
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    console.log('Archivo cargado satisfactoriamente');
  };

  const onDocumentLoadError = () => {
    console.log('Error al cargar el archivo');
  };

  return (
    <Modal
      onDismiss={handleClose}
      visible={true}
      closeAriaLabel="Cerrar modal"
      header="Subir Certificado de Similitud"
      size={showForm ? 'large' : 'medium'}
      footer={
        <Box float='right'>
          <SpaceBetween direction="horizontal" size="m">
            <Button onClick={handleClose} variant="secondary">Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!fileUrl}>Guardar</Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween direction="vertical" size="xl" content="div">
        {!showForm ? (
          <div
            style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', height: '30vh', border: '2px dashed #aaa', borderRadius: '10px', padding: '20px', backgroundColor: '#f9f9f9', cursor: 'pointer' }}
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div ref={fileInputRef} onClick={handleButtonClick}>
              <FileUpload
                accept="application/pdf"
                value={file ? [file] : []}
                onChange={handleFileChange}
                constraintText="El tamaño máximo del archivo es de 15MB."
                i18nStrings={{
                  dropzoneText: () => 'Arrastra los archivos aquí',
                  uploadButtonText: () => 'Carga el archivo aquí',
                  removeFileAriaLabel: (fileIndex) => `Eliminar archivo ${fileIndex}`,
                }}
              />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'relative', border: '1px solid #ccc', borderRadius: '10px', padding: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ maxWidth: '100%', textAlign: 'center' }}>
              {fileUrl && (
                <Document
                  file={fileUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                >
                  {Array.from(new Array(Math.min(numPages, 15)), (el, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                  ))}
                </Document>
              )}
            </div>
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
              <Popover
                position="top"
                size="small"
                triggerType="custom"
                content={
                  <div>
                    Solo se están mostrando las 15 primeras páginas del documento.
                  </div>
                }
              >
                <Icon name="status-info" size="medium" variant="link" />
              </Popover>
            </div>
          </div>
        )}
      </SpaceBetween>
    </Modal>
  );
};

export default CertificadoSimilitud;
