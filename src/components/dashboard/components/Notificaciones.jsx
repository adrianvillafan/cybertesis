import React from 'react';
import NotificacionesHeader from './NotificacionesHeader';
import { Container, Header, ColumnLayout, Box } from '@cloudscape-design/components';

const alertas = [
  {
    id: 1, // Agrega un identificador único
    title: 'Alerta de proceso incompleto',
    duration: 'Le falta completar 2 tesis',
  },
  {
    id: 2,
    title: 'Alerta de proceso incompleto',
    duration: 'No ha completado 2 tesis dentro de las 24 horas',
  },
  {
    id: 3,
    title: 'Alerta de proceso incompleto',
    duration: 'Corregir 3 tesis enviado de Recepción de documentos',
  },
  {
    id: 4,
    title: 'Alerta de proceso incompleto',
    duration: 'falta',
  },
];

const Notificaciones = () => {
  return (
    <Container>
      <NotificacionesHeader />
      <ColumnLayout columns={4} borders="vertical" variant="text-grid">
        {alertas.map((alerta) => (
          <Container key={alerta.id} header={<Header variant="h5" style={{ fontSize: '10px' }}>{alerta.title}</Header>}>
            <Box style={{ fontSize: '12px' }}>
              {alerta.duration}
            </Box>
          </Container>
        ))}
      </ColumnLayout>
    </Container>
  );
};

export default Notificaciones;
