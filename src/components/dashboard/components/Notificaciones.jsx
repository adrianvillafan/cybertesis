import React from 'react';
import NotificacionesHeader from './NotificacionesHeader';
import { Container, Header, ColumnLayout, Box } from '@cloudscape-design/components';

const alertas = [
  {
    title: 'Alerta de proceso incompleto',
    duration: 'Le falta completar 2 tesis',
  },
  {
    title: 'Alerta de proceso incompleto',
    duration: 'No ha completado 2 tesis dentro de las 24 horas',
  },
  {
    title: 'Alerta de proceso incompleto',
    duration: 'Corregir 3 tesis enviado de Recepción de documentos',
  },
  {
    title: 'Alerta de proceso incompleto',
    duration: 'falta',
  },
];

const Notificaciones = () => {
  return (
    <Container>
      <NotificacionesHeader />
      <ColumnLayout columns={4} borders="vertical" variant="text-grid"> {/* 4 columnas con bordes verticales */}
        {alertas.map((alerta, index) => (
          <Container key={index} header={<Header variant="h3">{alerta.title}</Header>}>
            <Box>
              {alerta.duration}
            </Box>
          </Container>
        ))}
      </ColumnLayout>
    </Container>
  );
};

export default Notificaciones;
