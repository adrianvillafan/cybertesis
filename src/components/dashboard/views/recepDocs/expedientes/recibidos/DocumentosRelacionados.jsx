import React from 'react';
import { Container, Header, Table, Badge, Button, SpaceBetween, Box, Spinner } from '@cloudscape-design/components';

const DocumentosRelacionados = ({ documentos, selectedDocuments, setSelectedDocuments, handleVisualizar, isLoading }) => {
    const hayDocumentosPendientes = documentos.some(doc => doc.estado === null || doc.estado === 3);
    const hayDocumentosObservados = documentos.some(doc => doc.estado === 2);
    const todosRevisados = documentos.every(doc => doc.estado === 1);

    const botonPrincipalTexto = hayDocumentosObservados ? 'Enviar observación' : 'Enviar a Cybertesis';
    const botonPrincipalHabilitado = todosRevisados || (hayDocumentosObservados && !hayDocumentosPendientes);
    const botonPrincipalIcono = hayDocumentosObservados ? 'status-warning' : null;

    console.log('Documentos:', documentos);

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
            {isLoading ? (
                <SpaceBetween size="m" direction="vertical" alignItems="center">
                    <Spinner size="large" />
                    <Box>Cargando documentos relacionados...</Box>
                </SpaceBetween>
            ) : (
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
            )}
        </Container>
    );
};

export default DocumentosRelacionados;
