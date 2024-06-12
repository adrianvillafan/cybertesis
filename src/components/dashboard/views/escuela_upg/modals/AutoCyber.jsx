import React, { useState, useEffect } from 'react';
import ModalOneCol from './ModalOneCol';
import { Button } from '@cloudscape-design/components';

const AutoCyber = ({ onClose, onSave, readOnly, fileUrl: initialFileUrl }) => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(readOnly ? initialFileUrl : '');

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

  const handleSave = () => {
    onSave({ fileUrl });
    onClose();
  };

  return (
    <ModalOneCol
      onClose={onClose}
      headerText="Autorización para el depósito de obra en Cybertesis"
      footerButtons={
        <>
          <Button onClick={onClose} variant="secondary">Cancelar</Button>
          <Button onClick={handleSave} disabled={!fileUrl}>Guardar</Button>
        </>
      }
      file={file}
      setFile={handleFileChange}
      fileUrl={fileUrl}
      setFileUrl={setFileUrl}
      showForm={Boolean(fileUrl)}
      setShowForm={() => {}}
      readOnly={readOnly}
    />
  );
};

export default AutoCyber;
