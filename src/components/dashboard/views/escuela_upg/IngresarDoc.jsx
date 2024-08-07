import React, { useState, useContext } from 'react';
import { Container, ExpandableSection, Box, Link } from '@cloudscape-design/components';
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
    <Container
      footer={
        step === 1 ? (
          <ExpandableSection header="Requisitos y Descargables" variant="footer">
            <div style={{ textAlign: 'left', width: '50%' }}>
        <p className="color-y"><b>REQUISITOS</b></p>
        <Box>
        <ul>
          <li>El documento de la tesis o trabajo de investigación.</li>
          <li>Los documentos añadidos.</li>
        </ul>
        </Box>
        <div  style={{ textAlign: 'left', width: '100%' }}>
          <p className="color-y"><b>DESCARGABLES</b></p>
          <ul className="descargable">
            <li><Link href="https://drive.google.com/file/d/1bMIPHJhO8_vLGoCQNM-elyye4qKh9X0o/view?usp=sharing" external>Guía de Recepción de los archivos digitales para la publicación en Cybertesis</Link></li>
            <li><Link href="archivos/documentos/recepcion_investigacion/ORCID_ID.pdf" external>Guía de creación de perfil ORCID.</Link></li>
            <li><Link href="archivos/documentos/recepcion_investigacion/guia_metadatos_complementarios.pdf" external>Guía de usos y modelos de metadatos complementarios.</Link></li>
            <li><Link href="https://drive.google.com/drive/folders/1hlFUyaKZX_QdTnN4vLhODo1E0gyd2pzN?usp=sharing" external>Formatos de hojas de metadatos</Link></li>
            <li><Link href="archivos/documentos/recepcion_investigacion/formato_fe_errata.docx" external>Fe de erratas.</Link></li>
            <li><Link href="archivos/documentos/recepcion_investigacion/autorizacion.docx" external>Autorización para el depósito de obra en el repositorio de Cybertesis UNMSM.</Link></li>
            <li><Link href="archivos/documentos/recepcion_investigacion/postergacion.docx" external>Solicitud de postergación de publicación de documento de Cybertesis.</Link></li>
            <li><Link href="archivos/documentos/recepcion_investigacion/ocde.pdf" external>Tablas de disciplinas OCDE.</Link></li>
            <li><Link href="https://drive.google.com/drive/folders/1WysFqaDeIKR90Bg0gbEpFqzNkz-eO_Pv?usp=sharing" external>Ejemplos de carátulas.</Link></li>
            <li><Link href="https://drive.google.com/file/d/1Dd8zkcwL_DU4geR85tEeuDdySpZjPqB_/view?usp=sharing" external>Certificado de similitud</Link></li>
          </ul>
        </div>
      </div>
          </ExpandableSection>
        ) : null
      }
    >
      {step === 1 && <RequerimientosInicio handleStart={handleStart} />}
      {step === 2 && (
        <ConfirmarDatos
          setStep={setStep}
          handleAlumnoSelection={handleAlumnoSelection}
          setDocumentos={setDocumentos}
        />
      )}
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
      {step === 5 && <SolicitudEnviada setStep={setStep} documentoId={documentos.id} />}
    </Container>
  );
};

export default IngresarDoc;
