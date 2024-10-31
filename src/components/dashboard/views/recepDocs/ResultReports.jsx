// ResultReports.jsx
import React from 'react';
import { Container, Header, SpaceBetween, ColumnLayout, Table, Box } from '@cloudscape-design/components';

const ResultReports = () => {
  // Datos de ejemplo para mostrar en la tabla
  const data = [
    { id: 1, nombre: 'Reporte A', estado: 'Completo', fecha: '2024-10-01' },
    { id: 2, nombre: 'Reporte B', estado: 'Pendiente', fecha: '2024-10-05' },
    { id: 3, nombre: 'Reporte C', estado: 'En Proceso', fecha: '2024-10-10' },
  ];

  return (
    <SpaceBetween size="l">
      <Container header={<Header variant="h2">Reporte de Resultados</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <Box>
            <p>Aquí puedes ver el estado general de los resultados obtenidos.</p>
          </Box>
          <Box>
            <p>Este reporte incluye información detallada sobre cada expediente.</p>
          </Box>
        </ColumnLayout>
      </Container>

      <Container header={<Header variant="h2">Detalles del Reporte</Header>}>
        <Table
          columnDefinitions={[
            { id: 'nombre', header: 'Nombre', cell: item => item.nombre },
            { id: 'estado', header: 'Estado', cell: item => item.estado },
            { id: 'fecha', header: 'Fecha', cell: item => item.fecha },
          ]}
          items={data}
          empty={
            <Box textAlign="center" color="inherit">
              <b>No hay datos disponibles</b>
            </Box>
          }
          header={<Header>Expedientes</Header>}
        />
      </Container>
    </SpaceBetween>
  );
};

export default ResultReports;
