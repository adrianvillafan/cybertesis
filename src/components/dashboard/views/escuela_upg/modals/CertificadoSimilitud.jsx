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
    if (file) {
      // Cambiamos el nombre del archivo antes de procesarlo
      const newFileName = `CertSimilitud_${documentos.id}.pdf`;
  
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
        const eventoDetailsUpload = {
          actor_user_id: user.user_id,
          actor_tipo_user_id: user.current_team_id,
          target_user_id: documentos.estudiante_id, // ID del estudiante
          target_tipo_user_id: 2, // Tipo de usuario target
          document_id: documentos.id,
          tipo_documento_id: 3, // Certificado de similitud
          action_type: 'Subida de certificado de similitud',
          event_description: `Se ha subido el certificado de similitud para el estudiante ${documentos.estudiante_id}.`,
          is_notificacion: 0
        };
  
        const uploadResponse = await uploadCertificadoFile(file, eventoDetailsUpload);
        uploadedFileUrl = uploadResponse.fileName;
      }
  
      const certificadoData = {
        file_url: uploadedFileUrl,
        created_by: user.user_id,
        updated_by: user.user_id,
        documentos_id: documentos.id
      };
      console.log('certificadoData:', certificadoData);
  
      // Evento para la inserción del certificado
      const eventoDetailsInsert = {
        actor_user_id: user.user_id,
        actor_tipo_user_id: user.current_team_id,
        target_user_id: documentos.estudiante_id,
        target_tipo_user_id: 2, // Tipo de usuario target
        document_id: documentos.id,
        tipo_documento_id: 3, // Certificado de similitud
        action_type: 'Inserción de certificado de similitud',
        event_description: `Se ha insertado el certificado de similitud para el estudiante ${documentos.estudiante_id}.`,
        is_notificacion: 1
      };
  
      // Insertar el certificado y registrar el evento
      await createCertificadoSimilitud({ ...certificadoData, ...eventoDetailsInsert });
  
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
