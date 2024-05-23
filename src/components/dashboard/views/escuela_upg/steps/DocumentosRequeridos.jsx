import React, { useEffect, useState } from 'react';
import { Box, Header, Button, Link, Table } from '@cloudscape-design/components';
import TesisModal from '../modals/TesisModal';
import ActaSustentacionModal from '../modals/ActaSustentacionModal';
import CertificadoSimilitud from '../modals/CertificadoSimilitud';
import AutoCyber from '../modals/AutoCyber';
import Metadatos from '../modals/Metadatos';
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

  const handleModalClose = () => {
    setSelectedDoc(null);
  };

  const handleModalOpen = (docType) => {
    setSelectedDoc(docType);
  };

  console.log(alumnoData)

  return (
    <Box>
      <Header variant="h2">Paso 2: Subir Documentos</Header>
      <Table
        items={documentosRequeridos[tipoSolicitud]}
        columnDefinitions={[
          { id: 'tipoDocumento', header: 'Tipo de Documento', cell: (item) => item.nombre },
          { id: 'verModelo', header: 'Ver Modelo', cell: (item) => <Link href={`/path/to/model/${item.nombre}.pdf`} external={true}>Ver modelo</Link> },
          { id: 'cargarEditar', header: 'Cargar / Editar', cell: (item) => <Button onClick={() => handleModalOpen(item.nombre)}>Cargar/Editar</Button> },
          { id: 'estado', header: 'Estado', cell: (item, index) => files[index]?.length > 0 ? '✔️' : '❌' },
        ]}
      />
      <Box margin={{ top: 'l' }}>
        <Button onClick={() => setStep(1)}>Atrás</Button>
        <Button onClick={handleNextStep} disabled={!canProceed}>Siguiente</Button>
      </Box>
      {selectedDoc === 'Tesis' && <TesisModal onClose={handleModalClose} alumnoData={alumnoData} />}
      {selectedDoc === 'Acta de Sustentación' && <ActaSustentacionModal onClose={handleModalClose} alumnoData={alumnoData} />}
      {selectedDoc === 'Certificado de Similitud' && <CertificadoSimilitud onClose={handleModalClose} alumnoData={alumnoData} />}
      {selectedDoc === 'Autorización para el depósito de obra en Cybertesis' && <AutoCyber onClose={handleModalClose} alumnoData={alumnoData} />}
      {selectedDoc === 'Hoja de Metadatos' && <Metadatos onClose={handleModalClose} alumnoData={alumnoData} />}
      {selectedDoc === 'Reporte de Turnitin' && <RepTurnitin onClose={handleModalClose} alumnoData={alumnoData} />}
    </Box>
  );
};

export default DocumentosRequeridos;
