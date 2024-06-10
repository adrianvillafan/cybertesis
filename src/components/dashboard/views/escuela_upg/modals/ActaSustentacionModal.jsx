import React, { useState } from 'react';
import ModalTwoCol from './ModalTwoCol';
import { Button, FormField, Input, Select, SpaceBetween, Container, Header, ColumnLayout } from '@cloudscape-design/components';
import { fetchDatosByDni } from '../../../../../../api';

const ActaSustentacionModal = ({ onClose, asesores, onSave }) => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loadingDni, setLoadingDni] = useState({ presidente: false, miembros: {} });
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

  const handleChange = (key, value, index, type = 'miembros') => {
    const newEntries = [...formData[type]];
    newEntries[index][key] = value;
    setFormData(prev => ({ ...prev, [type]: newEntries }));
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
              <ColumnLayout columns={2}>
                <FormField label="DNI">
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
              <ColumnLayout columns={2}>
                <FormField label="DNI">
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
      }
    />
  );
};

export default ActaSustentacionModal;
