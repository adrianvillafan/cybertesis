import React, { useState, useEffect } from 'react';
import ModalTwoCol from './ModalTwoCol';
import { Button, FormField, Input, Select, SpaceBetween, Container, Header, ColumnLayout, Box, StatusIndicator } from '@cloudscape-design/components';
import { fetchDatosByDni, fetchDatosOrcid, saveTesis, fetchTesisById, uploadTesisFile } from '../../../../../../api';

const TesisModal = ({ onClose, alumnoData, onSave, readOnly, fileUrl, formData: initialFormData, documentos_id }) => {
  const [file, setFile] = useState(null);
  const [localFileUrl, setLocalFileUrl] = useState(fileUrl);
  const [showForm, setShowForm] = useState(false);
  const [loadingDni, setLoadingDni] = useState({ autores: {}, asesores: {} });
  const [orcidData, setOrcidData] = useState({ autores: {}, asesores: {} });
  const [formData, setFormData] = useState({
    facultad_id: alumnoData?.facultad_id || '',
    escuela_id: alumnoData?.escuela_id || '',
    facultad: alumnoData?.facultad_nombre || '',
    escuela: alumnoData?.grado_id === 1 ? alumnoData?.escuela_nombre || '' : '',
    programa: alumnoData?.grado_id === 2 ? alumnoData?.programa_nombre || '' : '',
    titulo: initialFormData?.titulo || '',
    tipo: initialFormData?.tipo || '',
    grado: initialFormData?.grado || '',
    year: initialFormData?.year || '',
    autores: initialFormData?.autores || [{
      id: alumnoData?.idpersonas || '',
      nombre: alumnoData?.nombre || '',
      apellido: alumnoData ? `${alumnoData.apellidos_pat} ${alumnoData.apellidos_mat}` : '',
      dni: alumnoData?.identificacion_id || '',
      telefono: alumnoData?.telefono || '',
      email: alumnoData?.correo_institucional || '',
      orcid: alumnoData?.orcid || '',
      orcidConfirmed: false,
      tipoDocumento: alumnoData?.tipo_identificacion_id === 1 ? 'DNI' : 'Pasaporte'
    }],
    asesores: initialFormData?.asesores || [{
      id: '',
      dni: '',
      nombre: '',
      apellido: '',
      grado: '',
      orcid: '',
      orcidConfirmed: false,
      tipoDocumento: 'DNI'
    }]
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const gradoOptions = [
    { label: 'Bachiller', value: '1' },
    { label: 'Magister', value: '2' },
    { label: 'Doctorado', value: '3' }
  ];

  const isFormComplete = () => {
    const requiredFields = [
      formData.facultad,
      formData.grado_id === 1 ? formData.escuela : formData.programa,
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
        String(asesor.grado),
        String(asesor.orcid)
      ])
    ];

    return requiredFields.every(field => typeof field === 'string' && field.trim().length > 0);
  };

  useEffect(() => {
    if (readOnly) {
      fetchTesisById(documentos_id.id).then((data) => {
        const autores = [
          {
            id: data.id_autor1,
            dni: data.autor1_dni,
            nombre: '',
            apellido: '',
            telefono: '',
            email: '',
            orcid: '',
            orcidConfirmed: false,
            tipoDocumento: 'DNI'
          }
        ];
        if (data.id_autor2) {
          autores.push({
            id: data.id_autor2,
            dni: data.autor2_dni,
            nombre: '',
            apellido: '',
            telefono: '',
            email: '',
            orcid: '',
            orcidConfirmed: false,
            tipoDocumento: 'DNI'
          });
        }

        const asesores = [
          {
            id: data.id_asesor1,
            dni: data.asesor1_dni,
            nombre: '',
            apellido: '',
            grado: '',
            orcid: '',
            orcidConfirmed: false,
            tipoDocumento: 'DNI'
          }
        ];
        if (data.id_asesor2) {
          asesores.push({
            id: data.id_asesor2,
            dni: data.asesor2_dni,
            nombre: '',
            apellido: '',
            grado: '',
            orcid: '',
            orcidConfirmed: false,
            tipoDocumento: 'DNI'
          });
        }

        setFormData({
          facultad_id: data.id_facultad,
          escuela_id: data.id_escuela,
          facultad: data.facultad_nombre,
          escuela: data.grado_id === 1 ? data.escuela_nombre : '',
          programa: data.grado_id === 2 ? data.programa_id : '',
          titulo: data.titulo,
          tipo: data.tipo_tesis,
          grado: data.grado_academico,
          year: data.año,
          file_url: data.file_url,
          autores,
          asesores
        });
        setLocalFileUrl(data.file_url);
      });
    }
  }, [readOnly, documentos_id.id]);

  const fetchAndSetDataByDni = async (tipoIdentificacionId, identificacionId, index, type) => {
    setLoadingDni(prev => ({ ...prev, [type]: { ...prev[type], [index]: true } }));
    try {
      const data = await fetchDatosByDni(tipoIdentificacionId, identificacionId);
      const gradoLabel = gradoOptions.find(option => option.value === data.grado_academico_id.toString())?.label || '';

      handleChange('id', data.idpersonas, index, type);
      handleChange('nombre', data.nombre || '', index, type);
      handleChange('apellido', data.apellido || '', index, type);
      handleChange('grado', gradoLabel, index, type);
      if (type === 'autores') {
        handleChange('telefono', data.telefono || '', index, type);
        handleChange('email', data.email || '', index, type);
      }
      if (data.orcid) {
        handleChange('orcid', data.orcid, index, type);
        fetchAndSetDataByOrcid(data.orcid, index, type);
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
      handleChange('orcidConfirmed', true, index, type);
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
        autores: [...prev.autores, { id: '', nombre: '', apellido: '', dni: '', telefono: '', email: '', orcid: '', orcidConfirmed: false, tipoDocumento: 'DNI' }]
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
        asesores: [...prev.asesores, { id: '', nombre: '', apellido: '', dni: '', grado: 'Magister', orcid: '', orcidConfirmed: false, tipoDocumento: 'DNI' }]
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
      fetchAndSetDataByDni(formData[type][index].tipoDocumento === 'DNI' ? 1 : 2, newValue, index, type);
    } else {
      handleChange('nombre', 'Cargando...', index, type);
      handleChange('apellido', 'Cargando...', index, type);
      handleChange('orcid', 'Cargando...', index, type);
      handleChange('grado', 'Cargando...', index, type);
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
      handleChange('orcidConfirmed', false, index, type);
    }
  };

  const handleConfirmOrcid = (index, type) => {
    const newEntries = [...formData[type]];
    newEntries[index].orcidConfirmed = true;
    setFormData(prev => ({ ...prev, [type]: newEntries }));
  };

  const handleSave = async () => {
    console.log("formData:", formData);
    console.log("file:", file);

    if (isFormComplete()) {
      try {
        // Define the new file name
        const newFileName = `${formData.autores[0].dni}_${formData.tipo}_${formData.grado}_${formData.year}.pdf`;
        console.log("newFileName:", newFileName);

        // Create a new file object with the new name
        const newFile = new File([file], newFileName, { type: file.type });
        console.log("newFile:", newFile);

        // Subir el archivo
        console.log("Tratando de subir archivo...");
        const uploadResponse = await uploadTesisFile(newFile);
        const { fileName } = uploadResponse;
        console.log("uploadResponse:", uploadResponse);

        // Guardar los detalles de la tesis
        const tesisData = {
          ...formData,
          file_url: fileName,
          autor1: formData.autores[0].id,
          autor2: formData.autores[1]?.id || null,
          asesor1: formData.asesores[0].id,
          asesor2: formData.asesores[1]?.id || null,
          documentos_id: documentos_id.id
        };

        const saveResponse = await saveTesis(tesisData);

        onSave({ formData, fileUrl });
        onClose();
      } catch (error) {
        alert("Error al guardar la tesis: " + error.message);
      }
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
      fileUrl={localFileUrl}
      setFileUrl={setLocalFileUrl}
      showForm={showForm}
      setShowForm={setShowForm}
      mode={'upload'}
      isFormComplete={isFormComplete}
      formContent={
        <SpaceBetween direction="vertical" size="l">
          <Container header={<Header variant="h3">Formulario de Tesis</Header>}>
            <SpaceBetween direction="vertical" size="s">
              <FormField label="Facultad">
                <Input value={formData.facultad} readOnly />
              </FormField>
              <FormField label={alumnoData.grado_id === 1 ? "Escuela" : "Programa"}>
                <Input value={alumnoData.grado_id === 1 ? formData.escuela : formData.programa} readOnly />
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
                    onChange={({ detail }) => setFormData(prev => ({ ...prev, grado: detail.selectedOption.label }))}
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
                <FormField label="Nombres">
                  <Input
                    value={loadingDni.autores[index] ? 'Cargando...' : autor.nombre}
                    readOnly
                  />
                </FormField>
                <FormField label="Apellidos">
                  <Input
                    value={loadingDni.autores[index] ? 'Cargando...' : autor.apellido}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={2}>
                <FormField label="Tipo de Documento">
                  <Select
                    selectedOption={{ label: autor.tipoDocumento, value: autor.tipoDocumento }}
                    options={[
                      { label: 'DNI', value: 'DNI' },
                      { label: 'Pasaporte', value: 'Pasaporte' }
                    ]}
                    onChange={({ detail }) => {
                      handleChange('tipoDocumento', detail.selectedOption.value, index, 'autores');
                      if (index > 0) {
                        handleDniChange({ value: formData.autores[index].dni }, index, 'autores');
                      }
                    }}
                    disabled={index === 0}
                  />
                </FormField>
                <FormField label="Número de Documento">
                  <Input
                    value={autor.dni}
                    readOnly={index === 0}
                    onChange={({ detail }) => handleDniChange(detail, index, 'autores')}
                    type="text"
                    maxLength="8"
                    pattern="\d{1,8}"
                  />
                </FormField>
                <FormField label="Teléfono">
                  <Input
                    value={loadingDni.autores[index] ? 'Cargando...' : autor.telefono}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout>
                <FormField label="Email UNMSM">
                  <Input
                    value={loadingDni.autores[index] ? 'Cargando...' : autor.email}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout>
                <FormField label="URL de ORCID">
                  <Input
                    value={loadingDni.autores[index] ? 'Cargando...' : autor.orcid}
                    readOnly
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
                    readOnly
                  />
                </FormField>
                <FormField label="Apellidos">
                  <Input
                    value={loadingDni.asesores[index] ? 'Cargando...' : asesor.apellido}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={2}>
                <FormField label="Tipo de Documento">
                  <Select
                    selectedOption={{ label: asesor.tipoDocumento, value: asesor.tipoDocumento }}
                    options={[
                      { label: 'DNI', value: 'DNI' },
                      { label: 'Pasaporte', value: 'Pasaporte' }
                    ]}
                    onChange={({ detail }) => {
                      handleChange('tipoDocumento', detail.selectedOption.value, index, 'asesores');
                      handleDniChange({ value: formData.asesores[index].dni }, index, 'asesores');
                    }}
                  />
                </FormField>
                <FormField label="Número de Documento">
                  <Input
                    value={asesor.dni}
                    onChange={({ detail }) => handleDniChange(detail, index, 'asesores')}
                    type="text"
                    maxLength="8"
                    pattern="\d{1,8}"
                  />
                </FormField>
                <FormField label="Grado">
                  <Input
                    value={loadingDni.asesores[index] ? 'Cargando...' : asesor.grado}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout>
                <FormField label="URL de ORCID">
                  <Input
                    value={loadingDni.asesores[index] ? 'Cargando...' : asesor.orcid}
                    readOnly
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
              </ColumnLayout>
            </Container>
          ))}
        </SpaceBetween>
      }
    />
  );
};

export default TesisModal;
