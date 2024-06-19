import React, { useState, useContext } from 'react';
import { Button, Container } from '@cloudscape-design/components';
import UserContext from '../../contexts/UserContext';
import RequerimientosInicio from './steps/RequerimientosInicio';
import ConfirmarDatos from './steps/ConfirmarDatos';
import DocumentosRequeridos from './steps/DocumentosRequeridos';
import DeclaracionJurada from './steps/DeclaracionJurada';
import SolicitudEnviada from './steps/SolicitudEnviada';
import { submitDocumentos } from '../../../../../api';

const IngresarDoc = () => {
  const { user } = useContext(UserContext);
  const [step, setStep] = useState(1);
  const [canProceed, setCanProceed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [documentos, setDocumentos] = useState({});
  const [alumnoData, setAlumnoData] = useState(null);

  const handleStart = () => setStep(2);

  const handleAlumnoSelection = (alumnoInfo) => {
    setAlumnoData(alumnoInfo);
    setStep(3);
  };

  const handleNextStep = async () => {
    if (canProceed) {
      setStep(4);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const enviarSolicitud = async () => {
    try {
      await submitDocumentos(alumnoData.codigo);
      setStep(5);
    } catch (error) {
      setErrorMessage('Failed to send request. Please try again.');
    }
  };

  return (
    <Container>
      {step === 1 && <RequerimientosInicio handleStart={handleStart} />}
      {step === 2 && <ConfirmarDatos setStep={setStep} handleAlumnoSelection={handleAlumnoSelection} />}
      {step === 3 && (
        <DocumentosRequeridos
          documentos={documentos}
          handleNextStep={handleNextStep}
          setErrorMessage={setErrorMessage}
          alumnoData={alumnoData}
          setCanProceed={setCanProceed}
        />
      )}
      {step === 4 && <DeclaracionJurada enviarSolicitud={enviarSolicitud} setStep={setStep} handleBack={handleBack} />}
      {step === 5 && <SolicitudEnviada setStep={setStep} />}
    </Container>
  );
};

export default IngresarDoc;
