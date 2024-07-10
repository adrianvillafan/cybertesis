import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import ModalTwoCol from './ModalTwoCol';
import { Button, FormField, Input, Multiselect, Select, SpaceBetween, Container, Header, ColumnLayout, DatePicker } from '@cloudscape-design/components';
import UserContext from '../../../contexts/UserContext';
import { fetchDatosByDni, fetchTesisById, fetchActaById, uploadMetadataFile, createMetadata, fetchLineasInvestigacion, fetchGruposInvestigacion, fetchDisciplinasOCDE } from '../../../../../../api';

const MetadatosModal = ({ onClose, onSave, documentos }) => {
  const { user } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    autores: [],
    jurados: [],
    presidente: {},
    asesores: [],
    lineaInvestigacion: '',
    grupoInvestigacion: '',
    agenciaFinanciamiento: '',
    pais: 'Perú',
    departamento: '',
    provincia: '',
    distrito: '',
    direccion: '',
    latitud: '',
    longitud: '',
    anoInicio: '',
    anoFin: '',
    anoInvestigacionType: '',
    urlDisciplinasOCDE: []
  });
  const [lineasInvestigacion, setLineasInvestigacion] = useState([]);
  const [gruposInvestigacion, setGruposInvestigacion] = useState([]);
  const [disciplinasOCDE, setDisciplinasOCDE] = useState([]);

  const timerRef = useRef(null);

  useEffect(() => {
    const fetchParticipantsData = async () => {
      try {
        const tesisData = await fetchTesisById(documentos.tesis_id);
        console.log('tesisData:', tesisData);

        const autores = [];
        if (tesisData.autor1_dni) {
          const tipoDocumento1 = isNaN(tesisData.autor1_dni) ? 2 : 1;
          autores.push(await fetchDatosByDni(tipoDocumento1, tesisData.autor1_dni));
        }
        if (tesisData.autor2_dni) {
          const tipoDocumento2 = isNaN(tesisData.autor2_dni) ? 2 : 1;
          autores.push(await fetchDatosByDni(tipoDocumento2, tesisData.autor2_dni));
        }

        const actaData = await fetchActaById(documentos.actasust_id);
        console.log('actaData:', actaData);

        const presidente = actaData.presidente_dni ? await fetchDatosByDni(isNaN(actaData.presidente_dni) ? 2 : 1, actaData.presidente_dni) : {};

        const jurados = [];
        if (actaData.miembro1_dni) {
          const tipoDocumento1 = isNaN(actaData.miembro1_dni) ? 2 : 1;
          jurados.push(await fetchDatosByDni(tipoDocumento1, actaData.miembro1_dni));
        }
        if (actaData.miembro2_dni) {
          const tipoDocumento2 = isNaN(actaData.miembro2_dni) ? 2 : 1;
          jurados.push(await fetchDatosByDni(tipoDocumento2, actaData.miembro2_dni));
        }
        if (actaData.miembro3_dni) {
          const tipoDocumento3 = isNaN(actaData.miembro3_dni) ? 2 : 1;
          jurados.push(await fetchDatosByDni(tipoDocumento3, actaData.miembro3_dni));
        }

        const asesores = [];
        if (tesisData.asesor1_dni) {
          const tipoDocumento1 = isNaN(tesisData.asesor1_dni) ? 2 : 1;
          asesores.push(await fetchDatosByDni(tipoDocumento1, tesisData.asesor1_dni));
        }
        if (tesisData.asesor2_dni) {
          const tipoDocumento2 = isNaN(tesisData.asesor2_dni) ? 2 : 1;
          asesores.push(await fetchDatosByDni(tipoDocumento2, tesisData.asesor2_dni));
        }

        console.log('autores:', autores);
        console.log('presidente:', presidente);
        console.log('jurados:', jurados);
        console.log('asesores:', asesores);

        setFormData(prev => ({
          ...prev,
          presidente,
          jurados,
          asesores,
          autores
        }));
      } catch (error) {
        console.error('Error al obtener datos de participantes:', error);
      }
    };

    fetchParticipantsData();
  }, [documentos]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lineas, grupos, disciplinas] = await Promise.all([
          fetchLineasInvestigacion(),
          fetchGruposInvestigacion(user.facultad_id),
          fetchDisciplinasOCDE()
        ]);
        setLineasInvestigacion(lineas.map(linea => ({ label: linea.linea, value: String(linea.id) })));
        setGruposInvestigacion(grupos.map(grupo => ({ label: `${grupo.grupo_nombre} (${grupo.grupo_nombre_corto})`, value: String(grupo.id) })));
        setDisciplinasOCDE(disciplinas.map(disciplina => ({ label: disciplina.disciplina, value: String(disciplina.id) })));
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchData();
  }, [documentos.facultad_id]);

  const fetchLocationData = async (lat, lon) => {
    try {
      const response = await fetch(`https://us1.locationiq.com/v1/reverse?key=pk.35749067d8b52db39f835a2b3cf77387&lat=${lat}&lon=${lon}&format=json`);
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      const data = await response.json();
      return {
        pais: data.address.country || '',
        departamento: data.address.region || data.address.state,
        provincia: data.address.county || data.address.region,
        distrito: data.address.city || '',
        direccion: data.display_name || ''
      };
    } catch (error) {
      console.error('Error al obtener datos de ubicación:', error);
      return {
        pais: 'Perú',
        departamento: '',
        provincia: '',
        distrito: '',
        direccion: ''
      };
    }
  };

  const debounceFetchLocationData = useCallback((lat, lon) => {
    const handleFetch = async () => {
      if (lat && lon) {
        setFormData(prev => ({
          ...prev,
          pais: 'Cargando...',
          departamento: 'Cargando...',
          provincia: 'Cargando...',
          distrito: 'Cargando...'
        }));
        const locationData = await fetchLocationData(lat, lon);
        setFormData(prev => ({
          ...prev,
          pais: locationData.pais,
          departamento: locationData.departamento,
          provincia: locationData.provincia,
          distrito: locationData.distrito,
          direccion: locationData.direccion
        }));
      }
    };

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(handleFetch, 4000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleLatLongChange = (lat, lon) => {
    setFormData(prev => ({
      ...prev,
      latitud: lat,
      longitud: lon
    }));
    debounceFetchLocationData(lat, lon);
  };

  const handleSelectChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: String(value)
    }));
  };

  const handleMultiselectChange = (key, selectedOptions) => {
    if (selectedOptions.length <= 3) {
      setFormData(prev => ({
        ...prev,
        [key]: selectedOptions
      }));
    }
  };

  const handleAnoInvestigacionChange = (value) => {
    setFormData(prev => ({
      ...prev,
      anoInvestigacionType: value
    }));
  };

  const handleSave = async () => {
    const metadataData = {
      ...formData,
      created_by: user.user_id,
      updated_by: user.user_id,
      documentos_id: documentos.id
    };

    try {
      if (file) {
        const uploadResponse = await uploadMetadataFile(file);
        metadataData.file_url = uploadResponse.fileName;
      }
      await createMetadata(metadataData);
      onSave();
      onClose();
    } catch (error) {
      console.error('Error al guardar metadata:', error);
    }
  };

  const isFormComplete = () => {
    const requiredFields = [
      formData.lineaInvestigacion,
      formData.grupoInvestigacion,
      formData.agenciaFinanciamiento,
      formData.pais,
      formData.departamento,
      formData.provincia,
      formData.distrito,
      formData.latitud,
      formData.longitud,
      formData.anoInicio,
      formData.anoFin
    ];
    return requiredFields.every(field => field && field.trim().length > 0);
  };

  return (
    <ModalTwoCol
      onClose={onClose}
      headerText="Hoja de Metadatos"
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
      mode={'upload'}
      isFormComplete={isFormComplete}
      formContent={
        <SpaceBetween direction="vertical" size="l">
          {formData.autores.length > 0 && (
            <Container header={<Header variant="h3">Autor</Header>}>
              {formData.autores.map((autor, index) => (
                <ColumnLayout key={index} columns={2}>
                  <FormField label="Nombres">
                    <Input value={autor.nombre} readOnly />
                  </FormField>
                  <FormField label="Apellidos">
                    <Input value={autor.apellido} readOnly />
                  </FormField>
                  <FormField label="Tipo de Documento">
                    <Input value="DNI" readOnly />
                  </FormField>
                  <FormField label="Número de Documento">
                    <Input value={autor.identificacion_id} readOnly />
                  </FormField>
                  <FormField label="URL de ORCID">
                    <Input value={autor.orcid} readOnly />
                  </FormField>
                </ColumnLayout>
              ))}
            </Container>
          )}
          {formData.asesores.length > 0 && (
            formData.asesores.map((asesor, index) => (
              <Container key={index} header={<Header variant="h3">{index === 0 ? "Asesor" : "Asesor 2"}</Header>}>
                <ColumnLayout columns={2}>
                  <FormField label="Nombres">
                    <Input value={asesor.nombre} readOnly />
                  </FormField>
                  <FormField label="Apellidos">
                    <Input value={asesor.apellido} readOnly />
                  </FormField>
                  <FormField label="Tipo de Documento">
                    <Input value="DNI" readOnly />
                  </FormField>
                  <FormField label="Número de Documento">
                    <Input value={asesor.identificacion_id} readOnly />
                  </FormField>
                </ColumnLayout>
              </Container>
            ))
          )}
          {formData.presidente && (
            <Container header={<Header variant="h3">Presidente</Header>}>
              <ColumnLayout columns={2}>
                <FormField label="Nombres">
                  <Input value={formData.presidente.nombre} readOnly />
                </FormField>
                <FormField label="Apellidos">
                  <Input value={formData.presidente.apellido} readOnly />
                </FormField>
                <FormField label="Tipo de Documento">
                  <Input value="DNI" readOnly />
                </FormField>
                <FormField label="Número de Documento">
                  <Input value={formData.presidente.identificacion_id} readOnly />
                </FormField>
              </ColumnLayout>
            </Container>
          )}
          {formData.jurados.length > 0 && (
            formData.jurados.map((jurado, index) => (
              <Container key={index} header={<Header variant="h3">{`Jurado ${index + 1}`}</Header>}>
                <ColumnLayout columns={2}>
                  <FormField label="Nombres">
                    <Input value={jurado.nombre} readOnly />
                  </FormField>
                  <FormField label="Apellidos">
                    <Input value={jurado.apellido} readOnly />
                  </FormField>
                  <FormField label="Tipo de Documento">
                    <Input value="DNI" readOnly />
                  </FormField>
                  <FormField label="Número de Documento">
                    <Input value={jurado.identificacion_id} readOnly />
                  </FormField>
                </ColumnLayout>
              </Container>
            ))
          )}
          <Container header={<Header variant="h3">Información Adicional</Header>}>
            <FormField label="Línea de Investigación">
              <Select
                selectedOption={{ label: lineasInvestigacion.find(l => l.value === formData.lineaInvestigacion)?.label, value: formData.lineaInvestigacion }}
                options={lineasInvestigacion}
                filteringType="auto"
                onChange={({ detail }) => handleSelectChange('lineaInvestigacion', detail.selectedOption.value)}
              />
            </FormField>
            <FormField label="Grupo de Investigación">
              <Select
                selectedOption={{ label: gruposInvestigacion.find(g => g.value === formData.grupoInvestigacion)?.label, value: formData.grupoInvestigacion }}
                options={gruposInvestigacion}
                filteringType="auto"
                onChange={({ detail }) => handleSelectChange('grupoInvestigacion', detail.selectedOption.value)}
              />
            </FormField>
            <FormField label="Agencia de Financiamiento">
              <Select
                selectedOption={{ label: formData.agenciaFinanciamiento, value: formData.agenciaFinanciamiento }}
                options={[
                  { label: 'Financiado', value: 'Financiado' },
                  { label: 'Sin financiamiento', value: 'Sin financiamiento' }
                ]}
                onChange={({ detail }) => handleSelectChange('agenciaFinanciamiento', detail.selectedOption.value)}
              />
            </FormField>
            <Header variant="h4">Ubicación Geográfica de la Investigación</Header>
            <ColumnLayout columns={2}>
              <FormField label="País">
                <Input value={formData.pais} readOnly />
              </FormField>
              <FormField label="Departamento">
                <Input value={formData.departamento} readOnly />
              </FormField>
              <FormField label="Provincia">
                <Input value={formData.provincia} readOnly />
              </FormField>
              <FormField label="Distrito">
                <Input value={formData.distrito} readOnly />
              </FormField>
              <FormField label="Latitud">
                <Input
                  value={formData.latitud}
                  onChange={({ detail }) => handleLatLongChange(detail.value, formData.longitud)}
                />
              </FormField>
              <FormField label="Longitud">
                <Input
                  value={formData.longitud}
                  onChange={({ detail }) => handleLatLongChange(formData.latitud, detail.value)}
                />
              </FormField>
            </ColumnLayout>
            <FormField label="Año o rango de años en que se realizó la investigación">
              <Select
                selectedOption={{ label: formData.anoInvestigacionType, value: formData.anoInvestigacionType }}
                options={[
                  { label: 'Un año', value: 'Un año' },
                  { label: 'Intervalo de año', value: 'Intervalo de año' },
                  { label: 'Un año con mes', value: 'Un año con mes' },
                  { label: 'Intervalo de año con meses', value: 'Intervalo de año con meses' },
                ]}
                onChange={({ detail }) => handleAnoInvestigacionChange(detail.selectedOption.value)}
              />
            </FormField>
            {formData.anoInvestigacionType === 'Un año' && (
              <FormField label="Año">
                <Select
                  selectedOption={{ label: formData.anoInicio, value: formData.anoInicio }}
                  options={Array.from({ length: 6 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return { label: String(year), value: String(year) };
                  })}
                  onChange={({ detail }) => handleSelectChange('anoInicio', detail.selectedOption.value)}
                />
              </FormField>
            )}
            {formData.anoInvestigacionType === 'Intervalo de año' && (
              <ColumnLayout columns={2}>
                <FormField label="Desde">
                  <Select
                    selectedOption={{ label: formData.anoInicio, value: formData.anoInicio }}
                    options={Array.from({ length: 6 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return { label: String(year), value: String(year) };
                    })}
                    onChange={({ detail }) => handleSelectChange('anoInicio', detail.selectedOption.value)}
                  />
                </FormField>
                <FormField label="Hasta">
                  <Select
                    selectedOption={{ label: formData.anoFin, value: formData.anoFin }}
                    options={Array.from({ length: 6 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return { label: String(year), value: String(year) };
                    })}
                    onChange={({ detail }) => handleSelectChange('anoFin', detail.selectedOption.value)}
                  />
                </FormField>
              </ColumnLayout>
            )}
            {formData.anoInvestigacionType === 'Un año con mes' && (
              <FormField label="Fecha">
                <DatePicker
                  value={formData.anoInicio}
                  onChange={({ detail }) => handleSelectChange('anoInicio', detail.value)}
                  granularity="month"
                />
              </FormField>
            )}
            {formData.anoInvestigacionType === 'Intervalo de año con meses' && (
              <ColumnLayout columns={2}>
                <FormField label="Desde">
                  <DatePicker
                    value={formData.anoInicio}
                    onChange={({ detail }) => handleSelectChange('anoInicio', detail.value)}
                    granularity="month"
                  />
                </FormField>
                <FormField label="Hasta">
                  <DatePicker
                    value={formData.anoFin}
                    onChange={({ detail }) => handleSelectChange('anoFin', detail.value)}
                    granularity="month"
                  />
                </FormField>
              </ColumnLayout>
            )}
            <FormField label="URL de Disciplinas OCDE">
              <Multiselect
                selectedOptions={formData.urlDisciplinasOCDE}
                onChange={({ detail }) => handleMultiselectChange('urlDisciplinasOCDE', detail.selectedOptions)}
                options={disciplinasOCDE}
                filteringType="auto"
                placeholder="Seleccione hasta 3 disciplinas"
              />
            </FormField>
          </Container>
        </SpaceBetween>
      }
    />
  );
};

export default MetadatosModal;
