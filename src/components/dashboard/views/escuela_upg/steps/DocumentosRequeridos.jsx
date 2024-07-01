import React, { useState, useEffect } from 'react';
import { Box, Header, Button, Link, Table, SpaceBetween, StatusIndicator } from '@cloudscape-design/components';
import TesisModal from '../modals/TesisModal';
import TesisModalVer from '../modals/TesisModalVer';
import ActaSustentacionModal from '../modals/ActaSustentacionModal';
import ActaSustentacionModalVer from '../modals/ActaSustentacionModalVer';
import ActaSustentacionModalDelete from '../modals/ActaSustentacionModalDelete';
import CertificadoSimilitud from '../modals/CertificadoSimilitud';
import AutoCyber from '../modals/AutoCyber';
import MetadatosModal from '../modals/Metadatos';
import RepTurnitinModal from '../modals/RepTurnitin';
import TesisModalDelete from '../modals/TesisModalDelete';
import { createOrFetchDocumentos } from '../../../../../../api';

const DocumentosRequeridos = ({
  documentos,
  setDocumentos, // Agregar esta prop para actualizar documentos
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
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteDocType, setDeleteDocType] = useState(null);

  const fetchDocumentos = async () => {
    try {
      const updatedDocumentos = await createOrFetchDocumentos(alumnoData.grado_id, alumnoData.id, alumnoData.usuarioCarga_id);
      console.log('Documentos actualizados:', updatedDocumentos);
      setSavedDocuments({
        'Tesis': updatedDocumentos.tesis_id,
        'Acta de Sustentación': updatedDocumentos.actasust_id,
        'Certificado de Similitud': updatedDocumentos.certsimil_id,
        'Autorización para el depósito de obra en Cybertesis': updatedDocumentos.autocyber_id,
        'Hoja de Metadatos': updatedDocumentos.metadatos_id,
        'Reporte de Turnitin': updatedDocumentos.repturnitin_id
      });
      setDocumentos(updatedDocumentos); // Actualizar la variable documentos
    } catch (error) {
      console.error('Error al actualizar los documentos:', error);
    }
  };

  useEffect(() => {
    if (documentos) {
      setSavedDocuments({
        'Tesis': documentos.tesis_id,
        'Acta de Sustentación': documentos.actasust_id,
        'Certificado de Similitud': documentos.certsimil_id,
        'Autorización para el depósito de obra en Cybertesis': documentos.autocyber_id,
        'Hoja de Metadatos': documentos.metadatos_id,
        'Reporte de Turnitin': documentos.repturnitin_id
      });
    }
  }, [documentos]);

  const handleModalClose = async () => {
    setSelectedDoc(null);
    await fetchDocumentos(); // Actualiza los documentos después de cerrar el modal
  };

  const handleModalOpen = (docType, editing = false) => {
    setSelectedDoc({ type: docType, editing });
  };

  const handleSaveDocument = async (docType, data) => {
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
    await fetchDocumentos(); // Actualiza los documentos después de guardar
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
    const allDocumentsCompleted = documentosRequeridos.every(doc => savedDocuments[doc.nombre] && savedDocuments[doc.nombre] !== null);
    setCanProceed(allDocumentsCompleted);
  }, [savedDocuments, setCanProceed]);

  const handleDeleteDocument = async () => {
    try {
      await deleteTesis(savedDocuments[deleteDocType]);
      setSavedDocuments(prev => ({ ...prev, [deleteDocType]: null }));
      setShowDeleteConfirmation(false);
      await fetchDocumentos(); // Actualiza los documentos después de eliminar
    } catch (error) {
      setErrorMessage('Error al eliminar el documento: ' + error.message);
      setShowDeleteConfirmation(false);
    }
  };

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
              header: 'Acciones', 
              cell: (item) => savedDocuments[item.nombre] ? (
                <SpaceBetween direction="horizontal" size="xs">
                  <Button onClick={() => handleModalOpen(item.nombre, false)}>Ver</Button>
                  <Button onClick={() => { setDeleteDocType(item.nombre); setShowDeleteConfirmation(true); }}>Eliminar</Button>
                </SpaceBetween>
              ) : (
                <Button 
                  onClick={() => handleModalOpen(item.nombre, true)} 
                  disabled={item.nombre === 'Acta de Sustentación' && !tesisCompletada}
                >
                  Cargar
                </Button>
              ) 
            },
            { 
              id: 'estado', 
              header: 'Estado', 
              cell: (item) => savedDocuments[item.nombre] && savedDocuments[item.nombre] !== null ? (
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
        selectedDoc.editing ? (
          <TesisModal 
            onClose={handleModalClose}
            alumnoData={alumnoData}
            onSave={(data) => handleSaveDocument('Tesis', data)}
            readOnly={false}
            fileUrl={''}
            formData={{}}
            documentos_id={documentos}
          />
        ) : (
          <TesisModalVer
            onClose={handleModalClose}
            documentos={documentos}
          />
        )
      )}
      {selectedDoc?.type === 'Acta de Sustentación' && (
        selectedDoc.editing ? (
          <ActaSustentacionModal
            onClose={handleModalClose}
            asesores={asesores}
            onSave={(data) => handleSaveDocument('Acta de Sustentación', data)}
            readOnly={false}
            documentos={documentos}
          />
        ) : (
          <ActaSustentacionModalVer
            onClose={handleModalClose}
            documentos={documentos}
          />
        )
      )}
      {selectedDoc?.type === 'Certificado de Similitud' && (
        <CertificadoSimilitud
          onClose={handleModalClose}
          alumnoData={alumnoData}
          onSave={(data) => handleSaveDocument('Certificado de Similitud', data)}
          readOnly={!selectedDoc.editing}
          fileUrl={selectedDoc.editing ? '' : savedDocuments['Certificado de Similitud']?.file_url || ''}
          documentos={documentos}
        />
      )}
      {selectedDoc?.type === 'Autorización para el depósito de obra en Cybertesis' && (
        <AutoCyber
          onClose={handleModalClose}
          alumnoData={alumnoData}
          onSave={(data) => handleSaveDocument('Autorización para el depósito de obra en Cybertesis', data)}
          readOnly={!selectedDoc.editing}
          fileUrl={selectedDoc.editing ? '' : savedDocuments['Autorización para el depósito de obra en Cybertesis']?.file_url || ''}
          documentos={documentos}
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
          documentos={documentos}
        />
      )}
      {selectedDoc?.type === 'Reporte de Turnitin' && (
        <RepTurnitinModal
          onClose={handleModalClose}
          onSave={(data) => handleSaveDocument('Reporte de Turnitin', data)}
          readOnly={!selectedDoc.editing}
          fileUrl={selectedDoc.editing ? '' : savedDocuments['Reporte de Turnitin']?.file_url || ''}
          documentos={documentos}
        />
      )}
      {showDeleteConfirmation && (
        <TesisModalDelete
          visible={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={handleDeleteDocument}
          documentos={documentos}
        />
      )}
      {showDeleteConfirmation && deleteDocType === 'Acta de Sustentación' && (
        <ActaSustentacionModalDelete
          visible={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={handleDeleteDocument}
          documentos={documentos}
        />
      )}
    </Box>
  );
};

export default DocumentosRequeridos;
