import React, { useState, useEffect, useContext } from 'react';
import { Button, Box, Container, Header, SpaceBetween, Link, Select, FileUpload, FormField } from '@cloudscape-design/components';
import UserContext from '../../contexts/UserContext';

const CreateRequest = () => {
  const { user } = useContext(UserContext);

  const [tipoSolicitud, setTipoSolicitud] = useState('regular');   // Aquí agregamos el estado para el tipo de solicitud
  const [step, setStep] = useState(1);  // Controla el paso actual del formulario de solicitud
  const [documentosCargados, setDocumentosCargados] = useState([]);
  const [canProceed, setCanProceed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const documentosRequeridos = {
    regular: [
      { id: 1, nombre: 'Tesis' },
      { id: 2, nombre: 'Acta de Sustentación' },
      { id: 3, nombre: 'Certificado de Similitud' },
      { id: 4, nombre: 'Autorización para el depósito de obra en Cybertesis' },
      { id: 5, nombre: 'Hoja de Metadatos' },
      { id: 6, nombre: 'Reporte de Turnitin' }
    ],
    postergacion: [
      { id: 1, nombre: 'Tesis' },
      { id: 2, nombre: 'Acta de Sustentación' },
      { id: 3, nombre: 'Certificado de Similitud' },
      { id: 4, nombre: 'Autorización para el depósito de obra en Cybertesis' },
      { id: 5, nombre: 'Hoja de Metadatos' },
      { id: 6, nombre: 'Reporte de Turnitin' },
      { id: 7, nombre: 'Solicitud de Postergación' }
    ]
  };

  const [files, setFiles] = useState(Array.from({ length: documentosRequeridos[tipoSolicitud].length + 1 }, () => []));

  const handleStart = () => {
    setStep(step + 1);  // Avanzar al siguiente paso
  };

  const handleFileChange = (index, newFiles) => {
    const updatedFiles = [...files];
    updatedFiles[index] = newFiles;
    setFiles(updatedFiles);
  };

  const handleProcessSolicitud = () => {
    const requiredDocumentCount = tipoSolicitud === 'regular' ? 6 : 7;
    console.log(requiredDocumentCount)
    const allFilesUploaded = files.slice(0, requiredDocumentCount).every(fileArray => fileArray.length > 0);
  
    if (allFilesUploaded) {
      console.log('Todos los documentos están cargados.');
      setCanProceed(true);
      setErrorMessage('');  // Limpia el mensaje de error si todos los documentos están cargados
    } else {
      console.log('Faltan documentos por cargar.');
      setCanProceed(false);
      setErrorMessage('Por favor, asegúrate de cargar todos los documentos requeridos antes de proceder.');  // Establece el mensaje de error
    }
  };
  


  // Función modificada para abrir el modal
  const handleNextStep = async () => {
    handleProcessSolicitud();
    if (canProceed) {
      setStep(4);
    }
  };

  // Función para enviar la solicitud
  const enviarSolicitud = () => {
    console.log('Enviando solicitud...');
    // Aquí se enviarían los datos al backend
    setStep(5); // Avanzar al paso final
  }




  return (
    <Container>
      {step === 1 && (
        <Box margin={{ vertical: 'm' }}>
          <Header variant="h1">Requerimientos para iniciar la solicitud</Header>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. IMPORTANTE: Leer los requerimientos necesarios para evitar que su solicitud sea OBSERVADA. Asegurarse de tener todos los documentos necesarios para realizar la solicitud.</p>
          <Link href="/path/to/document.pdf" external={true}>¿Aún no tienes los documentos? Descarga aquí.</Link>
          <Button variant="primary" onClick={handleStart}>Iniciar Solicitud</Button>
        </Box>
      )}

      {step === 2 && (
        <Box>
          <Header variant="h2">Paso 1: Confirmar Datos</Header>
          <Box direction="row" padding={{ vertical: 'm', horizontal: 'l' }} alignItems="center">
            <img src="/path/to/user-image.jpg" alt="Foto del usuario" style={{ width: 100, height: 100, marginRight: 'l' }} />
            <div>
              <p>Nombre: Usuario Ejemplo</p>
              <p>Código: 123456</p>
              <p>Facultad: Ciencias</p>
              <p>Programa: Ingeniería</p>
              <p>Especialidad: Sistemas</p>
            </div>
          </Box>
          <Box>
            <Button onClick={() => setStep(1)}>Cancelar</Button>
            <Button onClick={() => setStep(3)}>Siguiente</Button>
          </Box>
        </Box>
      )}

      {step === 3 && tipoSolicitud && (
        <div>
          <FormField label="Tipo de Solicitud">
            <Select

              options={[
                { label: 'Regular', value: 'regular' },
                { label: 'Postergación', value: 'postergacion' }
              ]}
              selectedOption={
                // Encuentra la opción que corresponde al valor actual de tipoSolicitud
                { label: tipoSolicitud === 'regular' ? 'Regular' : 'Postergación', value: tipoSolicitud }
              }
              onChange={({ detail }) => {setTipoSolicitud(detail.selectedOption.value); setCanProceed(false)}}
            />
          </FormField>
          <FormField
            label="Documentos Requeridos"
            constraintText="Tamaño máximo de archivo: 5MB"
          >
            {documentosRequeridos[tipoSolicitud].map((doc, index) => (
              <div key={doc.id}>
                <label>{doc.nombre}</label>
                <FileUpload
                  value={files[index]}
                  onChange={({ detail }) => {handleFileChange(index, detail.value);setCanProceed(false) }}
                  accept="application/pdf"
                  i18nStrings={{
                    uploadButtonText: multiple => multiple ? "Seleccionar archivos" : "Seleccionar archivo",
                    dropzoneText: multiple => multiple ? "Arrastre archivos aquí" : "Arrastre archivo aquí",
                    removeFileAriaLabel: index => `Eliminar archivo ${index + 1}`,
                    limitShowFewer: "Mostrar menos",
                    limitShowMore: "Mostrar más",
                    errorIconAriaLabel: "Error"
                  }}
                  showFileLastModified
                  showFileSize
                />
              </div>
            ))}
          </FormField>
          <SpaceBetween size="l" direction="horizontal">
            <Button onClick={() => setStep(2)}>Atrás</Button>
            <Button onClick={handleProcessSolicitud} variant="primary">
              Procesar Solicitud
            </Button>
            <Button onClick={handleNextStep} disabled={!canProceed}>
              Siguiente
            </Button>
          </SpaceBetween>
          {errorMessage && (
            <Box margin={{ top: 's' }} color="red">
              <p style={{ color: 'red' }}>{errorMessage}</p>
            </Box>
          )}
        </div>
      )}



      {step === 4 && (
        <Box>
          <Header variant="h2">Paso 3: Confirmar Documentos</Header>
          <Box>
            {documentosCargados.map(doc => (
              <Box key={doc.id} padding={{ vertical: 'xxs' }}>
                <p>{doc.nombre}</p>
                <Button>Ver Documento</Button>
              </Box>
            ))}
          </Box>
          <Box>
            <Button onClick={() => setStep(3)}>Atrás</Button>
            <Button onClick={() => enviarSolicitud()}>Enviar</Button>
          </Box>
        </Box>
      )}

      {step === 5 && (
        <Box>
          <Header variant="h2">Solicitud Enviada</Header>
          <p>Su solicitud ha sido enviada con éxito. Número de solicitud: XYZ123</p>
          <Button onClick={() => setStep(1)}>Aceptar</Button>
        </Box>
      )}



    </Container>
  );
};

export default CreateRequest;
