import React, { useState, useEffect, useContext } from 'react';
import ModalOneCol from './ModalOneCol';
import { Button, Alert } from '@cloudscape-design/components';
import { uploadAutoCyberFile, createAutoCyber } from '../../../../../../api';
import UserContext from '../../../contexts/UserContext';

const AutoCyber = ({ onClose, onSave, readOnly, fileUrl: initialFileUrl, documentos }) => {
  const { user } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(readOnly ? initialFileUrl : '');
  const [errorMessage, setErrorMessage] = useState('');

  console.log(documentos)

  useEffect(() => {
    if (readOnly && initialFileUrl) {
      setFileUrl(initialFileUrl);
    }
  }, [readOnly, initialFileUrl]);

  const handleFileChange = (file) => {
    if (file) {
      // Cambiamos el nombre del archivo antes de procesarlo
      const newFileName = `AutoCyber_${documentos.id}.pdf`;
  
      // Creamos un nuevo archivo con el nuevo nombre, conservando el contenido del archivo original
      const renamedFile = new File([file], newFileName, { type: file.type });
  
      setFile(renamedFile);
  
      // Leer el contenido del archivo y actualizar el fileUrl para previsualización
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        setFileUrl(fileContent);
      };
      reader.readAsDataURL(renamedFile);
    }
  };
  

  const handleSave = async () => {
  try {
    let uploadedFileUrl = fileUrl;

    if (file) {
      const uploadResponse = await uploadAutoCyberFile(file); // Aquí 'file' ya tendrá el nombre cambiado
      uploadedFileUrl = uploadResponse.fileName;
    }

    const autoCyberData = {
      file_url: uploadedFileUrl,
      created_by: user.user_id,
      updated_by: user.user_id,
      documentos_id: documentos.id
    };

    await createAutoCyber(autoCyberData);
    onSave();
    onClose();
  } catch (error) {
    setErrorMessage('Error al guardar AutoCyber.');
    console.error('Error al guardar AutoCyber:', error);
  }
};

  return (
    <ModalOneCol
      onClose={onClose}
      headerText="Adjuntar Autorización para el Depósito de Obra en Cybertesis"
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
      mode="upload"
    >
      {errorMessage && <Alert type="error">{errorMessage}</Alert>}
    </ModalOneCol>
  );
};

export default AutoCyber;
