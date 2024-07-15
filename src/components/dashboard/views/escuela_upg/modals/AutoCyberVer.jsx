import React, { useEffect, useState } from 'react';
import ModalOneCol from './ModalOneCol';
import { Button } from '@cloudscape-design/components';
import { fetchAutoCyberById } from '../../../../../../api';

const AutoCyberVer = ({ onClose, documentos }) => {
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    const fetchAutoCyber = async () => {
      try {
        const autoCyberData = await fetchAutoCyberById(documentos.autocyber_id);
        setFileUrl(autoCyberData.file_url);
      } catch (error) {
        console.error('Error al obtener AutoCyber:', error);
      }
    };

    if (documentos.autocyber_id) {
      fetchAutoCyber();
    }
  }, [documentos.autocyber_id]);

  return (
    <ModalOneCol
      onClose={onClose}
      headerText="Ver Autorización para el Depósito de Obra en Cybertesis"
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

export default AutoCyberVer;
