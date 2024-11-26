import React, { useState, useEffect, useRef, useContext } from 'react';
import { Modal, Box, Header, SpaceBetween, Button, ColumnLayout, FileUpload, Spinner, Table, Icon } from '@cloudscape-design/components';
import { Document, Page, pdfjs } from 'react-pdf';
import 'pdfjs-dist/web/pdf_viewer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import UserContext from '../../../../contexts/UserContext';

import { fetchActaById, fetchAutoCyberById, fetchCertificadoById, fetchConsentimientoById, fetchMetadataById, fetchPostergacionById, fetchTurnitinById, fetchTesisById } from '../../../../../../../api';
import { uploadTesisFile, uploadReporteTurnitinFile, uploadPostergacionPublicacionFile, uploadMetadataFile, uploadConsentimientoFile, uploadCertificadoFile, uploadAutoCyberFile } from '../../../../../../../api';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ModalObservados = ({ isOpen, onClose, documentos, idEstudiante }) => {
  const [currentView, setCurrentView] = useState('table');
  const [file, setFile] = useState(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);
  const [newFileUrl, setNewFileUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [correctedDocuments, setCorrectedDocuments] = useState([]);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [selectedDocumento, setSelectedDocumento] = useState(null);
  const { user } = useContext(UserContext);

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

  const handleFileChange = ({ detail }) => {
    const selectedFile = detail.value[0];
    if (selectedFile.size > 20000000) {
      alert("El tamaño del archivo excede los 20MB.");
    } else {
      setFile(selectedFile);
      if (selectedFile) {
        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileContent = event.target.result;
          setNewFileUrl(fileContent);
          setIsLoading(false);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files[0];
    if (selectedFile.size > 20000000) {
      alert("El tamaño del archivo excede los 20MB.");
    } else {
      setFile(selectedFile);
      if (selectedFile) {
        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileContent = event.target.result;
          setNewFileUrl(fileContent);
          setIsLoading(false);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleClick = (event) => {
    event.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setTimeout(() => setWidth(containerRef.current.offsetWidth), 0);
  };

  const onDocumentLoadError = () => {
    console.log('Error al cargar el archivo');
  };

  const handleRevisarDocumento = async (documento) => {
    setSelectedDocumento(documento);
    setIsLoading(true);
    try {
      let response;
      switch (documento.tipo_documento_id) {
        case 1:
          response = await fetchTesisById(documento.id_documento_observado);
          break;
        case 2:
          response = await fetchActaById(documento.id_documento_observado);
          break;
        case 3:
          response = await fetchCertificadoById(documento.id_documento_observado);
          break;
        case 4:
          response = await fetchAutoCyberById(documento.id_documento_observado);
          break;
        case 5:
          response = await fetchMetadataById(documento.id_documento_observado);
          break;
        case 6:
          response = await fetchTurnitinById(documento.id_documento_observado);
          break;
        case 7:
          response = await fetchConsentimientoById(documento.id_documento_observado);
          break;
        case 8:
          response = await fetchPostergacionById(documento.id_documento_observado);
          break;
        default:
          throw new Error('Tipo de documento desconocido');
      }

      setSelectedFileUrl(response.file_url);
      setCurrentView('replace');
    } catch (error) {
      console.error('Error al obtener el documento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCorregir = async () => {
    if (!file) {
      alert("Por favor, cargue un archivo antes de corregir.");
      return;
    }

    setIsLoading(true);

    try {
      let newFileName;
      let eventoUploadDetails = {
        actor_user_id: user.user_id,
        actor_tipo_user_id: user.current_team_id,
        target_user_id: idEstudiante,
        target_tipo_user_id: 2,
        document_id: selectedDocumento.id_documento_observado,
        tipo_documento_id: selectedDocumento.tipo_documento_id,
        action_type: 'Reemplazo de documento observado',
        event_description: `Se reemplazó el documento observado para el estudiante con ID ${idEstudiante}.`,
        is_notificacion: 1,
      };

      switch (selectedDocumento.tipo_documento_id) {
        case 1:
          newFileName = `Tesis_${idEstudiante}.pdf`;
          break;
        case 2:
          newFileName = `ActaSustentacion_${idEstudiante}.pdf`;
          break;
        case 3:
          newFileName = `CertSimilitud_${idEstudiante}.pdf`;
          break;
        case 4:
          newFileName = `AutoCyber_${idEstudiante}.pdf`;
          break;
        case 5:
          newFileName = `Metadatos_${idEstudiante}.pdf`;
          break;
        case 6:
          newFileName = `RepTurnitin_${idEstudiante}.pdf`;
          break;
        case 7:
          newFileName = `ConsInformado_${idEstudiante}.pdf`;
          break;
        case 8:
          newFileName = `PostPublicacion_${idEstudiante}.pdf`;
          break;
        default:
          throw new Error('Tipo de documento desconocido');
      }

      const renamedFile = new File([file], newFileName, { type: file.type });

      let uploadResponse;
      switch (selectedDocumento.tipo_documento_id) {
        case 1:
          uploadResponse = await uploadTesisFile(renamedFile, eventoUploadDetails);
          break;
        case 2:
          uploadResponse = await uploadAutoCyberFile(renamedFile, eventoUploadDetails);
          break;
        case 3:
          uploadResponse = await uploadCertificadoFile(renamedFile, eventoUploadDetails);
          break;
        case 4:
          uploadResponse = await uploadAutoCyberFile(renamedFile, eventoUploadDetails);
          break;
        case 5:
          uploadResponse = await uploadMetadataFile(renamedFile, eventoUploadDetails);
          break;
        case 6:
          uploadResponse = await uploadReporteTurnitinFile(renamedFile, eventoUploadDetails);
          break;
        case 7:
          uploadResponse = await uploadConsentimientoFile(renamedFile, eventoUploadDetails);
          break;
        case 8:
          uploadResponse = await uploadPostergacionPublicacionFile(renamedFile, eventoUploadDetails);
          break;
        default:
          throw new Error('Tipo de documento desconocido');
      }

      if (uploadResponse) {
        alert('Documento actualizado correctamente.');
        setCurrentView('table');
        setCorrectedDocuments([...correctedDocuments, selectedDocumento.id_documento_observado]);
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      alert('Error al subir el archivo. Por favor, inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={isOpen}
      onDismiss={onClose}
      header={<Header variant="h2">{currentView === 'table' ? 'Documentos Observados' : 'Reemplazar Documento'}</Header>}
      closeAriaLabel="Cerrar modal"
      size={currentView === 'table' ? 'large' : 'max'}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={() => {
              if (currentView === 'table') {
                onClose();
              } else {
                setCurrentView('table');
              }
            }}>
              {currentView === 'table' ? 'Cerrar' : 'Volver a la tabla'}
            </Button>
            {currentView === 'table' && (
              <Button variant="primary" onClick={() => alert('Solicitud reenviada correctamente.')}>
                Reenviar solicitud
              </Button>
            )}
            {currentView === 'replace' && (
              <Button variant="primary" onClick={handleCorregir} disabled={correctedDocuments.includes(selectedDocumento?.id_documento_observado)}>
                {correctedDocuments.includes(selectedDocumento?.id_documento_observado) ? 'Corregido' : 'Corregir'}
              </Button>
            )}
          </SpaceBetween>
        </Box>
      }
    >
      {currentView === 'table' ? (
        documentos && documentos.length > 0 ? (
          <Table
            columnDefinitions={[
              {
                id: 'tipoDocumento',
                header: 'Tipo de Documento',
                cell: (item) => item.tipo_documento_observado,
              },
              {
                id: 'idDocumento',
                header: 'ID del Documento',
                cell: (item) => item.id_documento_observado,
              },
              {
                id: 'acciones',
                header: 'Acciones',
                cell: (item) => (
                  correctedDocuments.includes(item.id_documento_observado) ? (
                    <Icon name="status-positive" size="large" variant="success" />
                  ) : (
                    <Button onClick={() => handleRevisarDocumento(item)}>Revisar</Button>
                  )
                ),
              },
            ]}
            items={documentos}
            empty={<Box>No hay documentos observados disponibles.</Box>}
          />
        ) : (
          <Box>No hay documentos observados disponibles.</Box>
        )
      ) : (
        <ColumnLayout columns={2} variant="default">
          <div ref={containerRef} style={{ height: 'calc(75vh)', overflowY: 'auto', position: 'relative', border: '1px solid #ccc', borderRadius: '10px', padding: '5px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', textAlign: 'left' }}>
            {selectedFileUrl && (
              <Document
                file={selectedFileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                width={width}
              >
                {Array.from(new Array(Math.min(numPages, 15)), (el, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} width={width - 60} />
                ))}
              </Document>
            )}
          </div>
          <div style={{ height: 'calc(75vh)', overflowY: 'auto', padding: '5px 15px 5px 5px', borderRadius: '10px' }}>
            {!newFileUrl ? (
              <div
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', border: '2px dashed #aaa', borderRadius: '10px', padding: '20px', backgroundColor: '#ffffff', cursor: 'pointer' }}
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div ref={fileInputRef}>
                  <FileUpload
                    accept="application/pdf"
                    value={file ? [file] : []}
                    onChange={handleFileChange}
                    constraintText="El tamaño máximo del archivo es de 20MB."
                    i18nStrings={{
                      dropzoneText: () => 'Arrastra los archivos aquí o haz clic para seleccionar',
                      uploadButtonText: () => 'Seleccionar archivo',
                      removeFileAriaLabel: (fileIndex) => `Eliminar archivo ${fileIndex}`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <Document
                file={newFileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                width={width}
              >
                {Array.from(new Array(Math.min(numPages, 15)), (el, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} width={width - 60} />
                ))}
              </Document>
            )}
          </div>
        </ColumnLayout>
      )}
    </Modal>
  );
};

export default ModalObservados;
