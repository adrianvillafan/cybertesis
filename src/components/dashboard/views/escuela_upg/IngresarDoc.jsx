import React, { useState, useContext } from 'react';
import { Button, Container } from '@cloudscape-design/components';
import UserContext from '../../contexts/UserContext';
import RequerimientosInicio from './steps/RequerimientosInicio';
import ConfirmarDatos from './steps/ConfirmarDatos';
import DocumentosRequeridos from './steps/DocumentosRequeridos';
import DeclaracionJurada from './steps/DeclaracionJurada';
import SolicitudEnviada from './steps/SolicitudEnviada';
import { uploadDocument, confirmUploadDocument, submitSolicitud } from '../../../../../api';

const IngresarDoc = () => {
  const { user } = useContext(UserContext);
  const [tipoSolicitud, setTipoSolicitud] = useState('regular');
  const [step, setStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [canProceed, setCanProceed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileIds, setFileIds] = useState([]);
  const [solicitudId, setSolicitudId] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const [alumnoData, setAlumnoData] = useState(null); // New state for alumno data

  // Documentos requeridos según el tipo de solicitud
  const documentosRequeridos = {
    regular: [
      { id: 1, nombre: 'Tesis' },
      { id: 2, nombre: 'Acta de Sustentación' },
      { id: 3, nombre: 'Certificado de Similitud' },
      { id: 4, nombre: 'Autorización para el depósito de obra en Cybertesis' },
      { id: 5, nombre: 'Hoja de Metadatos' },
      { id: 6, nombre: 'Reporte de Turnitin' }
    ]
  };

  const [files, setFiles] = useState(Array.from({ length: documentosRequeridos[tipoSolicitud].length + 1 }, () => []));

  // Manejo de pasos
  const handleStart = () => setStep(step + 1);

  const handleFileChange = (index, newFiles) => {
    setOpenModal(false);
    const updatedFiles = [...files];
    updatedFiles[index] = newFiles;
    setFiles(updatedFiles);
    if (newFiles[0]) handleFileUpload(newFiles[0], index);
  };

  const handleProcessSolicitud = () => {
    const requiredDocumentCount = tipoSolicitud === 'regular' ? 6 : 7;
    const allFilesUploaded = files.slice(0, requiredDocumentCount).every(fileArray => fileArray.length > 0);

    if (allFilesUploaded) {
      setCanProceed(true);
      setErrorMessage('');
    } else {
      setCanProceed(false);
      setErrorMessage('Por favor, asegúrate de cargar todos los documentos requeridos antes de proceder.');
    }
  };

  const handleFileUpload = async (file, tipo) => {
    try {
      const response = await uploadDocument(file);
      if (response.fileId) {
        setUploadedFiles(prev => {
          const existingIndex = prev.findIndex(item => item.tipo === tipo);
          if (existingIndex !== -1) {
            const newUploadedFiles = [...prev];
            newUploadedFiles[existingIndex] = { ...newUploadedFiles[existingIndex], fileId: response.fileId };
            return newUploadedFiles;
          } else {
            return [...prev, { fileId: response.fileId, tipo }];
          }
        });
        setFileIds(prevFileIds => {
          const updatedFileIds = [...prevFileIds];
          updatedFileIds[tipo] = response.fileId;
          return updatedFileIds;
        });
      }
    } catch (error) {
      setErrorMessage('Error uploading file. Please try again.');
    }
  };

  const enviarSolicitud = async () => {
    try {
      const solicitudData = {
        estudianteId: user.id,
        tipoSolicitudId: tipoSolicitud === 'regular' ? 1 : 2,
        estadoId: 3,
      };

      const solicitudResult = await submitSolicitud(solicitudData);
      setSolicitudId(solicitudResult);

      await Promise.all(
        uploadedFiles.map(file =>
          confirmUploadDocument(file.fileId, file.tipo, user.id, solicitudResult, user.id)
        )
      );

      setStep(5);
    } catch (error) {
      setErrorMessage('Failed to send request. Please try again.');
    }
  };

  const handleNextStep = async () => {
    handleProcessSolicitud();
    if (canProceed) {
      setStep(4);
    }
  };

  return (
    <Container>
      {step === 1 && <RequerimientosInicio handleStart={handleStart} />}
      {step === 2 && <ConfirmarDatos setStep={setStep} handleAlumnoSelection={setAlumnoData} />}
      {step === 3 && (
        <DocumentosRequeridos
          tipoSolicitud={tipoSolicitud}
          setTipoSolicitud={setTipoSolicitud}
          documentosRequeridos={documentosRequeridos}
          files={files}
          handleFileChange={handleFileChange}
          handleProcessSolicitud={handleProcessSolicitud}
          handleNextStep={handleNextStep}
          errorMessage={errorMessage}
          setStep={setStep}
          canProceed={canProceed}
          alumnoData={alumnoData} // Pass alumnoData to DocumentosRequeridos
        />
      )}
      {step === 4 && <DeclaracionJurada enviarSolicitud={enviarSolicitud} setStep={setStep} />}
      {step === 5 && <SolicitudEnviada solicitudId={solicitudId} setStep={setStep} />}
    </Container>
  );
};

export default IngresarDoc;
