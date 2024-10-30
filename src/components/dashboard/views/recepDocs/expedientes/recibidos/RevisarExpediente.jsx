import React, { useState, useEffect } from 'react';
import { Box, SpaceBetween, Spinner, Container } from '@cloudscape-design/components';
import { fetchExpedienteDetails, fetchDocumentosRelacionados } from '../../../../../../../api'; // Importamos las funciones de la API
import DetallesExpediente from './DetallesExpediente';
import DocumentosRelacionados from './DocumentosRelacionados';
import ModalOneDoc from './visores/ModalOneDoc';
import ModalTwoDocs from './visores/ModalTwoDocs';
import ModalThreeDocs from './visores/ModalThreeDocs';

const RevisarExpediente = ({ solicitudId, expedienteId, onBack }) => {
    const [expediente, setExpediente] = useState(null);
    const [documentos, setDocumentos] = useState([]);
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // useEffect para obtener los detalles del expediente
    useEffect(() => {
        const obtenerDetallesExpediente = async () => {
            try {
                const detalles = await fetchExpedienteDetails(solicitudId, expedienteId);
                setExpediente(detalles);
            } catch (error) {
                console.error('Error al obtener los detalles del expediente:', error);
            }
        };

        obtenerDetallesExpediente();
    }, [solicitudId, expedienteId]);

    // useEffect para obtener los documentos relacionados
    useEffect(() => {
        const obtenerDocumentosRelacionados = async () => {
            try {
                const docs = await fetchDocumentosRelacionados(solicitudId, expedienteId);

                if (docs.length > 0) {
                    const doc = docs[0];

                    const documentosFormateados = [
                        {
                            id: doc.tesis_id,
                            idtable: 1,
                            nombre: 'Tesis',
                            estado: doc.tesis_estado,
                            fechaRevision: doc.tesis_fecha_revision,
                            fechaModificacion: doc.tesis_fecha_modificacion
                        },
                        {
                            id: doc.actasust_id,
                            idtable: 2,
                            nombre: 'Acta de Sustentación',
                            estado: doc.acta_estado,
                            fechaRevision: doc.acta_fecha_revision,
                            fechaModificacion: doc.actasust_fecha_modificacion
                        },
                        {
                            id: doc.certsimil_id,
                            idtable: 3,
                            nombre: 'Certificado de Similitud',
                            estado: doc.certificado_estado,
                            fechaRevision: doc.certificado_fecha_revision,
                            fechaModificacion: doc.certsimil_fecha_modificacion
                        },
                        {
                            id: doc.autocyber_id,
                            idtable: 4,
                            nombre: 'Autorización Cybertesis',
                            estado: doc.auto_estado,
                            fechaRevision: doc.auto_fecha_revision,
                            fechaModificacion: doc.autocyber_fecha_modificacion
                        },
                        {
                            id: doc.metadatos_id,
                            idtable: 5,
                            nombre: 'Metadatos Complementarios',
                            estado: doc.metadatos_estado,
                            fechaRevision: doc.metadatos_fecha_revision,
                            fechaModificacion: doc.metadatos_fecha_modificacion
                        },
                        {
                            id: doc.repturnitin_id,
                            idtable: 6,
                            nombre: 'Reporte de Turnitin',
                            estado: doc.turnitin_estado,
                            fechaRevision: doc.turnitin_fecha_revision,
                            fechaModificacion: doc.repturnitin_fecha_modificacion
                        },
                        {
                            id: doc.consentimiento_id,
                            idtable: 7,
                            nombre: 'Consentimiento Informado',
                            estado: doc.consentimiento_estado,
                            fechaRevision: doc.consentimiento_fecha_revision,
                            fechaModificacion: doc.consentimiento_fecha_modificacion
                        },
                        {
                            id: doc.postergacion_id,
                            idtable: 8,
                            nombre: 'Postergación de Publicación',
                            estado: doc.postergacion_estado,
                            fechaRevision: doc.postergacion_fecha_revision,
                            fechaModificacion: doc.postergacion_fecha_modificacion
                        }
                    ].filter(doc => doc.id !== null); // Filtrar los documentos que no tengan ID

                    setDocumentos(documentosFormateados);
                }
            } catch (error) {
                console.error('Error al obtener los documentos relacionados:', error);
            } finally {
                setIsLoading(false); // Asegurarse de que el spinner desaparezca
            }
        };

        obtenerDocumentosRelacionados();
    }, [solicitudId, expedienteId]);

    // Manejo de visualización de documentos
    const handleVisualizar = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    if (isLoading) {
        return (
            <Container>
                <Box textAlign="center" margin={{ vertical: "l" }}>
                    <Spinner size="large" />
                    <Box variant="p">Cargando información...</Box>
                </Box>
            </Container>
        );
    }

    if (!expediente) {
        return <Box>Cargando detalles del expediente...</Box>;
    }

    return (
        <SpaceBetween size="l">
            <DetallesExpediente expediente={expediente} onBack={onBack} />
            <DocumentosRelacionados
                documentos={documentos}
                selectedDocuments={selectedDocuments}
                setSelectedDocuments={setSelectedDocuments}
                handleVisualizar={handleVisualizar}
            />

            {/* Modales para la visualización de documentos */}
            {showModal && selectedDocuments.length === 1 && (
                <ModalOneDoc
                    onClose={closeModal}
                    documento={selectedDocuments[0]}
                    solicitudId={solicitudId}
                    headerText="Visualización de Documento"
                />
            )}

            {showModal && selectedDocuments.length === 2 && (
                <ModalTwoDocs
                    onClose={closeModal}
                    documentos={[selectedDocuments[0], selectedDocuments[1]]}
                    solicitudId={solicitudId}
                    headerText="Visualización de Dos Documentos"
                />
            )}

            {showModal && selectedDocuments.length === 3 && (
                <ModalThreeDocs
                    onClose={closeModal}
                    documentos={[selectedDocuments[0], selectedDocuments[1], selectedDocuments[2]]}
                    solicitudId={solicitudId}
                    headerText="Visualización de Tres Documentos"
                />
            )}
        </SpaceBetween>
    );
};

export default RevisarExpediente;
