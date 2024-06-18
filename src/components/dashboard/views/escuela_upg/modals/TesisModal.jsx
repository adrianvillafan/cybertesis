import React, { useState, useEffect, useContext } from 'react';
import ModalTwoCol from './ModalTwoCol';
import { Button, FormField, Input, Select, SpaceBetween, Container, Header, ColumnLayout, Box, StatusIndicator } from '@cloudscape-design/components';
import { fetchDatosByDni, fetchDatosOrcid } from '../../../../../../api';
import UserContext from '../../../contexts/UserContext';

const TesisModal = ({ onClose, alumnoData, onSave }) => {
  const { user } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loadingDni, setLoadingDni] = useState({ autores: {}, asesores: {} });
  const [orcidData, setOrcidData] = useState({ autores: {}, asesores: {} });
  const [formData, setFormData] = useState({
    facultad: user.nombre_facultad || '',
    escuela: '',
    titulo: '',
    tipo: '',
    grado: user.nombre_grado || '',
    year: '',
    autores: [{
      tipoDocumento: 'DNI',
      nombre: alumnoData?.nombre || '',
      apellido: alumnoData?.apellidos || '',
      dni: alumnoData?.dni || '',
      telefono: alumnoData?.telefono || '',
      email: alumnoData?.email || '',
      orcid: '',
      orcidConfirmed: false
    }],
    asesores: [{
      tipoDocumento: 'DNI',
      dni: '',
      nombre: '',
      apellido: '',
      titulo: 'Magister',
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
        autores: [...prev.autores, { tipoDocumento: 'DNI', nombre: '', apellido: '', dni: '', telefono: '', email: '', orcid: '', orcidConfirmed: false }]
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
        asesores: [...prev.asesores, { tipoDocumento: 'DNI', nombre: '', apellido: '', dni: '', titulo: 'Magister', orcid: '', orcidConfirmed: false }]
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
    const tipoDocumento = formData[type][index].tipoDocumento;
    const newValue = tipoDocumento === 'DNI'
      ? detail.value.replace(/\D/g, '').slice(0, 8)
      : detail.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
    handleChange('dni', newValue, index, type);
    if (newValue.length === (tipoDocumento === 'DNI' ? 8 : 8)) {
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
    const newValue = detail.value.replace(/[^0-9X-]/gi, '').slice(0, 19);
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

  const gradoOptions = user.grado_id === 1
    ? [
        { label: 'Bachiller', value: 'Bachiller' },
        { label: 'Título Prof.', value: 'Título Prof.' }
      ]
    : [
        { label: 'Magister', value: 'Magister' },
        { label: 'Doctor', value: 'Doctor' },
        { label: 'Segunda Esp.', value: 'Segunda Esp.' }
      ];

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
      setFileUrl={setFileUrl}
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
                <Select
                  selectedOption={{ label: formData.escuela, value: formData.escuela }}
                  options={user.escuelas.map(escuela => ({ label: escuela.nombre_escuela, value: escuela.nombre_escuela }))}
                  onChange={({ detail }) => setFormData(prev => ({ ...prev, escuela: detail.selectedOption.value }))}
                />
              </FormField>
              <FormField label="Título">
                <Input value={formData.titulo} onChange={({ detail }) => setFormData(prev => ({ ...prev, titulo: detail.value }))} />
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
                  />
                </FormField>
                <FormField label="Grado">
                  <Select
                    selectedOption={{ label: formData.grado, value: formData.grado }}
                    options={gradoOptions}
                    onChange={({ detail }) => setFormData(prev => ({ ...prev, grado: detail.selectedOption.value }))}
                  />
                </FormField>
                <FormField label="Año">
                  <Select
                    selectedOption={{ label: formData.year, value: formData.year }}
                    options={years.map(year => ({ label: year.toString(), value: year.toString() }))}
                    onChange={({ detail }) => setFormData(prev => ({ ...prev, year: detail.selectedOption.value }))}
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
                <FormField label="Tipo de Documento">
                  <Select
                    selectedOption={{ label: autor.tipoDocumento, value: autor.tipoDocumento }}
                    options={[
                      { label: 'DNI', value: 'DNI' },
                      { label: 'Pasaporte', value: 'Pasaporte' }
                    ]}
                    onChange={({ detail }) => handleChange('tipoDocumento', detail.selectedOption.value, index, 'autores')}
                  />
                </FormField>
                <FormField label="Nombres">
                  <Input
                    value={loadingDni.autores[index] ? 'Cargando...' : autor.nombre}
                    readOnly={index === 0 ? Boolean(alumnoData?.nombre) : Boolean(autor.nombre) && !loadingDni.autores[index]}
                    onChange={({ detail }) => handleChange('nombre', detail.value, index, 'autores')}
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={2}>
                <FormField label="Apellidos">
                  <Input
                    value={loadingDni.autores[index] ? 'Cargando...' : autor.apellido}
                    readOnly={index === 0 ? Boolean(alumnoData?.apellidos) : Boolean(autor.apellido) && !loadingDni.autores[index]}
                    onChange={({ detail }) => handleChange('apellido', detail.value, index, 'autores')}
                  />
                </FormField>
                <FormField label="Número de Documento">
                  <Input
                    value={autor.dni}
                    readOnly={index === 0 ? Boolean(alumnoData?.dni) : false}
                    onChange={({ detail }) => handleDniChange(detail, index, 'autores')}
                    type="text"
                    maxLength={autor.tipoDocumento === 'DNI' ? 8 : 8}
                    placeholder={autor.tipoDocumento === 'DNI' ? '12345678' : 'AB123456'}
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={2}>
                <FormField label="Teléfono">
                  <Input
                    value={loadingDni.autores[index] ? 'Cargando...' : autor.telefono}
                    readOnly={index === 0 ? Boolean(alumnoData?.telefono) : Boolean(autor.telefono) && !loadingDni.autores[index]}
                    onChange={({ detail }) => handleChange('telefono', detail.value, index, 'autores')}
                    type="tel"
                  />
                </FormField>
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
              <ColumnLayout columns={2}>
                <FormField label="URL de ORCID">
                  <Input
                    value={autor.orcid}
                    onChange={({ detail }) => handleOrcidChange(detail, index, 'autores')}
                    inputMode="numeric"
                    maxLength={19}
                    placeholder="0000-0000-0000-0000"
                  />
                  {autor.orcid.length === 19 && orcidData.autores[index] && !autor.orcidConfirmed && (
                    <Box>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div>Usuario ORCID: {orcidData.autores[index]?.nombre} {orcidData.autores[index]?.apellido}</div>
                        <Button onClick={() => handleConfirmOrcid(index, 'autores')}>Confirmar</Button>
                      </div>
                    </Box>
                  )}
                  {autor.orcidConfirmed && (
                    <StatusIndicator type="success">
                      Confirmado - {orcidData.autores[index]?.nombre} {orcidData.autores[index]?.apellido}
                    </StatusIndicator>
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
                }>
                  {formData.asesores.length === 1 ? "Datos del Asesor" : `Datos del Asesor ${index + 1}`}
                </Header>
              }
            >
              <ColumnLayout columns={2}>
                <FormField label="Tipo de Documento">
                  <Select
                    selectedOption={{ label: asesor.tipoDocumento, value: asesor.tipoDocumento }}
                    options={[
                      { label: 'DNI', value: 'DNI' },
                      { label: 'Pasaporte', value: 'Pasaporte' }
                    ]}
                    onChange={({ detail }) => handleChange('tipoDocumento', detail.selectedOption.value, index, 'asesores')}
                  />
                </FormField>
                <FormField label="Nombres">
                  <Input value={loadingDni.asesores[index] ? 'Cargando...' : asesor.nombre} readOnly />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={2}>
                <FormField label="Apellidos">
                  <Input value={loadingDni.asesores[index] ? 'Cargando...' : asesor.apellido} readOnly />
                </FormField>
                <FormField label="Número de Documento">
                  <Input
                    value={asesor.dni}
                    onChange={({ detail }) => handleDniChange(detail, index, 'asesores')}
                    inputMode="numeric"
                    type="text"
                    maxLength={asesor.tipoDocumento === 'DNI' ? 8 : 8}
                    placeholder={asesor.tipoDocumento === 'DNI' ? '12345678' : 'AB123456'}
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={2}>
                <FormField label="Grado">
                  <Select
                    selectedOption={{ label: asesor.titulo, value: asesor.titulo }}
                    options={[
                      { label: 'Bachiller', value: 'Bachiller' },
                      { label: 'Magister', value: 'Magister' },
                      { label: 'Doctor', value: 'Doctor' }
                    ]}
                    onChange={({ detail }) => handleChange('titulo', detail.selectedOption.value, index, 'asesores')}
                  />
                </FormField>
                <FormField label="URL de ORCID">
                  <Input
                    value={asesor.orcid}
                    onChange={({ detail }) => handleOrcidChange(detail, index, 'asesores')}
                    inputMode="numeric"
                    maxLength={19}
                    placeholder="0000-0000-0000-0000"
                  />
                  {asesor.orcid.length === 19 && orcidData.asesores[index] && !asesor.orcidConfirmed && (
                    <Box>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div>Usuario ORCID: {orcidData.asesores[index]?.nombre} {orcidData.asesores[index]?.apellido}</div>
                        <Button onClick={() => handleConfirmOrcid(index, 'asesores')}>Confirmar</Button>
                      </div>
                    </Box>
                  )}
                  {asesor.orcidConfirmed && (
                    <StatusIndicator type="success">
                      Confirmado - {orcidData.asesores[index]?.nombre} {orcidData.asesores[index]?.apellido}
                    </StatusIndicator>
                  )}
                </FormField>
              </ColumnLayout>
            </Container>
          ))}
        </SpaceBetween>
      }
    />
  );
};

export default TesisModal;
