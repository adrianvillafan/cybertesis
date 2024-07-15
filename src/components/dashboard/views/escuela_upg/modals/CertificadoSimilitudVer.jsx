import React, { useState, useEffect } from 'react';
import ModalOneCol from './ModalOneCol';
import { Button } from '@cloudscape-design/components';
import { fetchCertificadoById } from '../../../../../../api';

const CertificadoSimilitudVer = ({ onClose, documentos }) => {
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    const fetchCertificado = async () => {
      try {
        const data = await fetchCertificadoById(documentos.certsimil_id);
        setFileUrl(data.file_url);
      } catch (error) {
        console.error('Error al obtener el certificado de similitud:', error);
      }
    };

    fetchCertificado();
  }, [documentos.certsimil_id]);

  return (
    <ModalOneCol
      onClose={onClose}
      headerText="Ver Certificado de Similitud"
      footerButtons={
        <>
          <Button onClick={onClose} variant="secondary">Cerrar</Button>
          <Button iconName="download" href={fileUrl} target="_blank" variant="primary">Descargar</Button>
        </>
      }
      fileUrl={fileUrl}
      showForm={Boolean(fileUrl)}
      readOnly={true}
    />
  );
};

export default CertificadoSimilitudVer;
