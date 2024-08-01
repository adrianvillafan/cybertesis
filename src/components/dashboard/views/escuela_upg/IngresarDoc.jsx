import React, { useState, useContext } from 'react';
import { Container } from '@cloudscape-design/components';
import UserContext from '../../contexts/UserContext';
import RequerimientosInicio from './steps/RequerimientosInicio';
import ConfirmarDatos from './steps/ConfirmarDatos';
import DocumentosRequeridos from './steps/DocumentosRequeridos';
import DeclaracionJurada from './steps/DeclaracionJurada';
import SolicitudEnviada from './steps/SolicitudEnviada';

const IngresarDoc = () => {
  const { user } = useContext(UserContext);
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [documentos, setDocumentos] = useState({});
  const [alumnoData, setAlumnoData] = useState(null);

  const handleStart = () => setStep(2);

  const handleAlumnoSelection = async (alumnoInfo) => {
    setAlumnoData(alumnoInfo);
  };

  const handleNextStep = () => {
      setStep(4);
  };

  console.log('documentos:', documentos.id);


  return (
    <Container>
      {step === 1 && <RequerimientosInicio handleStart={handleStart} />}
      {step === 2 && <ConfirmarDatos setStep={setStep} handleAlumnoSelection={handleAlumnoSelection} setDocumentos={setDocumentos} />}
      {step === 3 && (
        <DocumentosRequeridos
          setStep={setStep}
          documentos={documentos}
          handleNextStep={handleNextStep}
          setErrorMessage={setErrorMessage}
          alumnoData={alumnoData}
          setDocumentos={setDocumentos}
        />
      )}
      {step === 4 && <DeclaracionJurada setStep={setStep} documentos={documentos} />}
      {step === 5 && <SolicitudEnviada setStep={setStep} documentoId={documentos.id}/>}
    </Container>
  );
};

export default IngresarDoc;
