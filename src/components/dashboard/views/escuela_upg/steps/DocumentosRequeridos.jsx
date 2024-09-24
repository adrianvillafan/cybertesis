import React, { useState, useEffect } from 'react';
import { Box, Header, Button, Link, Table, SpaceBetween, StatusIndicator } from '@cloudscape-design/components';
import TesisModal from '../modals/TesisModal';
import TesisModalVer from '../modals/TesisModalVer';
import ActaSustentacionModal from '../modals/ActaSustentacionModal';
import ActaSustentacionModalVer from '../modals/ActaSustentacionModalVer';
import ActaSustentacionModalDelete from '../modals/ActaSustentacionModalDelete';
import CertificadoSimilitud from '../modals/CertificadoSimilitud';
import CertificadoSimilitudVer from '../modals/CertificadoSimilitudVer';
import CertificadoSimilitudDelete from '../modals/CertificadoSimilitudDelete';
import AutoCyber from '../modals/AutoCyber';
import AutoCyberVer from '../modals/AutoCyberVer';
import AutoCyberDelete from '../modals/AutoCyberDelete';
import MetadatosModal from '../modals/Metadatos';
import MetadatosModalVer from '../modals/MetadatosVer';
import MetadatosModalDelete from '../modals/MetadatosDelete';
import RepTurnitinModal from '../modals/RepTurnitin';
import RepTurnitinModalVer from '../modals/RepTurnitinModalVer';
import RepTurnitinModalDelete from '../modals/RepTurnitinModalDelete';
import TesisModalDelete from '../modals/TesisModalDelete';
import ConsentimientoInformado from '../modals/ConsentimientoInformadoModal';  // Nuevos modales
import ConsentimientoInformadoVer from '../modals/ConsentimientoInformadoVer';
import ConsentimientoInformadoDelete from '../modals/ConsentimientoInformadoDelete';
import PostergacionPublicacion from '../modals/PostergacionPublicacionModal';
import PostergacionPublicacionVer from '../modals/PostergacionPublicacionVer';
import PostergacionPublicacionDelete from '../modals/PostergacionPublicacionDelete';
import { createOrFetchDocumentos } from '../../../../../../api';

