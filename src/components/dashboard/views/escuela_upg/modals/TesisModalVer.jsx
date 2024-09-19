import React, { useState, useEffect } from 'react';
import ModalTwoCol from './ModalTwoCol';
import { Button, FormField, Input, Select, SpaceBetween, Container, Header, ColumnLayout } from '@cloudscape-design/components';
import { fetchDatosByDni, fetchTesisById } from '../../../../../../api';

const TesisModalVer = ({ onClose, documentos }) => {
  const [formData, setFormData] = useState({
    facultad: '',
    escuela: '',
    programa: '',
    titulo: '',
    tipo: '',
    grado: '',
    year: '',
    autores: [],
    asesores: []
  });
  const [fileUrl, setFileUrl] = useState('');
  const [loadingState, setLoadingState] = useState({ autores: [true, true], asesores: [true, true] });

  const gradoOptions = [
    { label: 'Tituto', value: '1' },
    { label: 'Magister', value: '2' },
    { label: 'Doctor', value: '3' }
  ];

  const fetchAndSetDataByDni = async (tipoIdentificacionId, identificacionId, index, type) => {
    try {
      const data = await fetchDatosByDni(tipoIdentificacionId, identificacionId);
      const gradoLabel = gradoOptions.find(option => option.value === data.grado_academico_id.toString())?.label || '';

      const newEntry = {
        nombre: data.nombre,
        apellido: data.apellido,
        dni: data.identificacion_id,
        grado: gradoLabel,
        telefono: data.telefono,
        email: data.email,
        orcid: data.orcid
      };

      if (type === 'autores') {
        setFormData(prev => ({
          ...prev,
          autores: prev.autores.map((autor, idx) => idx === index ? { ...autor, ...newEntry } : autor)
        }));
        setLoadingState(prev => ({
          ...prev,
          autores: prev.autores.map((loading, idx) => idx === index ? false : loading)
        }));
      } else if (type === 'asesores') {
        setFormData(prev => ({
          ...prev,
          asesores: prev.asesores.map((asesor, idx) => idx === index ? { ...asesor, ...newEntry, tipoDocumento: 'DNI' } : asesor)
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
    if (documentos.tesis_id) {
      fetchTesisById(documentos.tesis_id).then(data => {
        if (data) {
          setFormData({
            facultad: data.facultad_nombre,
            escuela: data.grado_id === 1 ? data.escuela_nombre : '',
            programa: data.grado_id === 2 ? data.programa_nombre : '',
            titulo: data.titulo,
            tipo: data.tipo_tesis,
            grado: data.grado_academico,
            year: data.año,
            autores: [
              {
                id: data.id_autor1,
                dni: data.autor1_dni,
                nombre: 'Cargando...',
                apellido: 'Cargando...',
                telefono: 'Cargando...',
                email: 'Cargando...',
                orcid: 'Cargando...',
                tipoDocumento: 'DNI'
              },
              ...(data.id_autor2 ? [{
                id: data.id_autor2,
                dni: data.autor2_dni,
                nombre: 'Cargando...',
                apellido: 'Cargando...',
                telefono: 'Cargando...',
                email: 'Cargando...',
                orcid: 'Cargando...',
                tipoDocumento: 'DNI'
              }] : [])
            ],
            asesores: [
              {
                id: data.id_asesor1,
                dni: data.asesor1_dni,
                nombre: 'Cargando...',
                apellido: 'Cargando...',
                grado: 'Cargando...',
                tipoDocumento: 'DNI'
              },
              ...(data.id_asesor2 ? [{
                id: data.id_asesor2,
                dni: data.asesor2_dni,
                nombre: 'Cargando...',
                apellido: 'Cargando...',
                grado: 'Cargando...',
                tipoDocumento: 'DNI'
              }] : [])
            ]
          });
          setFileUrl(data.file_url);

          // Fetch data for autores and asesores
          [
            ...[
              { dni: data.autor1_dni, type: 'autores', index: 0 },
              ...(data.id_autor2 ? [{ dni: data.autor2_dni, type: 'autores', index: 1 }] : [])
            ],
            { dni: data.asesor1_dni, type: 'asesores', index: 0 },
            ...(data.id_asesor2 ? [{ dni: data.asesor2_dni, type: 'asesores', index: 1 }] : [])
          ].forEach(({ dni, type, index }) => fetchAndSetDataByDni(1, dni, index, type));
        }
      }).catch(error => {
        console.error('Error al obtener la tesis:', error);
      });
    }
  }, [documentos.tesis_id]);

  return (
    <ModalTwoCol
      onClose={onClose}
      headerText="Ver Tesis"
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
          <Container header={<Header variant="h3">Formulario de Tesis</Header>}>
            <SpaceBetween direction="vertical" size="s">
              <FormField label="Facultad">
                <Input value={formData.facultad} readOnly />
              </FormField>
              <FormField label={formData.grado === '1' ? "Escuela" : "Programa"}>
                <Input value={formData.grado === '1' ? formData.escuela : formData.programa} readOnly />
              </FormField>
              <FormField label="Título">
                <Input value={formData.titulo} readOnly />
              </FormField>
              <ColumnLayout columns={3}>
                <FormField label="Tipo">
                  <Select
                    selectedOption={{ label: formData.tipo, value: formData.tipo }}
                    options={[
                      { label: 'Tesis', value: 'Tesis' },
                      { label: 'Trabajo de investigación', value: 'Trabajo de investigación' }
                    ]}
                    readOnly
                  />
                </FormField>
                <FormField label="Grado">
                  <Select
                    selectedOption={{ label: formData.grado, value: formData.grado }}
                    options={gradoOptions}
                    readOnly
                  />
                </FormField>
                <FormField label="Año">
                  <Input value={formData.year} readOnly />
                </FormField>
              </ColumnLayout>
            </SpaceBetween>
          </Container>
          {formData.autores.map((autor, index) => (
            <Container
              key={index}
              header={<Header variant="h5">{formData.autores.length > 1 ? `Datos del Autor ${index + 1}` : 'Datos del Autor'}</Header>}
            >
              <ColumnLayout columns={2}>
                <FormField label="Nombres">
                  <Input
                    value={loadingState.autores[index] ? 'Cargando...' : autor.nombre}
                    readOnly
                  />
                </FormField>
                <FormField label="Apellidos">
                  <Input
                    value={loadingState.autores[index] ? 'Cargando...' : autor.apellido}
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
                    readOnly
                  />
                </FormField>
                <FormField label="Número de Documento">
                  <Input
                    value={autor.dni}
                    readOnly
                  />
                </FormField>
                <FormField label="Teléfono">
                  <Input
                    value={loadingState.autores[index] ? 'Cargando...' : autor.telefono}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout>
                <FormField label="Email UNMSM">
                  <Input
                    value={loadingState.autores[index] ? 'Cargando...' : autor.email}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout>
                <FormField label="URL de ORCID">
                  <Input
                    value={loadingState.autores[index] ? 'Cargando...' : autor.orcid}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
            </Container>
          ))}
          {formData.asesores.map((asesor, index) => (
            <Container
              key={index}
              header={<Header variant="h5">{formData.asesores.length > 1 ? `Datos del Asesor ${index + 1}` : 'Datos del Asesor'}</Header>}
            >

              <ColumnLayout columns={2}>
                <FormField label="Tipo de Documento">
                  <Select
                    selectedOption={{ label: asesor.tipoDocumento, value: asesor.tipoDocumento }}
                    options={[
                      { label: 'DNI', value: 'DNI' },
                      { label: 'Pasaporte', value: 'Pasaporte' }
                    ]}
                    readOnly
                  />
                </FormField>
                <FormField label="Número de Documento">
                  <Input
                    value={asesor.dni}
                    readOnly
                  />
                </FormField>

              </ColumnLayout>
              <ColumnLayout columns={2}>
                <FormField label="Nombres">
                  <Input
                    value={loadingState.asesores[index] ? 'Cargando...' : asesor.nombre}
                    readOnly
                  />
                </FormField>
                <FormField label="Apellidos">
                  <Input
                    value={loadingState.asesores[index] ? 'Cargando...' : asesor.apellido}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>

              <ColumnLayout columns={2}>
                <FormField label="Grado">
                  <Select
                    selectedOption={{ label: asesor.grado, value: asesor.grado }}
                    options={gradoOptions}
                    readOnly
                  />
                </FormField>

                <FormField label="URL de ORCID">
                  <Input
                    value={loadingState.asesores[index] ? 'Cargando...' : asesor.orcid}
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

export default TesisModalVer;
