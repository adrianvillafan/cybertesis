import React, { useState, useEffect } from 'react';
import { Box, Header, Button, Table, SpaceBetween, StatusIndicator, Select, FormField, Container } from '@cloudscape-design/components';

const CreateRequest = () => {
  const [expedientes, setExpedientes] = useState([]);
  const [selectedExpediente, setSelectedExpediente] = useState(null);
  const [documentos, setDocumentos] = useState([]);

  // Datos inventados para expedientes y documentos
  const expedientesMock = [
    { label: 'Expediente 001', value: 'exp001' },
    { label: 'Expediente 002', value: 'exp002' },
    { label: 'Expediente 003', value: 'exp003' },
  ];

  const documentosMock = [
    { id: 1, nombre: 'Tesis', estado: 'Registrado' },
    { id: 2, nombre: 'Acta de Sustentación', estado: 'Pendiente' },
    { id: 3, nombre: 'Certificado de Similitud', estado: 'Registrado' },
    { id: 4, nombre: 'Autorización para el depósito de obra en Cybertesis', estado: 'Pendiente' },
    { id: 5, nombre: 'Hoja de Metadatos', estado: 'Registrado' },
    { id: 6, nombre: 'Reporte de Turnitin', estado: 'Registrado' }
  ];

  useEffect(() => {
    // Simulamos la carga de expedientes al montar el componente
    setExpedientes(expedientesMock);
  }, []);

  const handleSelectExpediente = (expediente) => {
    setSelectedExpediente(expediente);
    // Simulamos la carga de documentos para el expediente seleccionado
    setDocumentos(documentosMock);
  };

  const handleVerDocumento = (docId) => {
    console.log(`Ver documento con ID: ${docId}`);
    // Aquí podrías abrir un modal para ver el documento
  };

  const handleReportarDocumento = (docId) => {
    console.log(`Reportar documento con ID: ${docId}`);
    // Aquí podrías abrir un modal o una ventana para reportar el documento
  };

  const handleAdjuntarProrroga = () => {
    console.log('Adjuntar prórroga');
    // Aquí podrías redirigir a la vista de adjuntar prórroga
  };

  const handleRealizarSolicitud = () => {
    console.log('Realizar solicitud');
    // Aquí podrías redirigir a la vista de realizar solicitud
  };

  const handleAtras = () => {
    // Al hacer clic en "Atrás", vuelve a la vista del selector de expediente
    setSelectedExpediente(null);
    setDocumentos([]);
  };

  return (
    <Box>
      <SpaceBetween direction="vertical" size="l">
        <Header variant="h2">Realizar Solicitud</Header>
        
        {!selectedExpediente && (
          <Container header={<Header variant="h3">Seleccionar Expediente</Header>}>
            <FormField label="Expediente">
              <Select
                options={expedientes}
                selectedOption={selectedExpediente}
                onChange={({ detail }) => handleSelectExpediente(detail.selectedOption)}
                placeholder="Seleccione un expediente"
              />
            </FormField>
          </Container>
        )}

        {selectedExpediente && (
          <>
            <Table
              header={<Header variant="h3">Documentos del Expediente</Header>}
              items={documentos}
              columnDefinitions={[
                { id: 'id', header: 'ID Documento', cell: (item) => item.id },
                { id: 'tipoDocumento', header: 'Tipo de Documento', cell: (item) => item.nombre },
                {
                  id: 'acciones',
                  header: 'Acciones',
                  cell: (item) => (
                    <SpaceBetween direction="horizontal" size="xs">
                      <Button onClick={() => handleVerDocumento(item.id)}>Ver</Button>
                      <Button onClick={() => handleReportarDocumento(item.id)}>Reportar</Button>
                    </SpaceBetween>
                  )
                },
                {
                  id: 'estado',
                  header: 'Estado',
                  cell: (item) => item.estado === 'Registrado' ? (
                    <StatusIndicator type="success">Registrado</StatusIndicator>
                  ) : (
                    <StatusIndicator type="error">Pendiente</StatusIndicator>
                  )
                },
              ]}
            />
            <Box margin={{ top: 'l' }}>
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={handleAtras}>Atrás</Button>
                <Button onClick={handleAdjuntarProrroga}>Adjuntar Prórroga</Button>
                <Button variant="primary" onClick={handleRealizarSolicitud}>Realizar Solicitud</Button>
              </SpaceBetween>
            </Box>
          </>
        )}
      </SpaceBetween>
    </Box>
  );
};

export default CreateRequest;
