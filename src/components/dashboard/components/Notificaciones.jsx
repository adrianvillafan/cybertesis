import React from 'react';

import { Container, Header, ColumnLayout, Box, Button, Badge } from '@cloudscape-design/components';

const alertas = [
  {
    id: 1,
    title: 'Alerta de proceso incompleto',
    text: 'La cantidad de tesis que le falta completar son: ',
    number: 2,
  },
  {
    id: 2,
    title: 'Alerta de proceso incompleto',
    text: 'La cantidad de tesis que no ha completado en 24 horas son: ',
    number: 2,
  },
  {
    id: 3,
    title: 'Alerta de proceso incompleto',
    text: 'La cantidad de tesis que necesita corregir de Recepción de documentos son: ',
    number: 3,
  },
  {
    id: 4,
    title: 'Alerta de proceso incompleto',
    text: 'La cantidad de tesis que faltan por revisar son: ',
    number: 1,
  },
];

const Notificaciones = () => {
  return (
    <Container>
      {/* Encabezado de Advertencias */}
      <Box 
        padding={{ vertical: 's', horizontal: 'l' }} 
        display="flex" 
        alignItems="center" 
        justifyContent="space-between"
      >
        <Header variant="h2" style={{ margin: 0 }}>Advertencias</Header>
        <Badge color="blue">22</Badge>
      </Box>
      
      
      {/* Sección de Alertas */}
      <ColumnLayout columns={4} borders="vertical" variant="text-grid">
        {alertas.map((alerta) => (
          <Container 
            key={alerta.id} 
            header={
              <Header variant="h5" style={{ fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Button iconName="add-plus" variant="icon" ariaLabel="Agregar" />
                <span style={{ marginLeft: '5px' }}>{alerta.title}</span> 
              </Header>
            }
          >
            <Box style={{ fontSize: '12px' }}>
              {alerta.text}
              <span style={{ color: 'red' }}>{alerta.number}</span>
            </Box>
          </Container>
        ))}
      </ColumnLayout>
    </Container>
  );
};

export default Notificaciones;