const DocumentosRequeridos = ({
  documentos,
  setDocumentos,
  handleNextStep,
  setErrorMessage,
  alumnoData,
  setStep,
  user
}) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [savedDocuments, setSavedDocuments] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteDocType, setDeleteDocType] = useState(null);
  const [canProceed, setCanProceed] = useState(false);

  const fetchDocumentos = async () => {
    try {
      const updatedDocumentos = await createOrFetchDocumentos(alumnoData.grado_id, alumnoData.id, alumnoData.usuarioCarga_id);
      console.log('Documentos actualizados:', updatedDocumentos);
      const documents = {
        'Tesis': updatedDocumentos.tesis_id,
        'Acta de Sustentación': updatedDocumentos.actasust_id,
        'Certificado de Similitud': updatedDocumentos.certsimil_id,
        'Autorización para el depósito de obra en Cybertesis': updatedDocumentos.autocyber_id,
        'Hoja de Metadatos': updatedDocumentos.metadatos_id,
        'Reporte de Turnitin': updatedDocumentos.repturnitin_id,
        'Consentimiento Informado': updatedDocumentos.consentimiento_id,  // Nuevo documento
        'Postergación de Publicación': updatedDocumentos.postergacion_id  // Nuevo documento
      };
      setSavedDocuments(documents);
      setDocumentos(updatedDocumentos);
      checkIfCanProceed(documents);
    } catch (error) {
      console.error('Error al actualizar los documentos:', error);
    }
  };

  useEffect(() => {
    if (documentos) {
      const documents = {
        'Tesis': documentos.tesis_id,
        'Acta de Sustentación': documentos.actasust_id,
        'Certificado de Similitud': documentos.certsimil_id,
        'Autorización para el depósito de obra en Cybertesis': documentos.autocyber_id,
        'Hoja de Metadatos': documentos.metadatos_id,
        'Reporte de Turnitin': documentos.repturnitin_id,
        'Consentimiento Informado': documentos.consentimiento_id,  // Nuevo documento
        'Postergación de Publicación': documentos.postergacion_id  // Nuevo documento
      };
      setSavedDocuments(documents);
      checkIfCanProceed(documents);
    }
  }, [documentos]);

  const checkIfCanProceed = (documents) => {
    const allDocumentsCompleted = Object.values(documents).every(id => id !== null || documents['Postergación de Publicación']) !== null; //Arreglar logica 
    console.log('allDocumentsCompleted:', allDocumentsCompleted);
    setCanProceed(allDocumentsCompleted);
    console.log('Can proceed:', allDocumentsCompleted);
  };

  const handleModalClose = async () => {
    setSelectedDoc(null);
    await fetchDocumentos();
  };

  const handleModalOpen = (docType, editing = false) => {
    setSelectedDoc({ type: docType, editing });
  };

  const handleSaveDocument = async (docType, data) => {
    console.log(`Datos guardados del modal (${docType}):`, data);
    await fetchDocumentos();
  };

  const handleDeleteDocument = async () => {
    console.log('Eliminando documento:', deleteDocType);
    setSavedDocuments(prev => {
      const updated = { ...prev, [deleteDocType]: null };
      checkIfCanProceed(updated);
      return updated;
    });
    setSelectedDoc(null);
    await fetchDocumentos();
  };

  const documentosRequeridos = [
    { id: 1, nombre: 'Tesis' , display: 'Registro de Tesis' },
    { id: 2, nombre: 'Acta de Sustentación' , display: 'Registro de Acta de Sustentación' },
    { id: 3, nombre: 'Certificado de Similitud' , display: 'Registro de Certificado de Similitud' },
    { id: 4, nombre: 'Autorización para el depósito de obra en Cybertesis' , display: 'Autorización para el depósito de obra en Cybertesis' },
    { id: 5, nombre: 'Hoja de Metadatos' , display: 'Registro de Metadatos Complementarios' },
    { id: 6, nombre: 'Reporte de Turnitin' , display: 'Registro de Reporte de Turnitin'},
    { id: 7, nombre: 'Consentimiento Informado' , display: 'Registro de Consentimiento Informado' },  // Nuevo documento
    { id: 8, nombre: 'Postergación de Publicación' , display: 'Solicitud de Postergación en Cybertesis' }  // Nuevo documento con especificación de opcional
  ];

  const isTesisComplete = !!savedDocuments['Tesis'];
  const isActaSustentacionComplete = !!savedDocuments['Acta de Sustentación'];

  return (
    <Box>
      <SpaceBetween direction="vertical" size="l">
        <Header variant="h2"> <u>Paso 2</u>: Adjuntar Documentos</Header>
        <Table
          items={documentosRequeridos}
          columnDefinitions={[
            { id: 'id', header: 'ID', cell: (item) => item.id },
            { id: 'tipoDocumento', header: 'Tipo de Documento', cell: (item) => item.display },
            { id: 'verModelo', header: 'Modelo', cell: (item) => <Link href={`/path/to/model/${item.nombre}.pdf`} external={true}>Ver modelo</Link> },
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
                  disabled={
                    (item.nombre === 'Acta de Sustentación' && !isTesisComplete) ||
                    (item.nombre === 'Hoja de Metadatos' && (!isTesisComplete || !isActaSustentacionComplete))
                  }
                >
                  Adjuntar
                </Button>
              )
            },
            {
              id: 'estado',
              header: 'Estado',
              cell: (item) => savedDocuments[item.nombre] && savedDocuments[item.nombre] !== null ? (
                <StatusIndicator type="success">Registrado</StatusIndicator>
              ) : (
                <StatusIndicator type="error">Pendiente</StatusIndicator>
              )
            },
          ]}
        />
      </SpaceBetween>
      <Box margin={{ top: 'l' }}>
        <SpaceBetween direction="vertical" size="xs">
        <Box> * El documento de Postergacion de Publicacion es <b>opcional</b> </Box>
        <SpaceBetween direction="horizontal" size="xs">
          <Button onClick={() => setStep(1)}>Atrás</Button>
          <Button variant="primary" onClick={handleNextStep} disabled={!canProceed}>Siguiente</Button>
        </SpaceBetween>
        </SpaceBetween>
      </Box>

      {/* Modales para cada documento */}
      {selectedDoc?.type === 'Tesis' && (
        selectedDoc.editing ? (
          <TesisModal
            user={user}
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
            user={user}
            onClose={handleModalClose}
            onSave={(data) => handleSaveDocument('Acta de Sustentación', data)}
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
        selectedDoc.editing ? (
          <CertificadoSimilitud
            user={user}
            onClose={handleModalClose}
            onSave={(data) => handleSaveDocument('Certificado de Similitud', data)}
            readOnly={false}
            fileUrl={savedDocuments['Certificado de Similitud']?.file_url || ''}
            documentos={documentos}
          />
        ) : (
          <CertificadoSimilitudVer
            onClose={handleModalClose}
            documentos={documentos}
          />
        )
      )}
      {selectedDoc?.type === 'Autorización para el depósito de obra en Cybertesis' && (
        selectedDoc.editing ? (
          <AutoCyber
            user={user}
            onClose={handleModalClose}
            onSave={(data) => handleSaveDocument('Autorización para el depósito de obra en Cybertesis', data)}
            readOnly={false}
            fileUrl={savedDocuments['Autorización para el depósito de obra en Cybertesis']?.file_url || ''}
            documentos={documentos}
          />
        ) : (
          <AutoCyberVer
            onClose={handleModalClose}
            documentos={documentos}
          />
        )
      )}
      {selectedDoc?.type === 'Hoja de Metadatos' && (
        selectedDoc.editing ? (
          <MetadatosModal
            user={user}
            onClose={handleModalClose}
            onSave={(data) => handleSaveDocument('Hoja de Metadatos', data)}
            readOnly={false}
            fileUrl={''}
            formData={{}}
            documentos={documentos}
          />
        ) : (
          <MetadatosModalVer
            onClose={handleModalClose}
            documentos={documentos}
          />
        )
      )}
      {selectedDoc?.type === 'Reporte de Turnitin' && (
        selectedDoc.editing ? (
          <RepTurnitinModal
            user={user}
            onClose={handleModalClose}
            onSave={(data) => handleSaveDocument('Reporte de Turnitin', data)}
            readOnly={false}
            fileUrl={savedDocuments['Reporte de Turnitin']?.file_url || ''}
            documentos={documentos}
          />
        ) : (
          <RepTurnitinModalVer
            onClose={handleModalClose}
            documentos={documentos}
          />
        )
      )}
      {selectedDoc?.type === 'Consentimiento Informado' && (
        selectedDoc.editing ? (
          <ConsentimientoInformado
            user={user}
            onClose={handleModalClose}
            onSave={(data) => handleSaveDocument('Consentimiento Informado', data)}
            readOnly={false}
            fileUrl={savedDocuments['Consentimiento Informado']?.file_url || ''}
            documentos={documentos}
          />
        ) : (
          <ConsentimientoInformadoVer
            onClose={handleModalClose}
            documentos={documentos}
          />
        )
      )}
      {selectedDoc?.type === 'Postergación de Publicación' && (
        selectedDoc.editing ? (
          <PostergacionPublicacion
            user={user}
            onClose={handleModalClose}
            onSave={(data) => handleSaveDocument('Postergación de Publicación', data)}
            readOnly={false}
            fileUrl={savedDocuments['Postergación de Publicación']?.file_url || ''}
            documentos={documentos}
          />
        ) : (
          <PostergacionPublicacionVer
            onClose={handleModalClose}
            documentos={documentos}
          />
        )
      )}
      {showDeleteConfirmation && deleteDocType === 'Tesis' && (
        <TesisModalDelete
          user={user}
          visible={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={handleDeleteDocument}
          documentos={documentos}
        />
      )}
      {showDeleteConfirmation && deleteDocType === 'Acta de Sustentación' && (
        <ActaSustentacionModalDelete
          user={user}
          visible={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={handleDeleteDocument}
          documentos={documentos}
        />
      )}
      {showDeleteConfirmation && deleteDocType === 'Certificado de Similitud' && (
        <CertificadoSimilitudDelete
          user={user}
          visible={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={handleDeleteDocument}
          documentos={documentos}
        />
      )}
      {showDeleteConfirmation && deleteDocType === 'Autorización para el depósito de obra en Cybertesis' && (
        <AutoCyberDelete
          user={user}
          visible={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={handleDeleteDocument}
          documentos={documentos}
        />
      )}
      {showDeleteConfirmation && deleteDocType === 'Hoja de Metadatos' && (
        <MetadatosModalDelete
          user={user}
          visible={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={handleDeleteDocument}
          documentos={documentos}
        />
      )}
      {showDeleteConfirmation && deleteDocType === 'Reporte de Turnitin' && (
        <RepTurnitinModalDelete
          user={user}
          visible={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={handleDeleteDocument}
          documentos={documentos}
        />
      )}
      {showDeleteConfirmation && deleteDocType === 'Consentimiento Informado' && (
        <ConsentimientoInformadoDelete
          user={user}
          visible={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={handleDeleteDocument}
          documentos={documentos}
        />
      )}
      {showDeleteConfirmation && deleteDocType === 'Postergación de Publicación' && (
        <PostergacionPublicacionDelete
          user={user}
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
