import React, { useState, useEffect } from 'react';
import { Modal, FormField, Input, FileUpload, Button, Box, Select, SpaceBetween, Container, Spinner, Header, ColumnLayout } from '@cloudscape-design/components';
import { fetchDatosByDni } from '../../../../../../api';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

const TesisModal = ({ onClose, alumnoData }) => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loadingDni, setLoadingDni] = useState({ autores: {}, asesores: {} });
  const [numPages, setNumPages] = useState(null);
  const [formData, setFormData] = useState({
    facultad: alumnoData?.facultad || '',
    escuela: alumnoData?.escuela || '',
    titulo: '',
    tipo: 'Tesis',
    grado: 'Bachiller',
    year: '',
    autores: [{
      nombre: alumnoData?.nombre || '',
      apellido: alumnoData?.apellidos || '',
      dni: alumnoData?.dni || '',
      telefono: alumnoData?.telefono || '',
      email: alumnoData?.email || ''
    }],
    asesores: [{
      dni: '',
      nombre: '',
      apellido: '',
      titulo: 'Magister',
      orcid: ''
    }]
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

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

  const handleChange = (key, value, index, type = 'autores') => {
    const newEntries = [...formData[type]];
    newEntries[index][key] = value;
    setFormData(prev => ({ ...prev, [type]: newEntries }));
  };

  const handleSubmit = () => {
    if (formData.facultad && formData.escuela && formData.titulo && formData.year) {
      // onSubmit({ file, formData }); // Aquí iría la lógica para enviar los datos
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
    setLoadingDni(prev => ({ ...prev, [type]: { ...prev[type], [index]: true } }));
    const data = await fetchDatosByDni(dni);
    setLoadingDni(prev => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
    if (data) {
      handleChange('nombre', data.nombre || '', index, type);
      handleChange('apellido', data.apellido || '', index, type);
      if (type === 'autores') {
        handleChange('telefono', data.telefono || '', index, type);
        handleChange('email', data.email || '', index, type);
      } else if (type === 'asesores') {
        handleChange('orcid', data.orcid || '', index, type);
      }
    }
  };

  const addAuthor = () => {
    if (formData.autores.length < 2) {
      setFormData(prev => ({
        ...prev,
        autores: [...prev.autores, { nombre: '', apellido: '', dni: '', telefono: '', email: '' }]
      }));
    }
  };

  const removeAuthor = (index) => {
    if (formData.autores.length > 1) {
      const newAutores = formData.autores.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, autores: newAutores }));
    }
  };

  const addAdvisor = () => {
    if (formData.asesores.length < 2) {
      setFormData(prev => ({
        ...prev,
        asesores: [...prev.asesores, { nombre: '', apellido: '', dni: '', titulo: 'Magister', orcid: '' }]
      }));
    }
  };

  const removeAdvisor = (index) => {
    if (formData.asesores.length > 1) {
      const newAsesores = formData.asesores.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, asesores: newAsesores }));
    }
  };

  const handleDniChange = (detail, index, type) => {
    handleChange('dni', detail.value, index, type);
    if (detail.value.length === 8) {
      fetchAndSetDataByDni(detail.value, index, type);
    } else {
      handleChange('nombre', 'Cargando...', index, type);
      handleChange('apellido', 'Cargando...', index, type);
      if (type === 'autores') {
        handleChange('telefono', 'Cargando...', index, type);
        handleChange('email', 'Cargando...', index, type);
      } else if (type === 'asesores') {
        handleChange('orcid', 'Cargando...', index, type);
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
      header="Subir Tesis"
      size={showForm ? 'max' : 'small'}
      footer={
        <Box float='right'>
          <SpaceBetween direction="horizontal" size="m">
            <Button onClick={handleClose} variant="secondary">Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!file || !formData.facultad || !formData.escuela || !formData.titulo || !formData.year}>Guardar</Button>
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
            <Box width="100%">
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
              >
                {Array.from(new Array(Math.min(numPages, 10)), (el, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
              </Document>
            </Box>
            <div style={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              <Container header={<Header variant="h3">Formulario de Tesis</Header>}>
                <FormField label="Facultad">
                  <Input value={formData.facultad} readOnly />
                </FormField>
                <FormField label="Escuela">
                  <Input value={formData.escuela} readOnly />
                </FormField>
                <FormField label="Título">
                  <Input value={formData.titulo} onChange={({ detail }) => setFormData(prev => ({ ...prev, titulo: detail.value }))} />
                </FormField>
                <ColumnLayout columns={2}>
                  <FormField label="Tipo">
                    <Select
                      selectedOption={{ label: formData.tipo, value: formData.tipo }}
                      options={[
                        { label: 'Tesis', value: 'Tesis' },
                        { label: 'Trabajo de investigación', value: 'Trabajo de investigación' }
                      ]}
                      onChange={({ detail }) => setFormData(prev => ({ ...prev, tipo: detail.selectedOption.value }))}
                    />
                  </FormField>
                  <FormField label="Grado">
                    <Select
                      selectedOption={{ label: formData.grado, value: formData.grado }}
                      options={[
                        { label: 'Bachiller', value: 'Bachiller' },
                        { label: 'Magister', value: 'Magister' },
                        { label: 'Doctor', value: 'Doctor' },
                        { label: 'Segunda Esp.', value: 'Segunda Esp.' },
                        { label: 'Título Prof.', value: 'Título Prof.' }
                      ]}
                      onChange={({ detail }) => setFormData(prev => ({ ...prev, grado: detail.selectedOption.value }))}
                    />
                  </FormField>
                </ColumnLayout>
                <FormField label="Año">
                  <Select
                    selectedOption={{ label: formData.year, value: formData.year }}
                    options={years.map(year => ({ label: year.toString(), value: year.toString() }))}
                    onChange={({ detail }) => setFormData(prev => ({ ...prev, year: detail.selectedOption.value }))}
                  />
                </FormField>
                <Container header={<Header variant="h4">Datos del Documento</Header>}>
                  {formData.autores.map((autor, index) => (
                    <Container
                      key={index}
                      header={
                        <SpaceBetween direction="horizontal" size="m">
                          <Header variant="h5">Datos del Autor {index + 1}</Header>
                          {index > 0 && (
                            <Button onClick={() => removeAuthor(index)} variant="icon" iconName="close" ariaLabel="Eliminar autor" />
                          )}
                        </SpaceBetween>
                      }
                    >
                      <SpaceBetween direction="horizontal" size="m">
                        <FormField label="Nombres">
                          <Input value={loadingDni.autores[index] ? 'Cargando...' : autor.nombre} readOnly />
                        </FormField>
                        <FormField label="Apellidos">
                          <Input value={loadingDni.autores[index] ? 'Cargando...' : autor.apellido} readOnly />
                        </FormField>
                      </SpaceBetween>
                      <SpaceBetween direction="horizontal" size="m">
                        <FormField label="DNI">
                          <Input
                            value={autor.dni}
                            readOnly={index === 0}
                            onChange={({ detail }) => handleDniChange(detail, index, 'autores')}
                            type="number"
                          />
                        </FormField>
                        <FormField label="Teléfono">
                          <Input
                            value={loadingDni.autores[index] ? 'Cargando...' : autor.telefono}
                            readOnly={autor.telefono !== ''}
                            onChange={({ detail }) => handleChange('telefono', detail.value, index)}
                            type="tel"
                          />
                        </FormField>
                      </SpaceBetween>
                      <FormField label="Email UNMSM">
                        <Input
                          value={loadingDni.autores[index] ? 'Cargando...' : autor.email}
                          readOnly={autor.email !== ''}
                          onChange={({ detail }) => handleChange('email', detail.value, index)}
                          type="email"
                        />
                      </FormField>
                    </Container>
                  ))}
                  <Button onClick={addAuthor} disabled={formData.autores.length >= 2}>Agregar Autor</Button>
                </Container>
                <Container header={<Header variant="h4">Datos del Asesor</Header>}>
                  {formData.asesores.map((asesor, index) => (
                    <Container
                      key={index}
                      header={
                        <SpaceBetween direction="horizontal" size="m">
                          <Header variant="h5">Datos del Asesor {index + 1}</Header>
                          {index > 0 && (
                            <Button onClick={() => removeAdvisor(index)} variant="icon" iconName="close" ariaLabel="Eliminar asesor" />
                          )}
                        </SpaceBetween>
                      }
                    >
                      <SpaceBetween direction="horizontal" size="m">
                        <FormField label="Nombres">
                          <Input value={loadingDni.asesores[index] ? 'Cargando...' : asesor.nombre} readOnly />
                        </FormField>
                        <FormField label="Apellidos">
                          <Input value={loadingDni.asesores[index] ? 'Cargando...' : asesor.apellido} readOnly />
                          </FormField>
                        </SpaceBetween>
                      <SpaceBetween direction="horizontal" size="m">
                        <FormField label="DNI">
                          <Input
                            value={asesor.dni}
                            onChange={({ detail }) => handleDniChange(detail, index, 'asesores')}
                            type="number"
                          />
                        </FormField>
                        <FormField label="Título">
                          <Select
                            selectedOption={{ label: asesor.titulo, value: asesor.titulo }}
                            options={[
                              { label: 'Magister', value: 'Magister' },
                              { label: 'Doctor', value: 'Doctor' }
                            ]}
                            onChange={({ detail }) => handleChange('titulo', detail.selectedOption.value, index, 'asesores')}
                          />
                        </FormField>
                      </SpaceBetween>
                      <FormField label="URL de ORCID">
                        <Input
                          value={loadingDni.asesores[index] ? 'Cargando...' : asesor.orcid}
                          onChange={({ detail }) => handleChange('orcid', detail.value, index, 'asesores')}
                        />
                      </FormField>
                    </Container>
                  ))}
                  <Button onClick={addAdvisor} disabled={formData.asesores.length >= 2}>Agregar Asesor</Button>
                </Container>
              </Container>
            </div>
          </ColumnLayout>
        )}
      </SpaceBetween>
    </Modal>
  );
};

export default TesisModal;
