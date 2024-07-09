import React, { useState, useEffect } from 'react';
import ModalTwoCol from './ModalTwoCol';
import { Button, FormField, Input, Select, SpaceBetween, Container, Header, ColumnLayout } from '@cloudscape-design/components';
import { fetchActaById } from '../../../../../../src/apis/escuela_upg/modals/ApiActaSustentacionModal';
import { fetchDatosByDni } from '../../../../../../api';

const ActaSustentacionModalVer = ({ onClose, documentos }) => {
  const [formData, setFormData] = useState({
    presidente: { nombre: '', apellido: '', dni: '', grado: '' },
    miembros: [{ nombre: '', apellido: '', dni: '', grado: '' }, { nombre: '', apellido: '', dni: '', grado: '' }],
    asesores: []
  });
  const [fileUrl, setFileUrl] = useState('');
  const [loadingState, setLoadingState] = useState({
    presidente: true,
    miembros: [true, true, true],
    asesores: [true, true]
  });

  const gradoOptions = [
    { label: 'Bachiller', value: '1' },
    { label: 'Magister', value: '2' },
    { label: 'Doctor', value: '3' }
  ];

  const fetchAndSetDataByDni = async (dni, type, index) => {
    try {
      const data = await fetchDatosByDni(1, dni); // Assuming tipoIdentificacionId is always 1 for DNI
      const gradoLabel = gradoOptions.find(option => option.value === data.grado_academico_id.toString())?.label || '';

      if (type === 'presidente') {
        setFormData(prev => ({
          ...prev,
          presidente: {
            nombre: data.nombre,
            apellido: data.apellido,
            dni: data.identificacion_id,
            grado: gradoLabel
          }
        }));
        setLoadingState(prev => ({ ...prev, presidente: false }));
      } else if (type === 'miembros') {
        setFormData(prev => ({
          ...prev,
          miembros: prev.miembros.map((miembro, idx) => idx === index ? {
            nombre: data.nombre,
            apellido: data.apellido,
            dni: data.identificacion_id,
            grado: gradoLabel
          } : miembro)
        }));
        setLoadingState(prev => ({
          ...prev,
          miembros: prev.miembros.map((loading, idx) => idx === index ? false : loading)
        }));
      } else if (type === 'asesores') {
        setFormData(prev => ({
          ...prev,
          asesores: prev.asesores.map((asesor, idx) => idx === index ? {
            nombre: data.nombre,
            apellido: data.apellido,
            dni: data.identificacion_id,
            grado: gradoLabel
          } : asesor)
        }));
        setLoadingState(prev => ({
          ...prev,
          asesores: prev.asesores.map((loading, idx) => idx === index ? false : loading)
        }));
      }
    } catch (error) {
      console.error('Error al obtener datos del DNI:', error);
    }
  };

  useEffect(() => {
    if (documentos.actasust_id) {
      fetchActaById(documentos.actasust_id).then(data => {
        setFormData(prev => ({
          ...prev,
          presidente: {
            ...prev.presidente,
            dni: data.presidente_dni
          },
          miembros: [
            { ...prev.miembros[0], dni: data.miembro1_dni },
            { ...prev.miembros[1], dni: data.miembro2_dni },
            ...(data.miembro3_dni ? [{ dni: data.miembro3_dni }] : [])
          ],
          asesores: [
            { dni: data.asesor1_dni },
            ...(data.asesor2_dni ? [{ dni: data.asesor2_dni }] : [])
          ]
        }));

        fetchAndSetDataByDni(data.presidente_dni, 'presidente');
        fetchAndSetDataByDni(data.miembro1_dni, 'miembros', 0);
        fetchAndSetDataByDni(data.miembro2_dni, 'miembros', 1);
        if (data.miembro3_dni) fetchAndSetDataByDni(data.miembro3_dni, 'miembros', 2);
        fetchAndSetDataByDni(data.asesor1_dni, 'asesores', 0);
        if (data.asesor2_dni) fetchAndSetDataByDni(data.asesor2_dni, 'asesores', 1);

        setFileUrl(data.file_url);
      }).catch(error => {
        console.error('Error al obtener el acta:', error);
      });
    }
  }, [documentos.actasust_id]);

  return (
    <ModalTwoCol
      onClose={onClose}
      headerText="Ver Acta de Sustentación"
      footerButtons={
        <>
          <Button onClick={onClose} variant="secondary">Cerrar</Button>
          <Button iconName="download" href={fileUrl} target="_blank" variant="primary">Descargar</Button>
        </>
      }
      fileUrl={fileUrl}
      mode={'view'}
      formContent={
        <SpaceBetween direction="vertical" size="l">
          <Container header={<Header variant="h3">Formulario de Acta de Sustentación</Header>}>
            <SpaceBetween direction="vertical" size="s">
              <Header variant="h5">Presidente</Header>
              <ColumnLayout columns={2}>
                <FormField label="Nombres">
                  <Input value={loadingState.presidente ? 'Cargando...' : formData.presidente.nombre} readOnly />
                </FormField>
                <FormField label="Apellidos">
                  <Input value={loadingState.presidente ? 'Cargando...' : formData.presidente.apellido} readOnly />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={2}>
                <FormField label="Número de Documento">
                  <Input value={formData.presidente.dni} readOnly />
                </FormField>
                <FormField label="Grado">
                  <Select
                    selectedOption={{ label: formData.presidente.grado, value: formData.presidente.grado }}
                    options={gradoOptions}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
            </SpaceBetween>
          </Container>

          {formData.miembros.map((miembro, index) => (
            <Container key={index} header={<Header variant="h5">Miembro del Jurado {index + 1}</Header>}>
              <ColumnLayout columns={2}>
                <FormField label="Nombres">
                  <Input value={loadingState.miembros[index] ? 'Cargando...' : miembro.nombre} readOnly />
                </FormField>
                <FormField label="Apellidos">
                  <Input value={loadingState.miembros[index] ? 'Cargando...' : miembro.apellido} readOnly />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={2}>
                <FormField label="Número de Documento">
                  <Input value={miembro.dni} readOnly />
                </FormField>
                <FormField label="Grado">
                  <Select
                    selectedOption={{ label: miembro.grado, value: miembro.grado }}
                    options={gradoOptions}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
            </Container>
          ))}

          {formData.asesores.map((asesor, index) => (
            <Container key={index} header={<Header variant="h5">Datos del Asesor {index + 1}</Header>}>
              <ColumnLayout columns={2}>
                <FormField label="Nombres">
                  <Input value={loadingState.asesores[index] ? 'Cargando...' : asesor.nombre} readOnly />
                </FormField>
                <FormField label="Apellidos">
                  <Input value={loadingState.asesores[index] ? 'Cargando...' : asesor.apellido} readOnly />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={2}>
                <FormField label="Número de Documento">
                  <Input value={asesor.dni} readOnly />
                </FormField>
                <FormField label="Grado">
                  <Select
                    selectedOption={{ label: asesor.grado, value: asesor.grado }}
                    options={gradoOptions}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
            </Container>
          ))}
        </SpaceBetween>
      }
    />
  );
};

export default ActaSustentacionModalVer;
