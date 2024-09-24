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
    if (file) {
      // Cambiamos el nombre del archivo antes de procesarlo
      const newFileName = `ConsInformado_${documentos.id}.pdf`;
  
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
        // Detalles del evento para el upload del archivo
        const eventoUploadDetails = {
          actor_user_id: user.user_id,
          actor_tipo_user_id: user.current_team_id, // Ajustar según el rol del usuario
          target_user_id: documentos.estudiante_id, // ID del estudiante afectado
          target_tipo_user_id: 2, // Tipo de usuario target
          document_id: documentos.id, // ID del documento
          tipo_documento_id: 7, // Tipo Consentimiento Informado
          action_type: 'Subida de consentimiento informado',
          event_description: `Se subió el consentimiento informado para el estudiante ${documentos.estudiante_id}.`,
          is_notificacion: 1
        };
  
        const uploadResponse = await uploadConsentimientoFile(file, eventoUploadDetails); // Pasamos los detalles del evento al upload
        uploadedFileUrl = uploadResponse.fileName;
      }
  
      const consentimientoData = {
        file_url: uploadedFileUrl,
        created_by: user.user_id,
        updated_by: user.user_id,
        documentos_id: documentos.id
      };
  
      // Detalles del evento para registrar la inserción del consentimiento
      const eventoInsertDetails = {
        actor_user_id: user.user_id,
        actor_tipo_user_id: user.current_team_id, // Ajustar según el rol del usuario
        target_user_id: documentos.estudiante_id, // ID del estudiante afectado
        target_tipo_user_id: 2, // Tipo de usuario target
        document_id: documentos.id, // ID del documento
        tipo_documento_id: 4, // Tipo Consentimiento Informado
        action_type: 'Registro de consentimiento informado',
        event_description: `Se registró el consentimiento informado para el estudiante ${documentos.estudiante_id}.`,
        is_notificacion: 1
      };
  
      // Enviar los detalles del consentimiento junto con el evento de registro
      await createConsentimiento({ ...consentimientoData, ...eventoInsertDetails });
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
