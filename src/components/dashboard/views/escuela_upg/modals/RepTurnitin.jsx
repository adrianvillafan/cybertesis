import React, { useState, useEffect, useContext } from 'react';
import ModalOneCol from './ModalOneCol'; // Asegúrate de que la ruta sea correcta
import { Button, Alert } from '@cloudscape-design/components';
import { uploadReporteTurnitinFile, createReporteTurnitin } from '../../../../../../api';
import UserContext from '../../../contexts/UserContext';

const RepTurnitinModal = ({ onClose, onSave, readOnly, fileUrl: initialFileUrl, documentos }) => {
  const { user } = useContext(UserContext);
  console.log('user:', user);
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
      const newFileName = `RepTurnitin_${documentos.id}.pdf`;
  
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
        const uploadEventoDetails = {
          actor_user_id: user.user_id,
          actor_tipo_user_id: user.current_team_id, // Ajusta según el rol del usuario
          target_user_id: documentos.estudiante_id, // ID del estudiante afectado
          target_tipo_user_id: 2, // Tipo de usuario target
          document_id: documentos.id, // ID del documento
          tipo_documento_id: 6, // Tipo de documento (Reporte de Turnitin)
          action_type: 'Subida de reporte de Turnitin',
          event_description: `El usuario subió un archivo de reporte de Turnitin.`,
          is_notificacion: 1
        };
  
        const uploadResponse = await uploadReporteTurnitinFile(file, uploadEventoDetails);
        uploadedFileUrl = uploadResponse.fileName;
      }
  
      const reporteData = {
        file_url: uploadedFileUrl,
        created_by: user.user_id,
        updated_by: user.user_id,
        documentos_id: documentos.id
      };
  
      // Detalles del evento para la inserción del reporte
      const insertEventoDetails = {
        actor_user_id: user.user_id,
        actor_tipo_user_id: user.current_team_id, // Ajusta según el rol del usuario
        target_user_id: documentos.estudiante_id, // ID del estudiante afectado
        target_tipo_user_id: 2, // Tipo de usuario target
        document_id: documentos.id, // ID del documento
        tipo_documento_id: 6, // Tipo de documento (Reporte de Turnitin)
        action_type: 'Registro de reporte de Turnitin',
        event_description: `Se registró el reporte de Turnitin.`,
        is_notificacion: 1
      };
  
      await createReporteTurnitin({ ...reporteData, ...insertEventoDetails });
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
