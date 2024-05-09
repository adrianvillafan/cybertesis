import { Viewer } from '@react-pdf-viewer/core'; // Asegúrate de que esté importado correctamente
import React, { useState } from 'react';
import { previewDocument } from '../../../../../api';

const DocumentPreview = ({ fileId }) => {
  const [pdfFileUrl, setPdfFileUrl] = useState('');

  const handlePreview = async () => {
    try {
      const url = await previewDocument(fileId);
      console.log('URL del documento:', url);
      setPdfFileUrl(url);
    } catch (error) {
      console.error('Error al obtener la vista previa del documento:', error);
    }
  };

  return (
    <div>
      <button onClick={handlePreview}>Ver Documento</button>
      {pdfFileUrl && (
        <Viewer fileUrl={pdfFileUrl} />
      )}
    </div>
  );
};

export default DocumentPreview;
