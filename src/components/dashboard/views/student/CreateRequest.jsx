import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Button, FileUpload, SpaceBetween, Spinner, Icon, Popover, Container, FormField, Select, Table } from '@cloudscape-design/components';
import { Document, Page, pdfjs } from 'react-pdf';
import Wizard from "@cloudscape-design/components/wizard";
import UserContext from '../../contexts/UserContext';
import { fetchExpedientes, createSolicitud } from '../../../../../api';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const CreateRequest = () => {
  const { user } = useContext(UserContext);
  const [expedientes, setExpedientes] = useState([]);
  const [selectedExpediente, setSelectedExpediente] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [showProrrogaStep, setShowProrrogaStep] = useState(false);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [solicitudId, setSolicitudId] = useState(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchExpedientes(user.estudiante_id, user.grado_id)
        .then((data) => {
          const expedientesOptions = data.map((exp) => ({
            label: `Expediente ${exp.id}`,
            value: exp
          }));
          setExpedientes(expedientesOptions);
        })
        .catch((error) => console.error('Error al cargar expedientes:', error));
    }
  }, [user]);

  const mapExpedienteToDocumentos = (expediente) => {
    return [
      { id: expediente.tesis_id, nombre: 'Tesis', estado: expediente.tesis_id ? 'Registrado' : 'Pendiente' },
      { id: expediente.actasust_id, nombre: 'Acta de Sustentación', estado: expediente.actasust_id ? 'Registrado' : 'Pendiente' },
      { id: expediente.certsimil_id, nombre: 'Certificado de Similitud', estado: expediente.certsimil_id ? 'Registrado' : 'Pendiente' },
      { id: expediente.autocyber_id, nombre: 'Autorización para el depósito de obra en Cybertesis', estado: expediente.autocyber_id ? 'Registrado' : 'Pendiente' },
      { id: expediente.metadatos_id, nombre: 'Hoja de Metadatos', estado: expediente.metadatos_id ? 'Registrado' : 'Pendiente' },
      { id: expediente.repturnitin_id, nombre: 'Reporte de Turnitin', estado: expediente.repturnitin_id ? 'Registrado' : 'Pendiente' }
    ];
  };

  const handleSelectExpediente = (expediente) => {
    setIsLoading(true);
    setSelectedExpediente(expediente);
    const documentosMapped = mapExpedienteToDocumentos(expediente.value);
    setDocumentos(documentosMapped);
    setIsLoading(false);
    setActiveStepIndex(1);
  };

  const handleAdjuntarProrroga = () => {
    setShowProrrogaStep(true);
    setActiveStepIndex(2);
  };

  const handleRealizarSolicitud = () => {
    if (selectedExpediente && user) {
      createSolicitud(user.facultad_id, selectedExpediente.value.id)
        .then((result) => {
          setSolicitudId(result.id);
          setActiveStepIndex(3);
        })
        .catch((error) => console.error('Error al realizar la solicitud:', error));
    } else {
      console.error('Debe seleccionar un expediente y estar autenticado para realizar una solicitud');
    }
  };

  const handleCancel = () => {
    setActiveStepIndex(0);
    setSelectedExpediente(null);
    setDocumentos([]);
    setShowProrrogaStep(false);
    setFile(null);
    setFileUrl('');
  };

  const handleBack = () => {
    if (activeStepIndex === 2 && showProrrogaStep) {
      setShowProrrogaStep(false);
      setFile(null);
      setFileUrl('');
    }
    setActiveStepIndex(1);
  };

  const handleFileChange = ({ detail }) => {
    const selectedFile = detail.value[0];
    if (selectedFile.size > 15000000) {
      alert("El tamaño del archivo excede los 15MB.");
    } else {
      setFile(selectedFile);
      if (selectedFile) {
        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileContent = event.target.result;
          setFileUrl(fileContent);
          setIsLoading(false);
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
      if (selectedFile) {
        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileContent = event.target.result;
          setFileUrl(fileContent);
          setIsLoading(false);
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

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = () => {
    console.log('Error al cargar el archivo');
  };

  const steps = [
    {
      title: "Seleccionar expediente",
      content: (
        <FormField label="Expediente">
          <Select
            options={expedientes}
            selectedOption={selectedExpediente}
            onChange={({ detail }) => handleSelectExpediente(detail.selectedOption)}
            placeholder="Seleccione un expediente"
          />
          {isLoading && <Spinner size="large" />}
        </FormField>
      ),
    },
    {
      title: selectedExpediente ? `Revisar expediente N° ${selectedExpediente.value.id}` : "Revisar documentos",
      content: (
        <SpaceBetween size="l">
          {isLoading ? (
            <Spinner size="large" />
          ) : (
            <>
              <Table
                items={documentos}
                columnDefinitions={[
                  { id: 'id', header: 'ID Documento', cell: (item) => item.id },
                  { id: 'tipoDocumento', header: 'Tipo de Documento', cell: (item) => item.nombre },
                  {
                    id: 'acciones',
                    header: 'Acciones',
                    cell: (item) => (
                      <SpaceBetween direction="horizontal" size="xs">
                        <Button onClick={() => console.log(`Revisar documento ${item.id}`)}>Revisar</Button>
                        <Button onClick={() => console.log(`Reportar documento ${item.id}`)}>Reportar</Button>
                      </SpaceBetween>
                    )
                  }
                ]}
              />
              <Button onClick={handleAdjuntarProrroga}>Adjuntar Prórroga</Button>
            </>
          )}
        </SpaceBetween>
      ),
    },
    ...(showProrrogaStep ? [{
      title: "Adjuntar prórroga",
      isOptional: true,
      content: (
        <SpaceBetween direction="horizontal" size="xxs" alignItems="center">
          {!fileUrl ? (
            <Box width="100%" padding="s">
              <Box margin={{ bottom: "m" }}>
                <strong>Artículo 13. De la postergación de la subida del Documento</strong>
                <p>
                  El estudiante tiene el derecho de solicitar la postergación de su documento en la plataforma CYBERTESIS
                  por un período máximo de 24 meses. Para hacer efectiva esta solicitud, el estudiante debe presentar un documento
                  adicional a los seis ya mencionados anteriormente, que justifique las razones para dicha postergación.
                </p>
              </Box>
    
              <div
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh', border: '2px dashed #aaa', borderRadius: '10px', padding: '20px', backgroundColor: '#f9f9f9', cursor: 'pointer' }}
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
                      dropzoneText: () => 'Arrastra los archivos aquí o haz clic para seleccionar',
                      uploadButtonText: () => 'Seleccionar archivo',
                      removeFileAriaLabel: (fileIndex) => `Eliminar archivo ${fileIndex}`,
                    }}
                  />
                </div>
              </div>
            </Box>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center">
              <div ref={containerRef} style={{ height: 'calc(75vh)', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '10px', padding: '5px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
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
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <Popover
                    dismissButton={false}
                    position="top"
                    size="small"
                    triggerType="click"
                    content={<div>Se están mostrando {Math.min(numPages, 15)} páginas de un total de {numPages}.</div>}
                  >
                    <Icon name="status-info" size="medium" variant="link" />
                  </Popover>
                </div>
              </div>
            </Box>
          )}
        </SpaceBetween>
      ),
    }] : []),
    {
      title: "Realizar solicitud",
      content: (
        <Box>
          <p>
            Declaro bajo responsabilidad que he revisado cada uno de los documentos
            correspondientes al expediente seleccionado y estoy conforme con el envío.
          </p>
          <Button variant="primary" onClick={handleRealizarSolicitud}>Realizar Solicitud</Button>
        </Box>
      ),
    }
  ];

  return (
    <Container>
      {solicitudId ? (
        <Box padding="l">
          <h3>Solicitud enviada exitosamente</h3>
          <p>El ID de su solicitud es: <strong>{solicitudId}</strong></p>
          <p>Se ha enviado una constancia de esta acción al correo del alumno.</p>
        </Box>
      ) : (
        <Wizard
          activeStepIndex={activeStepIndex}
          allowSkipTo={false}
          i18nStrings={{
            stepNumberLabel: stepNumber => `Paso ${stepNumber}`,
            collapsedStepsLabel: (stepNumber, stepsCount) => `Paso ${stepNumber} de ${stepsCount}`,
            skipToButtonLabel: step => `Saltar a ${step.title}`,
            navigationAriaLabel: "Pasos",
            cancelButton: "Cancelar",
            nextButton: "Siguiente",
            previousButton: "Atrás",
            submitButton: "Realizar solicitud",
            optional: "opcional"
          }}
          onNavigate={({ detail }) => {
            if (detail.reason === 'previous') {
              handleBack();
            } else {
              setActiveStepIndex(detail.requestedStepIndex);
            }
          }}
          onCancel={handleCancel}
          steps={steps}
          isLoadingNextStep={isLoading}
        />
      )}
    </Container>
  );
};

export default CreateRequest;
