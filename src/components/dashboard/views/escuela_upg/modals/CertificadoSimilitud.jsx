import React, { useState } from 'react';
import { Modal, Button, Box, SpaceBetween, FileUpload } from '@cloudscape-design/components';
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
      size={showForm ? 'large' : 'small'}
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
          <Box display="flex" justifyContent="center">
            <FileUpload
              accept="application/pdf"
              value={file ? [file] : []}
              onChange={handleFileChange}
              constraintText="El tamaño máximo del archivo es de 15MB."
              i18nStrings={{
                dropzoneText: () => 'Arrastra los archivos aquí o haz clic para seleccionar',
                uploadButtonText: () => 'Seleccionar archivo',
                removeFileAriaLabel: (fileIndex) => `Eliminar archivo ${fileIndex}`,
              }}
            />
          </Box>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div>
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
          </div>
        )}
      </SpaceBetween>
    </Modal>
  );
};

export default CertificadoSimilitud;
