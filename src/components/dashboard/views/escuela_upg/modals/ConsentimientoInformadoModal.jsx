import React, { useState, useEffect, useContext } from 'react';
import ModalOneCol from './ModalOneCol';
import { Button, Alert } from '@cloudscape-design/components';
import { uploadConsentimientoFile, createConsentimiento } from '../../../../../../api';
import UserContext from '../../../contexts/UserContext';

const ConsentimientoInformado = ({ onClose, onSave, readOnly, fileUrl: initialFileUrl, documentos }) => {
  const { user } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(readOnly ? initialFileUrl : '');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (readOnly && initialFileUrl) {
      setFileUrl(initialFileUrl);
    }
  }, [readOnly, initialFileUrl]);

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
        const uploadResponse = await uploadConsentimientoFile(file);
        uploadedFileUrl = uploadResponse.fileName;
      }

      const consentimientoData = {
        file_url: uploadedFileUrl,
        created_by: user.user_id,
        updated_by: user.user_id,
        documentos_id: documentos.id
      };

      await createConsentimiento(consentimientoData);
      onSave();
      onClose();
    } catch (error) {
      setErrorMessage('Error al guardar Consentimiento Informado.');
      console.error('Error al guardar Consentimiento Informado:', error);
    }
  };

  return (
    <ModalOneCol
      onClose={onClose}
      headerText="Adjuntar Consentimiento Informado"
      footerButtons={
        <>
          <Button onClick={onClose} variant="secondary">Cancelar</Button>
          <Button variant="primary" onClick={handleSave} disabled={!fileUrl && !file}>Guardar</Button>
        </>
      }
      file={file}
      setFile={handleFileChange}
      fileUrl={fileUrl}
      setFileUrl={setFileUrl}
      showForm={Boolean(fileUrl || file)}
      setShowForm={() => {}}
      mode="upload"
    >
      {errorMessage && <Alert type="error">{errorMessage}</Alert>}
    </ModalOneCol>
  );
};

export default ConsentimientoInformado;