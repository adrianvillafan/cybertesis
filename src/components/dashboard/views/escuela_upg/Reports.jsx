import React from 'react';
import { Container, Box, Header, SpaceBetween, ColumnLayout, PieChart, AreaChart, BarChart } from '@cloudscape-design/components';

const Reports = () => {
  const pieData = [
    { title: 'Tesis subidas', value: 20, color: 'blue' },
    { title: 'Tesis completas', value: 100, color: 'green' },
    { title: 'Tesis incompletas', value: 125, color: 'red' },
    { title: 'Tesis por revisar', value: 125, color: 'orange' }
  ];

  const areaChartData = [
    {
      title: "Estado de Tesis",
      type: "area",
      data: [
        { x: new Date(2024, 0, 1), y: 20 },
        { x: new Date(2024, 1, 1), y: 100 },
        { x: new Date(2024, 2, 1), y: 125 },
        { x: new Date(2024, 3, 1), y: 125 }
      ],
      valueFormatter: e => e + " tesis"
    }
  ];

  const barChartData = [
    {
      title: "Tesis incompletas por programa",
      type: "bar",
      data: [
        { x: "Doctorado", y: 88 },
        { x: "Maestría", y: 80 },
        { x: "Magíster", y: 10 }
      ],
      valueFormatter: e => e + " tesis"
    }
  ];

  return (
    <>
      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Estado de Tesis</Header>}>
          <ColumnLayout columns={2} variant="text-grid">
            <Box>
              <PieChart
                data={pieData}
                detail={{
                  title: 'Total de Tesis',
                  value: 370,
                  unit: 'Tesis'
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
                ariaLabel="Area chart of tesis status"
                height={200}
                empty={
                  <Box textAlign="center" color="inherit">
                    <b>No data available</b>
                  </Box>
                }
                noMatch={
                  <Box textAlign="center" color="inherit">
                    <b>No matching data</b>
                  </Box>
                }
              />
            </Box>
          </ColumnLayout>
        </Container>

        <Container header={<Header variant="h2">Tesis incompletas</Header>}>
          <BarChart
            series={barChartData}
            xScaleType="categorical"
            yDomain={[0, 100]}
            yTitle="Cantidad"
            xTitle="Programa"
            ariaLabel="Bar chart of incomplete tesis by program"
            height={300}
            empty={
              <Box textAlign="center" color="inherit">
                <b>No data available</b>
              </Box>
            }
            noMatch={
              <Box textAlign="center" color="inherit">
                <b>No matching data</b>
              </Box>
            }
          />
        </Container>
      </SpaceBetween>
    </>
  );
};

export default Reports;
