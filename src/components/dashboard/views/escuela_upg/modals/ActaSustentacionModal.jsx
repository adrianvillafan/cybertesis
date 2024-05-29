import React, { useState, useEffect } from 'react';
import { Modal, FileUpload, FormField, Input, Button, Box, Select, SpaceBetween, Container, Header, ColumnLayout } from '@cloudscape-design/components';
import { fetchDatosByDni } from '../../../../../../api';
import { Document, Page, pdfjs } from 'react-pdf';
import 'pdfjs-dist/web/pdf_viewer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Configura pdfjs para usar el worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ActaSustentacionModal = ({ onClose, asesores, onSave }) => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loadingDni, setLoadingDni] = useState({ presidente: false, miembros: {} });
  const [numPages, setNumPages] = useState(null);
  const [formData, setFormData] = useState({
    presidente: { nombre: '', apellido: '', dni: '', grado: '' },
    miembros: [{ nombre: '', apellido: '', dni: '', grado: '' }, { nombre: '', apellido: '', dni: '', grado: '' }],
    asesores: asesores.map(asesor => ({
      nombre: asesor.nombre,
      apellido: asesor.apellido,
      dni: asesor.dni,
      titulo: asesor.titulo,
      orcid: asesor.orcid,
    }))
  });

  const grados = [
    { label: 'Doctor', value: 'Doctor' },
    { label: 'Magister', value: 'Magister' }
  ];

  const isFormComplete = () => {
    const requiredFields = [
      formData.presidente.nombre,
      formData.presidente.apellido,
      formData.presidente.dni,
      formData.presidente.grado,
      ...formData.miembros.flatMap(miembro => [miembro.nombre, miembro.apellido, miembro.dni, miembro.grado]),
      ...formData.asesores.flatMap(asesor => [asesor.nombre, asesor.apellido, asesor.dni, asesor.titulo, asesor.orcid])
    ];
    return requiredFields.every(field => field && field.trim().length > 0);
  };

  const handleFileChange = ({ detail }) => {
    const selectedFile = detail.value[0];
    if (selectedFile.size > 15000000) {
      alert("El tamaño del archivo excede los 15MB.");
    } else {
      setFile(selectedFile);
      setShowForm(!!selectedFile);
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileContent = event.target.result;
          setFileUrl(fileContent);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const handleChange = (key, value, index, type = 'miembros') => {
    const newEntries = [...formData[type]];
    newEntries[index][key] = value;
    setFormData(prev => ({ ...prev, [type]: newEntries }));
  };

  const handleSubmit = () => {
    if (isFormComplete()) {
      onSave({formData, fileUrl});
      onClose();
    } else {
      alert("Todos los campos deben estar completos.");
    }
  };

  const handleClose = () => {
    setFile(null);
    setShowForm(false);
    onClose();
  };

  const fetchAndSetDataByDni = async (dni, index, type) => {
    if (type === 'presidente') {
      setLoadingDni(prev => ({ ...prev, presidente: true }));
    } else {
      setLoadingDni(prev => ({ ...prev, miembros: { ...prev.miembros, [index]: true } }));
    }

    const data = await fetchDatosByDni(dni);

    if (type === 'presidente') {
      setLoadingDni(prev => ({ ...prev, presidente: false }));
      setFormData(prev => ({
        ...prev,
        presidente: {
          ...prev.presidente,
          nombre: data.nombre || '',
          apellido: data.apellido || '',
        }
      }));
    } else {
      setLoadingDni(prev => ({ ...prev, miembros: { ...prev.miembros, [index]: false } }));
      handleChange('nombre', data.nombre || '', index, 'miembros');
      handleChange('apellido', data.apellido || '', index, 'miembros');
    }
  };

  const addMember = () => {
    if (formData.miembros.length < 3) {
      setFormData(prev => ({
        ...prev,
        miembros: [...prev.miembros, { nombre: '', apellido: '', dni: '', grado: '' }]
      }));
    }
  };

  const removeMember = (index) => {
    if (formData.miembros.length > 2) {
      const newMiembros = formData.miembros.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, miembros: newMiembros }));
    }
  };

  const handleDniChange = (detail, index, type) => {
    const newValue = detail.value.replace(/\D/g, '').slice(0, 8);
    if (type === 'presidente') {
      setFormData(prev => ({
        ...prev,
        presidente: {
          ...prev.presidente,
          dni: newValue,
        }
      }));
      if (newValue.length === 8) {
        fetchAndSetDataByDni(newValue, null, 'presidente');
      } else {
        setFormData(prev => ({
          ...prev,
          presidente: {
            ...prev.presidente,
            nombre: 'Cargando...',
            apellido: 'Cargando...',
          }
        }));
      }
    } else {
      handleChange('dni', newValue, index, 'miembros');
      if (newValue.length === 8) {
        fetchAndSetDataByDni(newValue, index, 'miembros');
      } else {
        handleChange('nombre', 'Cargando...', index, 'miembros');
        handleChange('apellido', 'Cargando...', index, 'miembros');
      }
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    console.log('Archivo cargado satisfactoriamente');
  };

  const onDocumentLoadError = () => {
    console.log('Error al cargar el archivo');
  };

  return (
    <Modal
      onDismiss={handleClose}
      visible={true}
      closeAriaLabel="Cerrar modal"
      header="Subir Acta de Sustentación"
      size={showForm ? 'max' : 'small'}
      footer={
        <Box float='right'>
          <SpaceBetween direction="horizontal" size="m">
            <Button onClick={handleClose} variant="secondary">Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!isFormComplete()}>Guardar</Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween direction="vertical" size="xl" content="div">
        {!showForm ? (
          <Box display="flex" justifyContent="center">
            <FileUpload
              accept="application/pdf"
              value={file ? [file] : []}
              onChange={handleFileChange}
              constraintText="El tamaño máximo del archivo es de 15MB."
              i18nStrings={{
                dropzoneText: () => 'Arrastra los archivos aquí o haz clic para seleccionar',
                uploadButtonText: () => 'Seleccionar archivo',
                removeFileAriaLabel: (fileIndex) => `Eliminar archivo ${fileIndex}`,
              }}
            />
          </Box>
        ) : (
          <ColumnLayout columns={2} variant="default">
            <div style={{ height: 'calc(75vh)', overflowY: 'auto' }}>
              <Box width="100%" style={{ height: 'calc(75vh)', overflowY: 'auto' }}>
                {fileUrl && (
                  <Document
                    file={fileUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                  >
                    {Array.from(new Array(Math.min(numPages, 15)), (el, index) => (
                      <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                    ))}
                  </Document>
                )}
              </Box>
            </div>
            <div style={{ height: 'calc(75vh)', overflowY: 'auto', padding: '0px 15px 0px 0px' }}>
              <SpaceBetween direction="vertical" size="l">
                <Container header={<Header variant="h3">Formulario de Acta de Sustentación</Header>}>
                  <SpaceBetween direction="vertical" size="s">
                    <Header variant="h5">Presidente</Header>
                    <ColumnLayout columns={2}>
                      <FormField label="Nombres">
                        <Input
                          value={loadingDni.presidente ? 'Cargando...' : formData.presidente.nombre}
                          readOnly={!loadingDni.presidente && Boolean(formData.presidente.nombre)}
                        />
                      </FormField>
                      <FormField label="Apellidos">
                        <Input
                          value={loadingDni.presidente ? 'Cargando...' : formData.presidente.apellido}
                          readOnly={!loadingDni.presidente && Boolean(formData.presidente.apellido)}
                        />
                      </FormField>
                    </ColumnLayout>
                    <ColumnLayout columns={2}>
                      <FormField label="DNI">
                        <Input
                          value={formData.presidente.dni}
                          onChange={({ detail }) => handleDniChange(detail, null, 'presidente')}
                          type="text"  // Usa "text" en lugar de "numeric" para que maxLength y pattern funcionen
                          maxLength="8"
                          pattern="\d{1,8}"
                        />
                      </FormField>
                      <FormField label="Grado">
                        <Select
                          selectedOption={{ label: formData.presidente.grado, value: formData.presidente.grado }}
                          options={grados}
                          onChange={({ detail }) => setFormData(prev => ({
                            ...prev,
                            presidente: {
                              ...prev.presidente,
                              grado: detail.selectedOption.value
                            }
                          }))}
                        />
                      </FormField>
                    </ColumnLayout>
                  </SpaceBetween>
                </Container>

                {formData.miembros.map((miembro, index) => (
                  <Container
                    key={index}
                    header={
                      <Header variant="h5" actions={
                        (index > 1 &&
                          <Button onClick={() => removeMember(index)} variant="icon" iconName="close" ariaLabel="Eliminar miembro" />
                        ) || (
                          index === 1 &&
                          <Button onClick={addMember} disabled={formData.miembros.length >= 3}>Agregar Miembro</Button>)
                      }> Miembro del Jurado {index + 1}
                      </Header>
                    }
                  >
                    <ColumnLayout columns={2}>
                      <FormField label="Nombres">
                        <Input
                          value={loadingDni.miembros[index] ? 'Cargando...' : miembro.nombre}
                          readOnly={!loadingDni.miembros[index] && Boolean(miembro.nombre)}
                        />
                      </FormField>
                      <FormField label="Apellidos">
                        <Input
                          value={loadingDni.miembros[index] ? 'Cargando...' : miembro.apellido}
                          readOnly={!loadingDni.miembros[index] && Boolean(miembro.apellido)}
                        />
                      </FormField>
                    </ColumnLayout>
                    <ColumnLayout columns={2}>
                      <FormField label="DNI">
                        <Input
                          value={miembro.dni}
                          onChange={({ detail }) => handleDniChange(detail, index, 'miembros')}
                          type="text"  // Usa "text" en lugar de "numeric" para que maxLength y pattern funcionen
                          maxLength="8"
                          pattern="\d{1,8}"
                        />
                      </FormField>
                      <FormField label="Grado">
                        <Select
                          selectedOption={{ label: miembro.grado, value: miembro.grado }}
                          options={grados}
                          onChange={({ detail }) => handleChange('grado', detail.selectedOption.value, index, 'miembros')}
                        />
                      </FormField>
                    </ColumnLayout>
                  </Container>
                ))}

                {formData.asesores.map((asesor, index) => (
                  <Container
                    key={index}
                    header={
                      <Header variant="h5">Datos del Asesor {index + 1}</Header>
                    }
                  >
                    <ColumnLayout columns={2}>
                      <FormField label="Nombres">
                        <Input value={asesor.nombre} readOnly />
                      </FormField>
                      <FormField label="Apellidos">
                        <Input value={asesor.apellido} readOnly />
                      </FormField>
                    </ColumnLayout>
                    <ColumnLayout columns={2}>
                      <FormField label="DNI">
                        <Input value={asesor.dni} readOnly />
                      </FormField>
                      <FormField label="Título">
                        <Input value={asesor.titulo} readOnly />
                      </FormField>
                    </ColumnLayout>
                    <ColumnLayout>
                      <FormField label="URL de ORCID">
                        <Input value={asesor.orcid} readOnly />
                      </FormField>
                    </ColumnLayout>
                  </Container>
                ))}

              </SpaceBetween>
            </div>
          </ColumnLayout>
        )}
      </SpaceBetween>
    </Modal>
  );
};

export default ActaSustentacionModal;
