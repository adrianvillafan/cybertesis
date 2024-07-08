import React, { useState, useEffect } from 'react';
import ModalTwoCol from './ModalTwoCol';
import { Button, FormField, Input, Select, SpaceBetween, Container, Header, ColumnLayout } from '@cloudscape-design/components';
import { fetchDatosByDni, fetchTesisById } from '../../../../../../api';
import { createActaSustentacion, uploadActaFile } from '../../../../../../src/apis/escuela_upg/modals/ApiActaSustentacionModal';

const ActaSustentacionModal = ({ onClose, documentos, onSave }) => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loadingDni, setLoadingDni] = useState({ presidente: false, miembros: {}, asesores: {} });
  const [formData, setFormData] = useState({
    presidente: { nombre: '', apellido: '', dni: '', grado: '', tipoDocumento: 'DNI' },
    miembros: [{ nombre: '', apellido: '', dni: '', grado: '', tipoDocumento: 'DNI' }, { nombre: '', apellido: '', dni: '', grado: '', tipoDocumento: 'DNI' }],
    asesores: []
  });

  useEffect(() => {
    const fetchAsesores = async () => {
      try {
        const tesisData = await fetchTesisById(documentos.tesis_id);
        const asesores = [
          {
            nombre: '',
            apellido: '',
            dni: tesisData.asesor1_dni,
            orcid: '',
            tipoDocumento: /^\d+$/.test(tesisData.asesor1_dni) ? 'DNI' : 'Pasaporte'
          }
        ];
        if (tesisData.asesor2_dni) {
          asesores.push({
            nombre: '',
            apellido: '',
            dni: tesisData.asesor2_dni,
            orcid: '',
            tipoDocumento: /^\d+$/.test(tesisData.asesor2_dni) ? 'DNI' : 'Pasaporte'
          });
        }
        setFormData(prev => ({ ...prev, asesores }));

        asesores.forEach((asesor, index) => {
          if (asesor.dni) {
            fetchAndSetDataByDni(asesor.dni, index, 'asesores', asesor.tipoDocumento);
          }
        });
      } catch (error) {
        console.error('Error al obtener los datos de la tesis:', error);
      }
    };

    fetchAsesores();
  }, [documentos.tesis_id]);

  const grados = [
    { label: 'Doctor', value: 'Doctor' },
    { label: 'Magister', value: 'Magister' }
  ];

  const tiposDocumento = [
    { label: 'DNI', value: 'DNI' },
    { label: 'Pasaporte', value: 'Pasaporte' }
  ];

  const isFormComplete = () => {
    const requiredFields = [
      formData.presidente.nombre,
      formData.presidente.apellido,
      formData.presidente.dni,
      formData.presidente.grado,
      ...formData.miembros.flatMap(miembro => [miembro.nombre, miembro.apellido, miembro.dni, miembro.grado]),
      ...formData.asesores.flatMap(asesor => [asesor.nombre, asesor.apellido, asesor.dni, asesor.orcid])
    ];
    return requiredFields.every(field => field && field.trim().length > 0);
  };

  const fetchAndSetDataByDni = async (dni, index, type, tipoDocumento = 'DNI') => {
    const tipoIdentificacionId = tipoDocumento === 'DNI' ? 1 : 2;

    if (type === 'presidente') {
      setLoadingDni(prev => ({ ...prev, presidente: true }));
    } else if (type === 'asesores') {
      setLoadingDni(prev => ({ ...prev, asesores: { ...prev.asesores, [index]: true } }));
    } else {
      setLoadingDni(prev => ({ ...prev, miembros: { ...prev.miembros, [index]: true } }));
    }

    try {
      const data = await fetchDatosByDni(tipoIdentificacionId, dni);
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
      } else if (type === 'asesores') {
        setLoadingDni(prev => ({ ...prev, asesores: { ...prev.asesores, [index]: false } }));
        setFormData(prev => ({
          ...prev,
          asesores: prev.asesores.map((asesor, i) => i === index ? { ...asesor, nombre: data.nombre || '', apellido: data.apellido || '' , orcid: data.orcid || '' } : asesor)
        }));
      } else {
        setLoadingDni(prev => ({ ...prev, miembros: { ...prev.miembros, [index]: false } }));
        setFormData(prev => ({
          ...prev,
          miembros: prev.miembros.map((miembro, i) => i === index ? { ...miembro, nombre: data.nombre || '', apellido: data.apellido || '' } : miembro)
        }));
      }
    } catch (error) {
      console.error('Error al obtener datos del DNI:', error);
    }
  };

  const handleChange = (key, value, index, type = 'miembros') => {
    const newEntries = [...formData[type]];
    newEntries[index][key] = value;
    setFormData(prev => ({ ...prev, [type]: newEntries }));
  };

  const addMember = () => {
    if (formData.miembros.length < 3) {
      setFormData(prev => ({
        ...prev,
        miembros: [...prev.miembros, { nombre: '', apellido: '', dni: '', grado: '', tipoDocumento: 'DNI' }]
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
    const tipoDocumento = type === 'presidente' ? formData.presidente.tipoDocumento : formData[type][index].tipoDocumento;

    if (type === 'presidente') {
      setFormData(prev => ({
        ...prev,
        presidente: {
          ...prev.presidente,
          dni: newValue,
        }
      }));
      if (newValue.length === 8) {
        fetchAndSetDataByDni(newValue, null, 'presidente', tipoDocumento);
      }
    } else if (type === 'asesores') {
      handleChange('dni', newValue, index, 'asesores');
      if (newValue.length === 8) {
        fetchAndSetDataByDni(newValue, index, 'asesores', tipoDocumento);
      }
    } else {
      handleChange('dni', newValue, index, 'miembros');
      if (newValue.length === 8) {
        fetchAndSetDataByDni(newValue, index, 'miembros', tipoDocumento);
      }
    }
  };

  const handleSave = async () => {
    if (isFormComplete()) {
      try {
        const uploadResult = await uploadActaFile(file);
        const savedActa = await createActaSustentacion({ formData, fileUrl: uploadResult.fileName });
        onSave(savedActa);
        onClose();
      } catch (error) {
        console.error('Error al guardar acta de sustentación:', error);
        alert('Error al guardar el acta de sustentación. Por favor, intente nuevamente.');
      }
    } else {
      alert("Todos los campos deben estar completos.");
    }
  };

  return (
    <ModalTwoCol
      onClose={onClose}
      headerText="Subir Acta de Sustentación"
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
          <Container header={<Header variant="h3">Formulario de Acta de Sustentación</Header>}>
            <SpaceBetween direction="vertical" size="s">
              <Header variant="h5">Presidente</Header>
              <ColumnLayout columns={2}>
                <FormField label="Nombres">
                  <Input
                    value={loadingDni.presidente ? 'Cargando...' : formData.presidente.nombre}
                    readOnly
                  />
                </FormField>
                <FormField label="Apellidos">
                  <Input
                    value={loadingDni.presidente ? 'Cargando...' : formData.presidente.apellido}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={3}>
                <FormField label="Tipo de Documento">
                  <Select
                    selectedOption={{ label: formData.presidente.tipoDocumento, value: formData.presidente.tipoDocumento }}
                    options={tiposDocumento}
                    onChange={({ detail }) => setFormData(prev => ({
                      ...prev,
                      presidente: {
                        ...prev.presidente,
                        tipoDocumento: detail.selectedOption.value
                      }
                    }))}
                  />
                </FormField>
                <FormField label="Número de Documento">
                  <Input
                    value={formData.presidente.dni}
                    onChange={({ detail }) => handleDniChange(detail, null, 'presidente')}
                    type="text"
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
                    readOnly
                  />
                </FormField>
                <FormField label="Apellidos">
                  <Input
                    value={loadingDni.miembros[index] ? 'Cargando...' : miembro.apellido}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={3}>
                <FormField label="Tipo de Documento">
                  <Select
                    selectedOption={{ label: miembro.tipoDocumento, value: miembro.tipoDocumento }}
                    options={tiposDocumento}
                    onChange={({ detail }) => handleChange('tipoDocumento', detail.selectedOption.value, index, 'miembros')}
                  />
                </FormField>
                <FormField label="Número de Documento">
                  <Input
                    value={miembro.dni}
                    onChange={({ detail }) => handleDniChange(detail, index, 'miembros')}
                    type="text"
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
              header={<Header variant="h5">Datos del Asesor {index + 1}</Header>}
            >
              <ColumnLayout columns={2}>
                <FormField label="Nombres">
                  <Input value={loadingDni.asesores[index] ? 'Cargando...' : asesor.nombre} readOnly />
                </FormField>
                <FormField label="Apellidos">
                  <Input value={loadingDni.asesores[index] ? 'Cargando...' : asesor.apellido} readOnly />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={2}>
                <FormField label="Número de Documento">
                  <Input value={asesor.dni} readOnly />
                </FormField>
                <FormField label="URL de ORCID">
                  <Input value={asesor.orcid} readOnly />
                </FormField>
              </ColumnLayout>
            </Container>
          ))}
        </SpaceBetween>
      }
    />
  );
};

export default ActaSustentacionModal;
