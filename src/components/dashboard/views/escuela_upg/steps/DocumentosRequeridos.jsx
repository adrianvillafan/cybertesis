import React, { useState, useEffect } from 'react';
import { Box, Header, Button, Link, Table, SpaceBetween, StatusIndicator } from '@cloudscape-design/components';
import TesisModal from '../modals/TesisModal';
import ActaSustentacionModal from '../modals/ActaSustentacionModal';
import CertificadoSimilitud from '../modals/CertificadoSimilitud';
import AutoCyber from '../modals/AutoCyber';
import MetadatosModal from '../modals/Metadatos';
import RepTurnitinModal from '../modals/RepTurnitin';

const DocumentosRequeridos = ({
  documentos,
  handleNextStep,
  setErrorMessage,
  alumnoData,
  setCanProceed,
  canProceed,
  setStep
}) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [savedDocuments, setSavedDocuments] = useState({});
  const [asesores, setAsesores] = useState([]);
  const [jurados, setJurados] = useState([]);
  const [autores, setAutores] = useState([]);
  const [tesisCompletada, setTesisCompletada] = useState(false);



  useEffect(() => {
    if (documentos) {
      setSavedDocuments({
        'Tesis': documentos.Tesis || {},
        'Acta de Sustentación': documentos.ActaSustentacion || {},
        'Certificado de Similitud': documentos.CertificadoSimilitud || {},
        'Autorización para el depósito de obra en Cybertesis': documentos.AutoCyber || {},
        'Hoja de Metadatos': documentos.Metadatos || {},
        'Reporte de Turnitin': documentos.RepTurnitin || {},
      });
    }
  }, [documentos]);

  const handleModalClose = () => {
    setSelectedDoc(null);
  };

  const handleModalOpen = (docType, editing = false) => {
    setSelectedDoc({ type: docType, editing });
  };

  const handleSaveDocument = (docType, data) => {
    setSavedDocuments(prev => ({ ...prev, [docType]: data }));
    if (docType === 'Tesis' && data.formData && data.formData.asesores) {
      setAsesores(data.formData.asesores);
      setAutores(data.formData.autores);
      setTesisCompletada(true);
    }
    if (docType === 'Acta de Sustentación' && data.formData) {
      setJurados(data.formData.miembros);
    }
    console.log(`Datos guardados del modal (${docType}):`, data);
  };

  const documentosRequeridos = [
    { id: 1, nombre: 'Tesis' },
    { id: 2, nombre: 'Acta de Sustentación' },
    { id: 3, nombre: 'Certificado de Similitud' },
    { id: 4, nombre: 'Autorización para el depósito de obra en Cybertesis' },
    { id: 5, nombre: 'Hoja de Metadatos' },
    { id: 6, nombre: 'Reporte de Turnitin' }
  ];

  useEffect(() => {
    const allDocumentsCompleted = documentosRequeridos.every(doc => savedDocuments[doc.nombre] && Object.keys(savedDocuments[doc.nombre]).length > 0);
    setCanProceed(allDocumentsCompleted);
  }, [savedDocuments, setCanProceed]);

  return (
    <Box>
      <SpaceBetween direction="vertical" size="l">
        <Header variant="h2">Paso 2: Subir Documentos</Header>
        <Table
          items={documentosRequeridos}
          columnDefinitions={[
            { id: 'tipoDocumento', header: 'Tipo de Documento', cell: (item) => item.nombre },
            { id: 'verModelo', header: 'Ver Modelo', cell: (item) => <Link href={`/path/to/model/${item.nombre}.pdf`} external={true}>Ver modelo</Link> },
            { 
              id: 'cargarEditar', 
              header: 'Cargar / Editar / Ver', 
              cell: (item) => savedDocuments[item.nombre] ? (
                <SpaceBetween direction="horizontal" size="xs">
                  <Button onClick={() => handleModalOpen(item.nombre, false)}>Ver</Button>
                  <Button onClick={() => handleModalOpen(item.nombre, true)}>Editar</Button>
                </SpaceBetween>
              ) : (
                <Button 
                  onClick={() => handleModalOpen(item.nombre)} 
                  disabled={item.nombre === 'Acta de Sustentación' && !tesisCompletada}
                >
                  Cargar
                </Button>
              ) 
            },
            { 
              id: 'estado', 
              header: 'Estado', 
              cell: (item) => savedDocuments[item.nombre] && Object.keys(savedDocuments[item.nombre]).length > 0 ? (
                <StatusIndicator type="success">Completado</StatusIndicator>
              ) : (
                <StatusIndicator type="error">Pendiente</StatusIndicator>
              ) 
            },
          ]}
        />
      </SpaceBetween>
      <Box margin={{ top: 'l' }}>
        <Button onClick={() => setStep(1)}>Atrás</Button>
        <Button onClick={handleNextStep} disabled={!canProceed}>Siguiente</Button>
      </Box>
      {selectedDoc?.type === 'Tesis' && (
        <TesisModal 
          onClose={handleModalClose}
          alumnoData={alumnoData}
          onSave={(data) => handleSaveDocument('Tesis', data)}
          readOnly={!selectedDoc.editing}
          fileUrl={selectedDoc.editing ? '' : savedDocuments['Tesis']?.file_url || ''}
          formData={selectedDoc.editing ? {} : savedDocuments['Tesis']?.formData || {}}
        />
      )}
      {selectedDoc?.type === 'Acta de Sustentación' && (
        <ActaSustentacionModal
          onClose={handleModalClose}
          asesores={asesores}
          onSave={(data) => handleSaveDocument('Acta de Sustentación', data)}
          readOnly={!selectedDoc.editing}
          fileUrl={selectedDoc.editing ? '' : savedDocuments['Acta de Sustentación']?.file_url || ''}
          formData={selectedDoc.editing ? {} : savedDocuments['Acta de Sustentación']?.formData || {}}
        />
      )}
      {selectedDoc?.type === 'Certificado de Similitud' && (
        <CertificadoSimilitud
          onClose={handleModalClose}
          alumnoData={alumnoData}
          onSave={(data) => handleSaveDocument('Certificado de Similitud', data)}
          readOnly={!selectedDoc.editing}
          fileUrl={selectedDoc.editing ? '' : savedDocuments['Certificado de Similitud']?.file_url || ''}
        />
      )}
      {selectedDoc?.type === 'Autorización para el depósito de obra en Cybertesis' && (
        <AutoCyber
          onClose={handleModalClose}
          alumnoData={alumnoData}
          onSave={(data) => handleSaveDocument('Autorización para el depósito de obra en Cybertesis', data)}
          readOnly={!selectedDoc.editing}
          fileUrl={selectedDoc.editing ? '' : savedDocuments['Autorización para el depósito de obra en Cybertesis']?.file_url || ''}
        />
      )}
      {selectedDoc?.type === 'Hoja de Metadatos' && (
        <MetadatosModal
          onClose={handleModalClose}
          autores={autores}
          jurados={jurados}
          onSave={(data) => handleSaveDocument('Hoja de Metadatos', data)}
          readOnly={!selectedDoc.editing}
          fileUrl={selectedDoc.editing ? '' : savedDocuments['Hoja de Metadatos']?.file_url || ''}
        />
      )}
      {selectedDoc?.type === 'Reporte de Turnitin' && (
        <RepTurnitinModal
          onClose={handleModalClose}
          onSave={(data) => handleSaveDocument('Reporte de Turnitin', data)}
          readOnly={!selectedDoc.editing}
          fileUrl={selectedDoc.editing ? '' : savedDocuments['Reporte de Turnitin']?.file_url || ''}
        />
      )}
    </Box>
  );
};

export default DocumentosRequeridos;
