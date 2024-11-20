//src/components/dashboard/views/recepDocs/expedientes/recibidos/DocumentosRelacionados.jsx

import React from 'react';
import { Container, Header, Table, Badge, Button, SpaceBetween, Box } from '@cloudscape-design/components';
import solicitudService from '../../../../../../services/solicitudService'; // Importamos el servicio para manejar solicitudes

const DocumentosRelacionados = ({ documentos, selectedDocuments, setSelectedDocuments, handleVisualizar, solicitudId }) => {
    const hayDocumentosPendientes = documentos.some(doc => doc.estado === null || doc.estado === 3);
    const hayDocumentosObservados = documentos.some(doc => doc.estado === 2);
    const todosRevisados = documentos.every(doc => doc.estado === 1);

    const botonPrincipalTexto = hayDocumentosObservados ? 'Enviar observación' : 'Enviar a Cybertesis';
    const botonPrincipalHabilitado = todosRevisados || (hayDocumentosObservados && !hayDocumentosPendientes);
    const botonPrincipalIcono = hayDocumentosObservados ? 'status-warning' : null;

    // Nueva función para manejar el envío del expediente completo
    const handleEnviarExpediente = async () => {
        try {
            const nuevoEstado = hayDocumentosObservados ? 2 : 1; // 2: Observado, 1: Aprobado
            const result = await solicitudService.updateEstadoExpediente(solicitudId, nuevoEstado);
            console.log('Estado del expediente actualizado:', result);

            // Aquí podrías añadir lógica para notificar al usuario, actualizar la vista, etc.
            alert('Estado del expediente actualizado correctamente.');
        } catch (error) {
            console.error('Error al actualizar el estado del expediente:', error);
            alert('Hubo un error al actualizar el estado del expediente. Por favor, intenta nuevamente.');
        }
    };

    return (
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
                                onClick={handleEnviarExpediente} // Llamamos a la función al hacer click
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
                trackBy="idtable"
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
                        id: 'fechaModificacion',
                        header: 'Última Modificación',
                        cell: item => item.fechaModificacion ? new Date(item.fechaModificacion).toLocaleString() : 'N/A'
                    },
                    {
                        id: 'fechaRevision',
                        header: 'Fecha de Revisión',
                        cell: item => item.fechaRevision ? new Date(item.fechaRevision).toLocaleString() : 'Sin Revisar'
                    },
                    {
                        id: 'estado',
                        header: 'Estado',
                        cell: item => {
                            let badgeColor = 'blue';
                            let badgeText = 'Pendiente';

                            if (item.estado === 1) {
                                badgeColor = 'green';
                                badgeText = 'Revisado';
                            } else if (item.estado === 2) {
                                badgeColor = 'red';
                                badgeText = 'Observado';
                            }

                            return (
                                <Badge color={badgeColor}>
                                    {badgeText}
                                </Badge>
                            );
                        }
                    }
                ]}
                ariaLabels={{
                    allItemsSelectionLabel: () => 'Seleccionar todos los documentos',
                    itemSelectionLabel: (detail, item) => `Seleccionar ${item.nombre}`
                }}
                empty={<Box>No hay documentos relacionados</Box>}
            />
        </Container>
    );
};

export default DocumentosRelacionados;
