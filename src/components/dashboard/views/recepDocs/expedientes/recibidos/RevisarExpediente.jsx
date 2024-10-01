import React, { useState, useEffect } from 'react';
import { Container, Header, Box, Button, SpaceBetween, ColumnLayout, Table, Badge } from '@cloudscape-design/components';
import { fetchExpedienteDetails, fetchDocumentosRelacionados } from '../../../../../../../api'; // Importamos las funciones de la API
import ModalOneDoc from './visores/ModalOneDoc';
import ModalTwoDocs from './visores/ModalTwoDocs';
import ModalThreeDocs from './visores/ModalThreeDocs';

const RevisarExpediente = ({ solicitudId, expedienteId, onBack }) => {
    // Estado para los detalles del expediente y documentos relacionados
    const [expediente, setExpediente] = useState(null);
    const [documentos, setDocumentos] = useState([]);
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // useEffect para obtener los detalles del expediente al cargar el componente
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

    // useEffect para obtener los documentos relacionados al cargar el componente
    useEffect(() => {
        const obtenerDocumentosRelacionados = async () => {
            try {
                const docs = await fetchDocumentosRelacionados(solicitudId, expedienteId);
                // Transformar los documentos para adecuar el formato
                const documentosFormateados = [
                    { id: docs.tesis_id, nombre: 'Tesis', estado: docs.tesis_estado, fechaCarga: docs.fecha_tesis },
                    { id: docs.actasust_id, nombre: 'Acta de Sustentación', estado: docs.acta_estado, fechaCarga: docs.fecha_actasust },
                    { id: docs.certsimil_id, nombre: 'Certificado de Similitud', estado: docs.certificado_estado, fechaCarga: docs.fecha_certsimil },
                    { id: docs.autocyber_id, nombre: 'Autorización Cybertesis', estado: docs.auto_estado, fechaCarga: docs.fecha_autocyber },
                    { id: docs.metadatos_id, nombre: 'Metadatos Complementarios', estado: docs.metadatos_estado, fechaCarga: docs.fecha_metadatos },
                    { id: docs.repturnitin_id, nombre: 'Reporte de Turnitin', estado: docs.turnitin_estado, fechaCarga: docs.fecha_repturnitin },
                    { id: docs.consentimiento_id, nombre: 'Consentimiento Informado', estado: docs.consentimiento_estado, fechaCarga: docs.fecha_consentimiento },
                    { id: docs.postergacion_id, nombre: 'Postergación de Publicación', estado: docs.postergacion_estado, fechaCarga: docs.fecha_postergacion }
                ].filter(doc => doc.id); // Filtrar los documentos que no tengan ID
                setDocumentos(documentosFormateados);
            } catch (error) {
                console.error('Error al obtener los documentos relacionados:', error);
            }
        };

        obtenerDocumentosRelacionados();
    }, [solicitudId, expedienteId]);

    // Funciones para determinar el estado de los documentos
    const hayDocumentosPendientes = documentos.some(doc => doc.estado === 'Pendiente');
    const hayDocumentosObservados = documentos.some(doc => doc.estado === 'Observado');
    const todosRevisados = documentos.every(doc => doc.estado === 'Revisado');

    // Cambiar el texto del botón dependiendo del estado de los documentos
    const botonPrincipalTexto = hayDocumentosObservados ? 'Enviar observación' : 'Enviar a Cybertesis';
    const botonPrincipalHabilitado = todosRevisados || (hayDocumentosObservados && !hayDocumentosPendientes);
    const botonPrincipalIcono = hayDocumentosObservados ? 'status-warning' : null;

    // Funciones de Visualizar según el número de documentos seleccionados
    const handleVisualizar = () => {
        setShowModal(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setShowModal(false);
    };

    if (!expediente) {
        return <Box>Cargando detalles del expediente...</Box>;
    }

    return (
        <SpaceBetween size="l">

            <Container
                header={
                    <Header
                        variant="h2"
                        description={`Detalles del Expediente ID: ${expedienteId}`}
                        actions={<Button onClick={onBack}>Volver</Button>}
                    >
                        Revisar Expediente
                    </Header>
                }
            >
                <SpaceBetween size="m">
                    <ColumnLayout columns={2} variant="text-grid">
                        <Box><strong>Nombre del Estudiante:</strong><Box>{expediente.nombre_completo}</Box></Box>
                        <Box><strong>DNI:</strong><Box>{expediente.dni}</Box></Box>
                        <Box><strong>Facultad:</strong><Box>{expediente.facultad}</Box></Box>
                        <Box><strong>Grado:</strong><Box>{expediente.grado}</Box></Box>
                        <Box><strong>Programa:</strong><Box>{expediente.programa}</Box></Box>
                        <Box><strong>Título de Tesis:</strong><Box>{expediente.titulo_tesis}</Box></Box>
                        <Box><strong>Asesor(es):</strong><Box>{expediente.asesor1}{expediente.asesor2 ? `, ${expediente.asesor2}` : ''}</Box></Box>
                        <Box><strong>Estado del Expediente:</strong><Box>{expediente.estado}</Box></Box>
                        <Box><strong>Fecha de Recepción:</strong><Box>{new Date(expediente.fecha_carga).toLocaleDateString()}</Box></Box>
                    </ColumnLayout>
                </SpaceBetween>
            </Container>

            {/* Contenedor para la tabla de documentos */}
            <Container
                header={
                    <Header
                        variant="h2"
                        counter={`(${selectedDocuments.length}/${documentos.length})`}
                        actions={
                            <SpaceBetween direction="horizontal" size="xs">
                                <Button
                                    disabled={selectedDocuments.length === 0 || selectedDocuments.length > 3}
                                    onClick={handleVisualizar}
                                >
                                    Visualizar
                                </Button>
                                <Button
                                    disabled={selectedDocuments.length === 0}
                                >
                                    Descargar
                                </Button>
                                <Button
                                    variant="primary"
                                    disabled={!botonPrincipalHabilitado}
                                    iconAlign="right"
                                    iconName={botonPrincipalIcono}
                                >
                                    {botonPrincipalTexto}
                                </Button>
                            </SpaceBetween>
                        }
                    >
                        Documentos Relacionados
                    </Header>
                }
            >
                <Table
                    selectionType="multi"
                    trackBy="id"
                    selectedItems={selectedDocuments}
                    onSelectionChange={({ detail }) => setSelectedDocuments(detail.selectedItems)}
                    items={documentos}
                    variant="embedded"
                    columnDefinitions={[
                        {
                            id: 'nombre',
                            header: 'Nombre del Documento',
                            cell: item => item.nombre,
                        },
                        {
                            id: 'fechaCarga',
                            header: 'Fecha de Carga',
                            cell: item => new Date(item.fechaCarga).toLocaleDateString(),
                        },
                        {
                            id: 'estado',
                            header: 'Estado',
                            cell: item => (
                                <Badge color={item.estado === 'Revisado' ? 'green' : item.estado === 'Pendiente' ? 'blue' : 'red'}>
                                    {item.estado}
                                </Badge>
                            )
                        }
                    ]}
                    ariaLabels={{
                        allItemsSelectionLabel: () => 'Seleccionar todos los documentos',
                        itemSelectionLabel: (detail, item) => `Seleccionar ${item.nombre}`,
                    }}
                    empty={<Box>No hay documentos relacionados</Box>}
                />
            </Container>

            {/* Modales para la visualización de documentos */}
            {showModal && selectedDocuments.length === 1 && (
                <ModalOneDoc
                    onClose={closeModal}
                    fileUrl={selectedDocuments[0].fileUrl}
                    headerText="Visualización de Documento"
                />
            )}

            {showModal && selectedDocuments.length === 2 && (
                <ModalTwoDocs
                    onClose={closeModal}
                    fileUrls={[selectedDocuments[0].fileUrl, selectedDocuments[1].fileUrl]}
                    headerText="Visualización de Dos Documentos"
                />
            )}

            {showModal && selectedDocuments.length === 3 && (
                <ModalThreeDocs
                    onClose={closeModal}
                    fileUrls={[selectedDocuments[0].fileUrl, selectedDocuments[1].fileUrl, selectedDocuments[2].fileUrl]}
                    headerText="Visualización de Tres Documentos"
                />
            )}
        </SpaceBetween>
    );
};

export default RevisarExpediente;
