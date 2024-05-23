import React, { useState, useEffect } from 'react';
import { ColumnLayout ,Modal, FormField, Input, FileUpload, Button, Box, Select, SpaceBetween, Container, Spinner, Header } from '@cloudscape-design/components';
import { fetchDatosByDni } from '../../../../../../api';

const TesisModal = ({ onClose, alumnoData }) => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loadingDni, setLoadingDni] = useState(false);
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

  const handleFileChange = ({ detail }) => {
    const selectedFile = detail.value[0];
    if (selectedFile.size > 5000000) {
      alert("El tamaño del archivo excede los 5MB.");
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
    setLoadingDni(true);
    const data = await fetchDatosByDni(dni);
    setLoadingDni(false);
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
              constraintText="El tamaño máximo del archivo es de 5MB."
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
              <iframe src={fileUrl} title="Visualizador de PDF" width="100%" height="600px" />
            </Box>
            <Container header={<Header variant="h3">Formulario de Tesis</Header>} fitHeight>
              <FormField label="Facultad">
                <Input value={formData.facultad} readOnly />
              </FormField>
              <FormField label="Escuela">
                <Input value={formData.escuela} readOnly />
              </FormField>
              <FormField label="Título">
                <Input value={formData.titulo} onChange={({ detail }) => setFormData(prev => ({ ...prev, titulo: detail.value }))} />
              </FormField>
              <FormField label="Tipo y Grado">
                <SpaceBetween direction="horizontal" size="m">
                  <Select
                    selectedOption={{ label: formData.tipo, value: formData.tipo }}
                    options={[
                      { label: 'Tesis', value: 'Tesis' },
                      { label: 'Trabajo de investigación', value: 'Trabajo de investigación' }
                    ]}
                    onChange={({ detail }) => setFormData(prev => ({ ...prev, tipo: detail.selectedOption.value }))}
                  />
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
                </SpaceBetween>
              </FormField>
              <FormField label="Año">
                <Input value={formData.year} onChange={({ detail }) => setFormData(prev => ({ ...prev, year: detail.value }))} type="number" maxLength={4} />
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
                        <Input value={autor.nombre} readOnly />
                      </FormField>
                      <FormField label="Apellidos">
                        <Input value={autor.apellido} readOnly />
                      </FormField>
                    </SpaceBetween>
                    <SpaceBetween direction="horizontal" size="m">
                      <FormField label="DNI">
                        <Input value={autor.dni} readOnly={index === 0} onChange={({ detail }) => {
                          handleChange('dni', detail.value, index);
                          if (detail.value.length === 8) {
                            fetchAndSetDataByDni(detail.value, index, 'autores');
                          }
                        }} />
                      </FormField>
                      <FormField label="Teléfono">
                        <Input value={autor.telefono} readOnly={autor.telefono !== ''} onChange={({ detail }) => handleChange('telefono', detail.value, index)} />
                      </FormField>
                    </SpaceBetween>
                    <FormField label="Email UNMSM">
                      <Input value={autor.email} readOnly={autor.email !== ''} onChange={({ detail }) => handleChange('email', detail.value, index)} />
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
                        <Input value={asesor.nombre} readOnly />
                      </FormField>
                      <FormField label="Apellidos">
                        <Input value={asesor.apellido} readOnly />
                      </FormField>
                    </SpaceBetween>
                    <SpaceBetween direction="horizontal" size="m">
                      <FormField label="DNI">
                        <Input value={asesor.dni} onChange={({ detail }) => {
                          handleChange('dni', detail.value, index, 'asesores');
                          if (detail.value.length === 8) {
                            fetchAndSetDataByDni(detail.value, index, 'asesores');
                          }
                        }} />
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
                      <Input value={asesor.orcid} onChange={({ detail }) => handleChange('orcid', detail.value, index, 'asesores')} />
                    </FormField>
                  </Container>
                ))}
                <Button onClick={addAdvisor} disabled={formData.asesores.length >= 2}>Agregar Asesor</Button>
              </Container>
            </Container>
          </ColumnLayout>
        )}
      </SpaceBetween>
    </Modal>
  );
};

export default TesisModal;
