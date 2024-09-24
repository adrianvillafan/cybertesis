import React, { useState, useEffect, useContext } from 'react';
import ModalOneCol from './ModalOneCol';
import { Button, Alert } from '@cloudscape-design/components';
import { uploadPostergacionPublicacionFile, createPostergacionPublicacion } from '../../../../../../api';
import UserContext from '../../../contexts/UserContext';

const PostergacionPublicacion = ({ onClose, onSave, readOnly, fileUrl: initialFileUrl, documentos }) => {
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
      const newFileName = `PostPublicacion_${documentos.id}.pdf`;
  
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
        // Detalles del evento para la subida del archivo
        const eventoUploadDetails = {
          actor_user_id: user.user_id,
          actor_tipo_user_id: user.current_team_id, // Ajustar según el rol del usuario
          target_user_id: documentos.estudiante_id, // ID del estudiante o el usuario afectado
          target_tipo_user_id: 2, // Tipo de usuario target
          document_id: documentos.id, // ID del documento
          tipo_documento_id: 7, // Tipo de documento (Postergación de Publicación)
          action_type: 'Subida de Postergación de Publicación',
          event_description: `Se subió la Postergación de Publicación.`,
          is_notificacion: 1
        };
  
        const uploadResponse = await uploadPostergacionPublicacionFile(file, eventoUploadDetails);
        uploadedFileUrl = uploadResponse.fileName;
      }
  
      const postergacionData = {
        file_url: uploadedFileUrl,
        created_by: user.user_id,
        updated_by: user.user_id,
        documentos_id: documentos.id
      };
  
      // Detalles del evento para registrar la inserción de la postergación
      const eventoInsertDetails = {
        actor_user_id: user.user_id,
        actor_tipo_user_id: user.current_team_id, // Ajustar según el rol del usuario
        target_user_id: documentos.estudiante_id, // ID del estudiante afectado
        target_tipo_user_id: 2, // Tipo de usuario target
        document_id: documentos.id, // ID del documento
        tipo_documento_id: 8, // Tipo de documento (Postergación de Publicación)
        action_type: 'Registro de Postergación de Publicación',
        event_description: `Postergación de Publicación registrada.`,
        is_notificacion: 1
      };
  
      await createPostergacionPublicacion({ ...postergacionData, ...eventoInsertDetails });
      onSave();
      onClose();
    } catch (error) {
      setErrorMessage('Error al guardar Postergación de Publicación.');
      console.error('Error al guardar Postergación de Publicación:', error);
    }
  };
  

  return (
    <ModalOneCol
      onClose={onClose}
      headerText="Adjuntar Postergación de Publicación (Opcional)"
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

export default PostergacionPublicacion;
