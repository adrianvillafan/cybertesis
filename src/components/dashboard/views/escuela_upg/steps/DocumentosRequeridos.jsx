import React, { useState } from 'react';
import { Box, Header, Button, Link, Table, SpaceBetween } from '@cloudscape-design/components';
import TesisModal from '../modals/TesisModal';
import ActaSustentacionModal from '../modals/ActaSustentacionModal';
import CertificadoSimilitud from '../modals/CertificadoSimilitud';
import AutoCyber from '../modals/AutoCyber';
import MetadatosModal from '../modals/Metadatos'; // Actualiza la importación del nuevo modal
import RepTurnitin from '../modals/RepTurnitin';

const DocumentosRequeridos = ({
  tipoSolicitud,
  documentosRequeridos,
  files,
  handleFileChange,
  handleProcessSolicitud,
  handleNextStep,
  errorMessage,
  setStep,
  canProceed,
  alumnoData
}) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [savedDocuments, setSavedDocuments] = useState({});
  const [asesores, setAsesores] = useState([]);
  const [jurados, setJurados] = useState([]);
  const [autores, setAutores] = useState([]);
  const [tesisCompletada, setTesisCompletada] = useState(false);

  const handleModalClose = () => {
    setSelectedDoc(null);
  };

  const handleModalOpen = (docType) => {
    setSelectedDoc(docType);
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
    console.log(`Datos guardados del modal (${docType}):`, data); // Verificación de datos
  };

  return (
    <Box>
      <SpaceBetween direction="vertical" size="l">
        <Header variant="h2">Paso 2: Subir Documentos</Header>
        <Table
          items={documentosRequeridos[tipoSolicitud]}
          columnDefinitions={[
            { id: 'tipoDocumento', header: 'Tipo de Documento', cell: (item) => item.nombre },
            { id: 'verModelo', header: 'Ver Modelo', cell: (item) => <Link href={`/path/to/model/${item.nombre}.pdf`} external={true}>Ver modelo</Link> },
            { 
              id: 'cargarEditar', 
              header: 'Cargar / Editar', 
              cell: (item) => (
                <Button 
                  onClick={() => handleModalOpen(item.nombre)} 
                  disabled={item.nombre === 'Acta de Sustentación' && !tesisCompletada}
                >
                  Cargar/Editar
                </Button>
              ) 
            },
            { id: 'estado', header: 'Estado', cell: (item) => savedDocuments[item.nombre] ? '✔️' : '❌' },
          ]}
        />
      </SpaceBetween>
      <Box margin={{ top: 'l' }}>
        <Button onClick={() => setStep(1)}>Atrás</Button>
        <Button onClick={handleNextStep} disabled={!canProceed}>Siguiente</Button>
      </Box>
      {selectedDoc === 'Tesis' && <TesisModal onClose={handleModalClose} alumnoData={alumnoData} onSave={(data) => handleSaveDocument('Tesis', data)} />}
      {selectedDoc === 'Acta de Sustentación' && <ActaSustentacionModal onClose={handleModalClose} asesores={asesores} onSave={(data) => handleSaveDocument('Acta de Sustentación', data)} />}
      {selectedDoc === 'Certificado de Similitud' && <CertificadoSimilitud onClose={handleModalClose} alumnoData={alumnoData} onSave={(data) => handleSaveDocument('Certificado de Similitud', data)} />}
      {selectedDoc === 'Autorización para el depósito de obra en Cybertesis' && <AutoCyber onClose={handleModalClose} alumnoData={alumnoData} onSave={(data) => handleSaveDocument('Autorización para el depósito de obra en Cybertesis', data)} />}
      {selectedDoc === 'Hoja de Metadatos' && <MetadatosModal onClose={handleModalClose} autores={autores} jurados={jurados} onSave={(data) => handleSaveDocument('Hoja de Metadatos', data)} />}
      {selectedDoc === 'Reporte de Turnitin' && <RepTurnitin onClose={handleModalClose} alumnoData={alumnoData} onSave={(data) => handleSaveDocument('Reporte de Turnitin', data)} />}
    </Box>
  );
};

export default DocumentosRequeridos;
