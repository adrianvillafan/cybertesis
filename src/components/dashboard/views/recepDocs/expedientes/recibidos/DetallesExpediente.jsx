import React from 'react';
import { Container, Header, Box, ColumnLayout, Button, Spinner, SpaceBetween } from '@cloudscape-design/components';

const DetallesExpediente = ({ expediente, onBack, isLoading }) => {
    const formatPrograma = (programa) => {
        return programa.charAt(0).toUpperCase() + programa.slice(1).toLowerCase();
    };

    return (
        <Container
            header={
                <Header
                    variant="h2"
                    description={`Detalles del Expediente ID: ${expediente?.expedienteid ?? ''}`}
                    actions={<Button onClick={onBack}>Volver</Button>}
                >
                    Revisar Expediente
                </Header>
            }
        >
            {isLoading ? (
                <SpaceBetween size="m" direction="vertical" alignItems="center">
                    <Spinner size="large" />
                    <Box>Cargando detalles del expediente...</Box>
                </SpaceBetween>
            ) : (
                <ColumnLayout columns={2} variant="text-grid">
                    <Box><strong>Nombre del Estudiante:</strong><Box>{expediente.nombre_completo}</Box></Box>
                    <Box><strong>DNI:</strong><Box>{expediente.dni}</Box></Box>
                    <Box><strong>Facultad:</strong><Box>{expediente.facultad}</Box></Box>
                    <Box><strong>Grado:</strong><Box>{expediente.grado}</Box></Box>
                    <Box><strong>Programa:</strong><Box>{formatPrograma(expediente.programa)}</Box></Box>
                    <Box><strong>Título de Tesis:</strong><Box>{expediente.titulo_tesis}</Box></Box>
                    <Box><strong>Asesor(es):</strong><Box>{expediente.asesor1}{expediente.asesor2 ? `, ${expediente.asesor2}` : ''}</Box></Box>
                    <Box><strong>Estado del Expediente:</strong><Box>{expediente.estado}</Box></Box>
                    <Box><strong>Fecha de Recepción:</strong><Box>{new Date(expediente.fecha_carga).toLocaleDateString()}</Box></Box>
                </ColumnLayout>
            )}
        </Container>
    );
};

export default DetallesExpediente;
