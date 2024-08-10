import React, { useState, useEffect, useContext } from 'react';
import ModalOneCol from './ModalOneCol';
import { Button, Alert } from '@cloudscape-design/components';
import { uploadCertificadoFile, createCertificadoSimilitud } from '../../../../../../api';
import UserContext from '../../../contexts/UserContext';

const CertificadoSimilitud = ({ onClose, onSave, documentos }) => {
  const { user } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (file) => {
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        setFileUrl(fileContent);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      let uploadedFileUrl = fileUrl;

      if (file) {
        const uploadResponse = await uploadCertificadoFile(file);
        uploadedFileUrl = uploadResponse.fileName;
      }

      const certificadoData = {
        file_url: uploadedFileUrl,
        created_by: user.user_id,
        updated_by: user.user_id,
        documentos_id: documentos.id
      };
      console.log('certificadoData:', certificadoData);

      await createCertificadoSimilitud(certificadoData);
      onSave();
      onClose();
    } catch (error) {
      setErrorMessage('Error al guardar el certificado de similitud.');
      console.error('Error al guardar el certificado de similitud:', error);
    }
  };

  return (
    <ModalOneCol
      onClose={onClose}
      headerText="Adjuntar Certificado de Similitud"
      footerButtons={
        <>
          <Button onClick={onClose} variant="secondary">Cancelar</Button>
          <Button  variant="primary" onClick={handleSave} disabled={!fileUrl && !file}>Guardar</Button>
        </>
      }
      file={file}
      setFile={handleFileChange}
      fileUrl={fileUrl}
      setFileUrl={setFileUrl}
      showForm={Boolean(fileUrl || file)}
      setShowForm={() => {}}
      mode='upload'
    >
      {errorMessage && <Alert type="error">{errorMessage}</Alert>}
    </ModalOneCol>
  );
};

export default CertificadoSimilitud;
