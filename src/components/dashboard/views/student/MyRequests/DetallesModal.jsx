import React from 'react';
import {
  Modal,
  Table,
  Button,
  Icon,
  Box,
  SpaceBetween
} from '@cloudscape-design/components';

// Tipos de documentos como ejemplo
const tiposDocumentos = {
  1: 'Tesis',
  2: 'Acta de Sustentacion',
  3: 'Certificado de Similitud',
  4: 'Autorizacion para el deposito de obra en Cybertesis',
  5: 'Hoja de Metadatos',
  6: 'Reporte de Turnitin',
  7: 'Solicitud de Postergacion'
};

const DetallesModal = ({ solicitud, onClose }) => {
  if (!solicitud) return null;

  //const documentos = solicitud.documentos || [];
  const documentos = [
    {
      id: 1,
      nombre: "Tesis_Final.pdf",
      url: "http://example.com/tesis_final.pdf",
      tipoDocumentoId: 1,
      fechaSubida: "2024-04-12T12:34:56"
    },
    {
      id: 2,
      nombre: "Acta_Sustentacion.pdf",
      url: "http://example.com/acta_sustentacion.pdf",
      tipoDocumentoId: 2,
      fechaSubida: "2024-04-15T15:48:22"
    },
    {
      id: 3,
      nombre: "Certificado_Similitud.pdf",
      url: "http://example.com/certificado_similitud.pdf",
      tipoDocumentoId: 3,
      fechaSubida: "2024-04-20T09:30:00"
    }
  ];

  const descargarTodos = () => {
    documentos.forEach(doc => {
      // Lógica para descargar cada archivo
      console.log("Descargando:", doc.url);
    });
  };

  return (
    <Modal
      header="Detalles de la Solicitud"
      visible={true}
      onDismiss={onClose}
      size="large"
      footer={

        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={descargarTodos}>Descargar todos</Button>
            <Button onClick={onClose}>Cerrar</Button>
          </SpaceBetween>

        </Box>
      }
    >
      <Table
        items={documentos}
        columnDefinitions={[
          {
            header: 'Tipo',
            cell: item => tiposDocumentos[item.tipoDocumentoId] || 'Desconocido'
          },
          {
            header: 'Documento',
            cell: item => (
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <Icon
                  size="normal"
                  svg={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M19 2H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.5 14h-2v3H4V4h2v9h11v3h-2.5zM23 11h-3V8h-3V5h3V2h3v3h3v3h-3v3z" />
                    </svg>
                  }
                />
                {item.nombre}
              </span>
            )
          },
          {
            header: 'Acciones',
            cell: item => (
              <div style={{ display: 'flex', gap: '10px' }}>
                <SpaceBetween direction="horizontal" size="xs">
                  <Button onClick={() => window.open(item.url, '_blank')}>
                    Descargar
                  </Button>
                  <Button onClick={() => window.open(item.url, '_blank')}>
                    Visualizar
                  </Button>
                </SpaceBetween>

              </div>
            )
          }
        ]}
      />
    </Modal>
  );
};

export default DetallesModal;
