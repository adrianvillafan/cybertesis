import React, { useState } from 'react';
import { Container, Header, Box, Button, SpaceBetween, ColumnLayout, Table, Badge } from '@cloudscape-design/components';

const RevisarExpediente = ({ expedienteId, onBack }) => {
    // Estado para seleccionar documentos
    const [selectedDocuments, setSelectedDocuments] = useState([]);

    // Datos estáticos para simular la información del expediente
    const expediente = {
        id: expedienteId,
        nombre: 'Juan Pérez',
        facultad: 'Ingeniería',
        grado: 'Pregrado',
        programa: 'Ingeniería de Sistemas',
        tipoTrabajo: 'Tesis',
        estado: 'Recibido',
        dni: '12345678',
        fecha: '2024-09-15'
    };

    // Datos de los documentos con estados simulados
    const documentos = [
        { id: 1, nombre: 'Tesis', display: 'Registro de Tesis', lastWritten: 'Tue Feb 27 15:45:49 GMT-800 2024', size: '116.9 kB', estado: 'Revisado' },
        { id: 2, nombre: 'Acta de Sustentación', display: 'Registro de Acta de Sustentación', lastWritten: 'Tue Feb 27 14:00:24 GMT-800 2024', size: '2.2 MB', estado: 'Pendiente' },
        { id: 3, nombre: 'Certificado de Similitud', display: 'Registro de Certificado de Similitud', lastWritten: 'Sun Feb 25 06:09:38 GMT-800 2024', size: '417.5 kB', estado: 'Observado' },
        { id: 4, nombre: 'Autorización para el depósito de obra en Cybertesis', display: 'Autorización para el depósito de obra en Cybertesis', lastWritten: 'Sat Feb 24 06:08:39 GMT-800 2024', size: '863.9 kB', estado: 'Revisado' },
        { id: 5, nombre: 'Hoja de Metadatos', display: 'Registro de Metadatos Complementarios', lastWritten: 'Thu Feb 01 15:55:20 GMT-800 2024', size: '80.7 kB', estado: 'Revisado' },
        { id: 6, nombre: 'Reporte de Turnitin', display: 'Registro de Reporte de Turnitin', lastWritten: 'Mon Mar 1 10:30:20 GMT-800 2024', size: '512.0 kB', estado: 'Revisado' },
        { id: 7, nombre: 'Consentimiento Informado', display: 'Registro de Consentimiento Informado', lastWritten: 'Tue Mar 2 12:45:35 GMT-800 2024', size: '1.1 MB', estado: 'Revisado' },
        { id: 8, nombre: 'Postergación de Publicación', display: 'Solicitud de Postergación en Cybertesis', lastWritten: 'Wed Mar 3 14:15:49 GMT-800 2024', size: '204.9 kB', estado: 'Pendiente' }
    ];

    // Funciones para determinar el estado de los documentos
    const hayDocumentosPendientes = documentos.some(doc => doc.estado === 'Pendiente');
    const hayDocumentosObservados = documentos.some(doc => doc.estado === 'Observado');
    const todosRevisados = documentos.every(doc => doc.estado === 'Revisado');

    // Cambiar el texto del botón dependiendo del estado de los documentos
    const botonPrincipalTexto = hayDocumentosObservados  ? 'Enviar observación' : 'Enviar a Cybertesis';
    const botonPrincipalHabilitado = todosRevisados || (hayDocumentosObservados && !hayDocumentosPendientes);
    const botonPrincipalIcono = hayDocumentosObservados ? 'status-warning' : null;

    // Funciones de Visualizar según el número de documentos seleccionados
    const handleVisualizar = () => {
        if (selectedDocuments.length === 1) {
            // Llamar a función específica para 1 documento
            console.log("Visualizando 1 documento");
        } else if (selectedDocuments.length === 2) {
            // Llamar a función específica para 2 documentos
            console.log("Visualizando 2 documentos");
        } else if (selectedDocuments.length === 3) {
            // Llamar a función específica para 3 documentos
            console.log("Visualizando 3 documentos");
        }
    };

    return (
        <SpaceBetween size="l" >

            <Container
                header={
                    <Header
                        variant="h2"
                        description={`Detalles del Expediente ID: ${expediente.id}`}
                        actions={<Button onClick={onBack}>Volver</Button>}
                    >
                        Revisar Expediente
                    </Header>
                }
            >
                <SpaceBetween size="m">
                    <ColumnLayout columns={2} variant="text-grid">
                        <Box><strong>Nombre del Estudiante:</strong><Box>{expediente.nombre}</Box></Box>
                        <Box><strong>DNI:</strong><Box>{expediente.dni}</Box></Box>
                        <Box><strong>Facultad:</strong><Box>{expediente.facultad}</Box></Box>
                        <Box><strong>Grado:</strong><Box>{expediente.grado}</Box></Box>
                        <Box><strong>Programa:</strong><Box>{expediente.programa}</Box></Box>
                        <Box><strong>Tipo de Trabajo:</strong><Box>{expediente.tipoTrabajo}</Box></Box>
                        <Box><strong>Estado del Expediente:</strong><Box>{expediente.estado}</Box></Box>
                        <Box><strong>Fecha de Recepción:</strong><Box>{expediente.fecha}</Box></Box>
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
                                {/* Los botones estarán deshabilitados si no hay documentos seleccionados */}
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
                            id: 'lastWritten',
                            header: 'Última Modificación',
                            cell: item => item.lastWritten,
                        },
                        {
                            id: 'size',
                            header: 'Tamaño',
                            cell: item => item.size,
                            align: 'right'
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

        </SpaceBetween>
    );
};

export default RevisarExpediente;
