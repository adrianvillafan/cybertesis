//src/components/dashboard/views/recepDocs/ExpedientReports.jsx
import React from 'react';
import { Container, Box, Header, SpaceBetween, ColumnLayout, PieChart, AreaChart, BarChart } from '@cloudscape-design/components';

const ExpedientReports = () => {
  // Datos para el gráfico de pastel, simulando el estado de los expedientes
  const pieData = [
    { title: 'Expedientes revisados', value: 50, color: 'blue' },
    { title: 'Expedientes completos', value: 30, color: 'green' },
    { title: 'Expedientes incompletos', value: 45, color: 'red' },
    { title: 'Expedientes en proceso', value: 25, color: 'orange' }
  ];

  // Datos para el gráfico de área, simulando el progreso de expedientes en el tiempo
  const areaChartData = [
    {
      title: "Estado de Expedientes",
      type: "area",
      data: [
        { x: new Date(2024, 0, 1), y: 20 },
        { x: new Date(2024, 1, 1), y: 50 },
        { x: new Date(2024, 2, 1), y: 80 },
        { x: new Date(2024, 3, 1), y: 120 }
      ],
      valueFormatter: e => e + " expedientes"
    }
  ];

  // Datos para el gráfico de barras, simulando expedientes incompletos por tipo de programa
  const barChartData = [
    {
      title: "Expedientes incompletos por programa",
      type: "bar",
      data: [
        { x: "Doctorado", y: 40 },
        { x: "Maestría", y: 30 },
        { x: "Licenciatura", y: 15 }
      ],
      valueFormatter: e => e + " expedientes"
    }
  ];

  return (
    <>
      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Estado de Expedientes</Header>}>
          <ColumnLayout columns={2} variant="text-grid">
            <Box>
              <PieChart
                data={pieData}
                detail={{
                  title: 'Total de Expedientes',
                  value: 150,
                  unit: 'Expedientes'
                }}
                size="medium"
                legendPosition="right"
              />
            </Box>
            <Box>
              <AreaChart
                series={areaChartData}
                xDomain={[new Date(2024, 0, 1), new Date(2024, 3, 1)]}
                yDomain={[0, 150]}
                xScaleType="time"
                yTitle="Cantidad"
                xTitle="Fecha"
                ariaLabel="Gráfico de área sobre el estado de expedientes en el tiempo"
                height={200}
                empty={
                  <Box textAlign="center" color="inherit">
                    <b>No hay datos disponibles</b>
                  </Box>
                }
                noMatch={
                  <Box textAlign="center" color="inherit">
                    <b>No hay datos coincidentes</b>
                  </Box>
                }
              />
            </Box>
          </ColumnLayout>
        </Container>

        <Container header={<Header variant="h2">Expedientes Incompletos</Header>}>
          <BarChart
            series={barChartData}
            xScaleType="categorical"
            yDomain={[0, 50]}
            yTitle="Cantidad"
            xTitle="Programa"
            ariaLabel="Gráfico de barras sobre expedientes incompletos por programa"
            height={300}
            empty={
              <Box textAlign="center" color="inherit">
                <b>No hay datos disponibles</b>
              </Box>
            }
            noMatch={
              <Box textAlign="center" color="inherit">
                <b>No hay datos coincidentes</b>
              </Box>
            }
          />
        </Container>
      </SpaceBetween>
    </>
  );
};

export default ExpedientReports;
