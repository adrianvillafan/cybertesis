import React, { useState, useEffect, useContext } from 'react';
import ModalTwoCol from './ModalTwoCol';
import { Button, FormField, Input, Select, SpaceBetween, Container, Header, ColumnLayout } from '@cloudscape-design/components';
import { fetchDatosByDni, fetchTesisById, uploadActaFile, createActaSustentacion } from '../../../../../../api';
import UserContext from '../../../contexts/UserContext';

const ActaSustentacionModal = ({ onClose, documentos, onSave }) => {
  const { user } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loadingDni, setLoadingDni] = useState({ presidente: false, miembros: {}, asesores: {} });
  const [formData, setFormData] = useState({
    presidente: { nombre: '', apellido: '', dni: '', grado: '', tipoDocumento: 'DNI', id: '' },
    miembros: [{ nombre: '', apellido: '', dni: '', grado: '', tipoDocumento: 'DNI', id: '' }, { nombre: '', apellido: '', dni: '', grado: '', tipoDocumento: 'DNI', id: '' }],
    asesores: [],
    id_participantes: ''
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
            grado: '',
            tipoDocumento: /^\d+$/.test(tesisData.asesor1_dni) ? 'DNI' : 'Pasaporte',
            id: tesisData.id_asesor1
          }
        ];
        if (tesisData.asesor2_dni) {
          asesores.push({
            nombre: '',
            apellido: '',
            dni: tesisData.asesor2_dni,
            grado: '',
            tipoDocumento: /^\d+$/.test(tesisData.asesor2_dni) ? 'DNI' : 'Pasaporte',
            id: tesisData.id_asesor2
          });
        }
        setFormData(prev => ({ ...prev, asesores }));

        asesores.forEach((asesor, index) => {
          if (asesor.dni) {
            fetchAndSetDataByDni(asesor.dni, index, 'asesores', asesor.tipoDocumento);
          }
        });

        setFormData(prev => ({ ...prev, id_participantes: tesisData.id_participantes }));
      } catch (error) {
        console.error('Error al obtener los datos de la tesis:', error);
      }
    };

    fetchAsesores();
  }, [documentos.tesis_id]);

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
      ...formData.miembros.map(miembro => [miembro.nombre, miembro.apellido, miembro.dni, miembro.grado]).flat(),
      ...formData.asesores.map(asesor => [asesor.nombre, asesor.apellido, asesor.dni, asesor.grado]).flat()
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
      const id = data.idpersonas;
      const gradoLabel = data.grado_academico_id === 1 ? 'Bachiller' : data.grado_academico_id === 2 ? 'Magister' : 'Doctor';
      if (type === 'presidente') {
        setLoadingDni(prev => ({ ...prev, presidente: false }));
        setFormData(prev => ({
          ...prev,
          presidente: {
            ...prev.presidente,
            nombre: data.nombre || '',
            apellido: data.apellido || '',
            grado: gradoLabel,
            id
          }
        }));
      } else if (type === 'asesores') {
        setLoadingDni(prev => ({ ...prev, asesores: { ...prev.asesores, [index]: false } }));
        setFormData(prev => ({
          ...prev,
          asesores: prev.asesores.map((asesor, i) => i === index ? { ...asesor, nombre: data.nombre || '', apellido: data.apellido || '', grado: gradoLabel, id } : asesor)
        }));
      } else {
        setLoadingDni(prev => ({ ...prev, miembros: { ...prev.miembros, [index]: false } }));
        setFormData(prev => ({
          ...prev,
          miembros: prev.miembros.map((miembro, i) => i === index ? { ...miembro, nombre: data.nombre || '', apellido: data.apellido || '', grado: gradoLabel, id } : miembro)
        }));
      }
    } catch (error) {
      console.error('Error al obtener datos del DNI:', error);
    }
  };

  const handleChange = (key, value, index, type = 'miembros') => {
    if (type === 'presidente') {
      setFormData(prev => ({
        ...prev,
        presidente: {
          ...prev.presidente,
          [key]: value
        }
      }));
    } else {
      const newEntries = [...formData[type]];
      newEntries[index][key] = value;
      setFormData(prev => ({ ...prev, [type]: newEntries }));
    }
  };

  const addMember = () => {
    if (formData.miembros.length < 3) {
      setFormData(prev => ({
        ...prev,
        miembros: [...prev.miembros, { nombre: '', apellido: '', dni: '', grado: '', tipoDocumento: 'DNI', id: '' }]
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
    const tipoDocumento = formData[type]?.[index]?.tipoDocumento || 'DNI';
    handleChange('dni', newValue, index, type);
    if (newValue.length === 8) {
      fetchAndSetDataByDni(newValue, index, type, tipoDocumento);
    } else {
      handleChange('nombre', 'Cargando...', index, type);
      handleChange('apellido', 'Cargando...', index, type);
      handleChange('grado', 'Cargando...', index, type);
    }
  };

  const handleFileChange = (file) => {
    if (file) {
  
      // Crear el nuevo nombre del archivo
      const newFileName = `ActaSustentacion_${documentos.id}.pdf`;
  
      // Crear un nuevo archivo con el nuevo nombre, conservando el contenido del archivo original
      const renamedFile = new File([file], newFileName, { type: file.type });
  
      // Guardar el nuevo archivo renombrado en el estado
      setFile(renamedFile);
  
      // Mostrar el nuevo nombre del archivo en la consola
      console.log("Nuevo nombre del archivo:", newFileName);
    }
  };
  

  const handleSave = async () => {
    if (isFormComplete()) {
      try {
        const uploadResponse = await uploadActaFile(file);
        const { fileName } = uploadResponse;

        const actaData = {
          id_participantes: formData.id_participantes,
          id_presidente: formData.presidente.id,
          id_miembro1: formData.miembros[0].id,
          id_miembro2: formData.miembros[1].id,
          id_miembro3: formData.miembros[2]?.id || null,
          file_url: fileName,
          created_by: user.user_id,
          updated_by: user.user_id,
          documentos_id: documentos.id
        };

        const savedActa = await createActaSustentacion(actaData);
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
      headerText="Adjuntar Acta de Sustentación"
      footerButtons={
        <>
          <Button onClick={onClose} variant="secondary">Cancelar</Button>
          <Button  variant="primary" onClick={handleSave} disabled={!isFormComplete()}>Guardar</Button>
        </>
      }
      file={file}
      setFile={handleFileChange}
      fileUrl={fileUrl}
      setFileUrl={setFileUrl}
      showForm={showForm}
      setShowForm={setShowForm}
      mode={'upload'}
      isFormComplete={isFormComplete}
      formContent={
        <SpaceBetween direction="vertical" size="l">
          <Container header={<Header variant="h3">Formulario de Acta de Sustentación</Header>}>
            <SpaceBetween direction="vertical" size="s">
              <Header variant="h5">Presidente</Header>
             
              <ColumnLayout columns={3}>
                <FormField label="Tipo de Documento">
                  <Select
                    selectedOption={{ label: formData.presidente.tipoDocumento, value: formData.presidente.tipoDocumento }}
                    options={tiposDocumento}
                    onChange={({ detail }) => handleChange('tipoDocumento', detail.selectedOption.value, null, 'presidente')}
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
                  <Input
                    value={loadingDni.presidente ? 'Cargando...' : formData.presidente.grado}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
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
                  <Input
                    value={loadingDni.miembros[index] ? 'Cargando...' : miembro.grado}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
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
            </Container>
          ))}

          {formData.asesores.map((asesor, index) => (
            <Container
              key={index}
              header={<Header variant="h5">{formData.asesores.length === 1 ? "Datos del Asesor" : `Datos del Asesor ${index + 1}`}</Header>}
            >
              
              <ColumnLayout columns={3}>
                <FormField label="Tipo de Documento">
                  <Select
                    selectedOption={{ label: asesor.tipoDocumento, value: asesor.tipoDocumento }}
                    options={tiposDocumento}
                    onChange={({ detail }) => handleChange('tipoDocumento', detail.selectedOption.value, index, 'asesores')}
                    readOnly
                  />
                </FormField>
                <FormField label="Número de Documento">
                  <Input value={asesor.dni} readOnly />
                </FormField>
                <FormField label="Grado">
                  <Input
                    value={loadingDni.asesores[index] ? 'Cargando...' : asesor.grado}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={2}>
                <FormField label="Nombres">
                  <Input value={loadingDni.asesores[index] ? 'Cargando...' : asesor.nombre} readOnly />
                </FormField>
                <FormField label="Apellidos">
                  <Input value={loadingDni.asesores[index] ? 'Cargando...' : asesor.apellido} readOnly />
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

