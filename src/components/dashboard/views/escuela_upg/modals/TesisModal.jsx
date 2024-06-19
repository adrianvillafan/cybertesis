import React, { useState, useEffect } from 'react';
import ModalTwoCol from './ModalTwoCol';
import { Button, FormField, Input, Select, SpaceBetween, Container, Header, ColumnLayout, Box, StatusIndicator } from '@cloudscape-design/components';
import { fetchDatosByDni, fetchDatosOrcid } from '../../../../../../api';

const TesisModal = ({ onClose, alumnoData, onSave, readOnly, fileUrl, formData: initialFormData }) => {
  const [file, setFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loadingDni, setLoadingDni] = useState({ autores: {}, asesores: {} });
  const [orcidData, setOrcidData] = useState({ autores: {}, asesores: {} });
  const [formData, setFormData] = useState({
    facultad: alumnoData?.facultad || '',
    escuela: alumnoData?.escuela || '',
    titulo: initialFormData?.titulo || '',
    tipo: initialFormData?.tipo || '',
    grado: initialFormData?.grado || '',
    year: initialFormData?.year || '',
    autores: initialFormData?.autores || [{
      nombre: alumnoData?.nombre || '',
      apellido: alumnoData?.apellidos || '',
      dni: alumnoData?.dni || '',
      telefono: alumnoData?.telefono || '',
      email: alumnoData?.email || '',
      orcid: '',
      orcidConfirmed: false
    }],
    asesores: initialFormData?.asesores || [{
      dni: '',
      nombre: '',
      apellido: '',
      titulo: '',
      orcid: '',
      orcidConfirmed: false
    }]
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const isFormComplete = () => {
    const requiredFields = [
      formData.facultad,
      formData.escuela,
      formData.titulo,
      formData.tipo,
      formData.grado,
      formData.year,
      ...formData.autores.flatMap(autor => [
        String(autor.nombre),
        String(autor.apellido),
        String(autor.dni),
        String(autor.telefono),
        String(autor.email),
        String(autor.orcid)
      ]),
      ...formData.asesores.flatMap(asesor => [
        String(asesor.nombre),
        String(asesor.apellido),
        String(asesor.dni),
        String(asesor.titulo),
        String(asesor.orcid)
      ])
    ];

    return requiredFields.every(field => typeof field === 'string' && field.trim().length > 0);
  };

  const fetchAndSetDataByDni = async (dni, index, type) => {
    setLoadingDni(prev => ({ ...prev, [type]: { ...prev[type], [index]: true } }));
    try {
      const data = await fetchDatosByDni(dni);
      handleChange('nombre', data.nombre || '', index, type);
      handleChange('apellido', data.apellido || '', index, type);
      if (type === 'autores') {
        handleChange('telefono', data.telefono || '', index, type);
        handleChange('email', data.email || '', index, type);
      }
    } catch (error) {
      console.error('Error al obtener datos del DNI:', error);
    } finally {
      setLoadingDni(prev => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
    }
  };

  const fetchAndSetDataByOrcid = async (orcid, index, type) => {
    try {
      const data = await fetchDatosOrcid(orcid);
      setOrcidData(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          [index]: data
        }
      }));
    } catch (error) {
      console.error('Error al obtener datos del ORCID:', error);
    }
  };

  const handleChange = (key, value, index, type = 'autores') => {
    const newEntries = [...formData[type]];
    newEntries[index][key] = String(value);
    setFormData(prev => ({ ...prev, [type]: newEntries }));
  };

  const addAuthor = () => {
    if (formData.autores.length < 2) {
      setFormData(prev => ({
        ...prev,
        autores: [...prev.autores, { nombre: '', apellido: '', dni: '', telefono: '', email: '', orcid: '', orcidConfirmed: false }]
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
        asesores: [...prev.asesores, { nombre: '', apellido: '', dni: '', titulo: 'Magister', orcid: '', orcidConfirmed: false }]
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
    const newValue = detail.value.replace(/\D/g, '').slice(0, 8);
    handleChange('dni', newValue, index, type);
    if (newValue.length === 8) {
      fetchAndSetDataByDni(newValue, index, type);
    } else {
      handleChange('nombre', 'Cargando...', index, type);
      handleChange('apellido', 'Cargando...', index, type);
      if (type === 'autores') {
        handleChange('telefono', 'Cargando...', index, type);
        handleChange('email', 'Cargando...', index, type);
      }
    }
  };

  const handleOrcidChange = (detail, index, type) => {
    const newValue = detail.value.replace(/[^0-9X-]/gi, '');
    handleChange('orcid', newValue, index, type);
    if (newValue.length === 19) {
      fetchAndSetDataByOrcid(newValue, index, type);
    } else {
      setOrcidData(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          [index]: null
        }
      }));
    }
  };

  const handleConfirmOrcid = (index, type) => {
    const newEntries = [...formData[type]];
    newEntries[index].orcidConfirmed = true;
    setFormData(prev => ({ ...prev, [type]: newEntries }));
  };

  const handleSave = () => {
    if (isFormComplete()) {
      onSave({ formData, fileUrl });
      onClose();
    } else {
      alert("Todos los campos deben estar completos.");
    }
  };

  return (
    <ModalTwoCol
      onClose={onClose}
      headerText="Subir Tesis"
      footerButtons={
        <>
          <Button onClick={onClose} variant="secondary">Cancelar</Button>
          <Button onClick={handleSave} disabled={!isFormComplete()}>Guardar</Button>
        </>
      }
      file={file}
      setFile={setFile}
      fileUrl={fileUrl}
      showForm={showForm}
      setShowForm={setShowForm}
      isFormComplete={isFormComplete}
      formContent={
        <SpaceBetween direction="vertical" size="l">
          <Container header={<Header variant="h3">Formulario de Tesis</Header>}>
            <SpaceBetween direction="vertical" size="s">
              <FormField label="Facultad">
                <Input value={formData.facultad} readOnly />
              </FormField>
              <FormField label="Escuela">
                <Input value={formData.escuela} readOnly />
              </FormField>
              <FormField label="Título">
                <Input value={formData.titulo} onChange={({ detail }) => setFormData(prev => ({ ...prev, titulo: detail.value }))} readOnly={readOnly} />
              </FormField>
              <ColumnLayout columns={3}>
                <FormField label="Tipo">
                  <Select
                    selectedOption={{ label: formData.tipo, value: formData.tipo }}
                    options={[
                      { label: 'Tesis', value: 'Tesis' },
                      { label: 'Trabajo de investigación', value: 'Trabajo de investigación' }
                    ]}
                    onChange={({ detail }) => setFormData(prev => ({ ...prev, tipo: detail.selectedOption.value }))}
                    disabled={readOnly}
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
                    disabled={readOnly}
                  />
                </FormField>
                <FormField label="Año">
                  <Select
                    selectedOption={{ label: formData.year, value: formData.year }}
                    options={years.map(year => ({ label: year.toString(), value: year.toString() }))}
                    onChange={({ detail }) => setFormData(prev => ({ ...prev, year: detail.selectedOption.value }))}
                    disabled={readOnly}
                  />
                </FormField>
              </ColumnLayout>
            </SpaceBetween>
          </Container>
          {formData.autores.map((autor, index) => (
            <Container
              key={index}
              header={
                <Header variant="h5" actions={
                  (index > 0 &&
                    <Button onClick={() => removeAuthor(index)} variant="icon" iconName="close" ariaLabel="Eliminar autor" />
                  ) || (
                    index === 0 &&
                    <Button onClick={addAuthor} disabled={formData.autores.length >= 2}>Agregar Autor</Button>)
                }> {formData.autores.length === 1 ? "Datos del Autor" : `Datos del Autor ${index + 1}`}
                </Header>
              }
            >
              <ColumnLayout columns={2}>
                <FormField label="Nombres">
                  <Input
                    value={loadingDni.autores[index] ? 'Cargando...' : autor.nombre}
                    readOnly={index === 0 ? Boolean(alumnoData?.nombre) : Boolean(autor.nombre) && !loadingDni.autores[index]}
                    onChange={({ detail }) => handleChange('nombre', detail.value, index, 'autores')}
                  />
                </FormField>
                <FormField label="Apellidos">
                  <Input
                    value={loadingDni.autores[index] ? 'Cargando...' : autor.apellido}
                    readOnly={index === 0 ? Boolean(alumnoData?.apellidos) : Boolean(autor.apellido) && !loadingDni.autores[index]}
                    onChange={({ detail }) => handleChange('apellido', detail.value, index, 'autores')}
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={2}>
                <FormField label="DNI">
                  <Input
                    value={autor.dni}
                    readOnly={index === 0 ? Boolean(alumnoData?.dni) : false}
                    onChange={({ detail }) => handleDniChange(detail, index, 'autores')}
                    type="text"
                    maxLength="8"
                    pattern="\d{1,8}"
                  />
                </FormField>
                <FormField label="Teléfono">
                  <Input
                    value={loadingDni.autores[index] ? 'Cargando...' : autor.telefono}
                    readOnly={index === 0 ? Boolean(alumnoData?.telefono) : Boolean(autor.telefono) && !loadingDni.autores[index]}
                    onChange={({ detail }) => handleChange('telefono', detail.value, index, 'autores')}
                    type="tel"
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout>
                <FormField label="Email UNMSM">
                  <Input
                    value={loadingDni.autores[index] ? 'Cargando...' : autor.email}
                    readOnly={index === 0 ? Boolean(alumnoData?.email) : Boolean(autor.email) && !loadingDni.autores[index]}
                    onChange={({ detail }) => handleChange('email', detail.value, index, 'autores')}
                    type="email"
                    placeholder="nombre.apellido@unmsm.edu.pe"
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout>
                <FormField label="URL de ORCID">
                  <Input
                    value={autor.orcid}
                    onChange={({ detail }) => handleOrcidChange(detail, index, 'autores')}
                    inputMode="numeric"
                    placeholder="0000-0000-0000-0000"
                    maxLength="19"
                  />
                  {autor.orcid.length === 19 && orcidData.autores[index] && !autor.orcidConfirmed && (
                    <Box>
                      <div>Usuario ORCID: {orcidData.autores[index]?.nombre} {orcidData.autores[index]?.apellido}</div>
                      <Button onClick={() => handleConfirmOrcid(index, 'autores')}>Confirmar</Button>
                    </Box>
                  )}
                  {autor.orcidConfirmed && (
                    <StatusIndicator type="success">{orcidData.autores[index]?.nombre} {orcidData.autores[index]?.apellido}</StatusIndicator>
                  )}
                </FormField>
              </ColumnLayout>
            </Container>
          ))}
          {formData.asesores.map((asesor, index) => (
            <Container
              key={index}
              header={
                <Header variant="h5" actions={
                  (index > 0 &&
                    <Button onClick={() => removeAdvisor(index)} variant="icon" iconName="close" ariaLabel="Eliminar asesor" />
                  ) || (
                    index === 0 &&
                    <Button onClick={addAdvisor} disabled={formData.asesores.length >= 2}>Agregar Asesor</Button>)
                }> {formData.asesores.length === 1 ? "Datos del Asesor" : `Datos del Asesor ${index + 1}`}
                </Header>
              }
            >
              <ColumnLayout columns={2}>
                <FormField label="Nombres">
                  <Input
                    value={loadingDni.asesores[index] ? 'Cargando...' : asesor.nombre}
                    readOnly={Boolean(asesor.nombre) && !loadingDni.asesores[index]}
                    onChange={({ detail }) => handleChange('nombre', detail.value, index, 'asesores')}
                  />
                </FormField>
                <FormField label="Apellidos">
                  <Input
                    value={loadingDni.asesores[index] ? 'Cargando...' : asesor.apellido}
                    readOnly={Boolean(asesor.apellido) && !loadingDni.asesores[index]}
                    onChange={({ detail }) => handleChange('apellido', detail.value, index, 'asesores')}
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={2}>
                <FormField label="DNI">
                  <Input
                    value={asesor.dni}
                    onChange={({ detail }) => handleDniChange(detail, index, 'asesores')}
                    type="text"
                    maxLength="8"
                    pattern="\d{1,8}"
                  />
                </FormField>
                <FormField label="Título">
                  <Select
                    selectedOption={{ label: asesor.titulo, value: asesor.titulo }}
                    options={[
                      { label: 'Doctor', value: 'Doctor' },
                      { label: 'Magister', value: 'Magister' },
                      { label: 'Otro', value: 'Otro' }
                    ]}
                    onChange={({ detail }) => handleChange('titulo', detail.selectedOption.value, index, 'asesores')}
                    disabled={readOnly}
                  />
                </FormField>
              </ColumnLayout>
              <FormField label="URL de ORCID">
                <Input
                  value={asesor.orcid}
                  onChange={({ detail }) => handleOrcidChange(detail, index, 'asesores')}
                  inputMode="numeric"
                  placeholder="0000-0000-0000-0000"
                  maxLength="19"
                />
                {asesor.orcid.length === 19 && orcidData.asesores[index] && !asesor.orcidConfirmed && (
                  <Box>
                    <div>Usuario ORCID: {orcidData.asesores[index]?.nombre} {orcidData.asesores[index]?.apellido}</div>
                    <Button onClick={() => handleConfirmOrcid(index, 'asesores')}>Confirmar</Button>
                  </Box>
                )}
                {asesor.orcidConfirmed && (
                  <StatusIndicator type="success">{orcidData.asesores[index]?.nombre} {orcidData.asesores[index]?.apellido}</StatusIndicator>
                )}
              </FormField>
            </Container>
          ))}
        </SpaceBetween>
      }
    />
  );
};

export default TesisModal;
