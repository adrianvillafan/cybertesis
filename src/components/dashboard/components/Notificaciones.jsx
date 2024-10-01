import React from 'react';
import { Box, Badge, ColumnLayout, Alert } from '@cloudscape-design/components';

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
    <Box padding={{ vertical: 'xs', horizontal: 'l' }} width="100%">
      {/* Encabezado de Advertencias */}
      <Box display="flex" alignItems="center" margin={{ bottom: 's' }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold', marginRight: '10px', marginLeft: '10px' }}>
          Advertencias
        </span>
        <Badge color="blue">22</Badge>
      </Box>

      {/* Contenedor para las Alertas sin color de fondo y sin bordes */}
      <div 
        style={{ 
          maxHeight: '450px', // Máxima altura del contenedor
          height: '50vh', // Altura responsiva (50% de la altura de la pantalla)
          width: '95%', // Ancho completo
          overflowY: 'auto', // Permitir desplazamiento vertical
          overflowX: 'hidden', // Evitar desplazamiento horizontal
          padding: '10px', // Espaciado interior
          borderRadius: '5px', // Bordes redondeados
          backgroundColor: '#f9f9f9', // Color de fondo
        }} 
      >
        <ColumnLayout columns={1} borders="vertical" variant="text-grid">
          {/* Primer cuadro como alerta de advertencia */}
          <Alert 
            key={alertas[0].id} 
            statusIconAriaLabel="Warning" 
            type="warning"
            header={alertas[0].title}
          >
            <Box style={{ fontSize: '12px' }}>
              {alertas[0].text}
              <span style={{ color: 'red' }}>{alertas[0].number}</span>
            </Box>
          </Alert>

          {/* Segundo cuadro como alerta de información */}
          <Alert 
            key={alertas[1].id} 
            statusIconAriaLabel="Info" 
            header={alertas[1].title}
          >
            <Box style={{ fontSize: '12px' }}>
              {alertas[1].text}
              <span style={{ color: 'red' }}>{alertas[1].number}</span>
            </Box>
          </Alert>

          {/* Tercer cuadro como alerta de error */}
          <Alert 
            key={alertas[2].id} 
            statusIconAriaLabel="Error" 
            type="error" 
            header="La cantidad de tesis que necesita corregir de Recepción de documentos son:"
          >
            <Box style={{ fontSize: '12px' }}>
              {alertas[2].text}
              <span style={{ color: 'red' }}>{alertas[2].number}</span>
            </Box>
          </Alert>

          {/* Cuarto cuadro como alerta regular */}
          <Alert 
            key={alertas[3].id} 
            statusIconAriaLabel="Info" 
            header={alertas[3].title}
          >
            <Box style={{ fontSize: '12px' }}>
              {alertas[3].text}
              <span style={{ color: 'red' }}>{alertas[3].number}</span>
            </Box>
          </Alert>
        </ColumnLayout>
      </div>
    </Box>
  );
};

export default Notificaciones;
