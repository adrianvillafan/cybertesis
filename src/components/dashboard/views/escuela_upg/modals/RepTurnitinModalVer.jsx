import React, { useEffect, useState } from 'react';
import ModalOneCol from './ModalOneCol';
import { Button, Link, Alert } from '@cloudscape-design/components';
import { fetchTurnitinById } from '../../../../../../api';

const RepTurnitinModalVer = ({ onClose, documentos }) => {
  const [fileUrl, setFileUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchFileUrl = async () => {
      try {
        const turnitin = await fetchTurnitinById(documentos.repturnitin_id);
        setFileUrl(turnitin.file_url);
      } catch (error) {
        setErrorMessage('Error al obtener el reporte de Turnitin.');
        console.error('Error al obtener el reporte de Turnitin:', error);
      }
    };

    fetchFileUrl();
  }, [documentos.repturnitin_id]);

  return (
    <ModalOneCol
      onClose={onClose}
      headerText="Ver Reporte de Turnitin"
      footerButtons={
        <>
          <Button onClick={onClose} variant="secondary">Cerrar</Button>
          <Button iconName="download" href={fileUrl} target="_blank" variant="primary">Descargar</Button>
        </>
      }
      fileUrl={fileUrl}
      readOnly
    />
  );
};

export default RepTurnitinModalVer;
