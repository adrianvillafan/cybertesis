import React, { useState, useEffect, useContext } from 'react';
import ModalOneCol from './ModalOneCol'; // Asegúrate de que la ruta sea correcta
import { Button, Alert } from '@cloudscape-design/components';
import { uploadReporteTurnitinFile, createReporteTurnitin } from '../../../../../../api';
import UserContext from '../../../contexts/UserContext';

const RepTurnitinModal = ({ onClose, onSave, readOnly, fileUrl: initialFileUrl, documentos }) => {
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
        const uploadResponse = await uploadReporteTurnitinFile(file);
        uploadedFileUrl = uploadResponse.fileName;
      }

      const reporteData = {
        file_url: uploadedFileUrl,
        created_by: user.user_id,
        updated_by: user.user_id,
        documentos_id: documentos.id
      };

      await createReporteTurnitin(reporteData);
      onSave();
      onClose();
    } catch (error) {
      setErrorMessage('Error al guardar el reporte de Turnitin.');
      console.error('Error al guardar el reporte de Turnitin:', error);
    }
  };

  return (
    <ModalOneCol
      onClose={onClose}
      headerText="Adjuntar Reporte de Turnitin"
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
      readOnly={readOnly}
      mode={'upload'}
    >
      {errorMessage && <Alert type="error">{errorMessage}</Alert>}
    </ModalOneCol>
  );
};

export default RepTurnitinModal;
