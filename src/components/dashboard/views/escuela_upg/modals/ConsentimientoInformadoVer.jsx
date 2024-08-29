import React, { useEffect, useState } from 'react';
import ModalOneCol from './ModalOneCol';
import { Button } from '@cloudscape-design/components';
import { fetchConsentimientoById } from '../../../../../../api';

const ConsentimientoInformadoVer = ({ onClose, documentos }) => {
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    const fetchConsentimiento = async () => {
      try {
        const consentimientoData = await fetchConsentimientoById(documentos.consentimiento_id);
        setFileUrl(consentimientoData.file_url);
      } catch (error) {
        console.error('Error al obtener Consentimiento Informado:', error);
      }
    };

    if (documentos.consentimiento_id) {
      fetchConsentimiento();
    }
  }, [documentos.consentimiento_id]);

  return (
    <ModalOneCol
      onClose={onClose}
      headerText="Ver Consentimiento Informado"
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

export default ConsentimientoInformadoVer;
