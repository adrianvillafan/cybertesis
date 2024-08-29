import React, { useEffect, useState } from 'react';
import ModalOneCol from './ModalOneCol';
import { Button } from '@cloudscape-design/components';
import { fetchPostergacionById } from '../../../../../../api';

const PostergacionPublicacionVer = ({ onClose, documentos }) => {
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    const fetchPostergacionPublicacion = async () => {
      try {
        const postergacionData = await fetchPostergacionById(documentos.postergacion_id);
        setFileUrl(postergacionData.file_url);
      } catch (error) {
        console.error('Error al obtener Postergación de Publicación:', error);
      }
    };

    if (documentos.postergacion_id) {
      fetchPostergacionPublicacion();
    }
  }, [documentos.postergacion_id]);

  return (
    <ModalOneCol
      onClose={onClose}
      headerText="Ver Postergación de Publicación (Opcional)"
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

export default PostergacionPublicacionVer;
