import React, { useState, useEffect, useContext } from 'react';
import ModalTwoCol from './ModalTwoCol';
import { Button, FormField, Input, Select, SpaceBetween, Container, Header, ColumnLayout, Icon, DatePicker } from '@cloudscape-design/components';
import UserContext from '../../../contexts/UserContext';

const MetadatosModal = ({ onClose, autores, jurados, onSave }) => {
  const { user } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [showForm, setShowForm] = useState(false); // Default to true since no file upload required
  const [formData, setFormData] = useState({
    autores: autores,
    jurados: jurados,
    lineaInvestigacion: '',
    grupoInvestigacion: '',
    agenciaFinanciamiento: '',
    ubicacion: {
      pais: 'Perú',
      departamento: '',
      provincia: '',
      distrito: '',
      direccion: '',
      latitud: '',
      longitud: ''
    },
    anoInvestigacion: '',
    urlDisciplinasOCDE: '',
    ubicacionOpcional: [],
  });

  const [countries, setCountries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [anoInvestigacionType, setAnoInvestigacionType] = useState('');

  useEffect(() => {
    // Fetch countries data
    fetch('https://raw.githubusercontent.com/millan2993/countries/master/json/countries.json')
      .then(response => response.json())
      .then(data => {
        const sortedCountries = data.countries.sort((a, b) => a.name === 'Perú' ? -1 : a.name.localeCompare(b.name));
        setCountries(sortedCountries.map(country => ({ label: country.name, value: country.name })));
      });

    // Fetch departments data
    fetch('https://raw.githubusercontent.com/ernestorivero/Ubigeo-Peru/master/json/ubigeo_peru_2016_departamentos.json')
      .then(response => response.json())
      .then(data => {
        setDepartments(data.map(department => ({ label: department.name, value: department.id })));
      });

    // Fetch provinces data
    fetch('https://raw.githubusercontent.com/ernestorivero/Ubigeo-Peru/master/json/ubigeo_peru_2016_provincias.json')
      .then(response => response.json())
      .then(data => {
        setProvinces(data);
      });

    // Fetch districts data
    fetch('https://raw.githubusercontent.com/ernestorivero/Ubigeo-Peru/master/json/ubigeo_peru_2016_distritos.json')
      .then(response => response.json())
      .then(data => {
        setDistricts(data);
      });
  }, []);

  const handleInputChange = (key, value, type = 'ubicacion') => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value
      }
    }));

    // Filter dependent dropdowns
    if (key === 'departamento' && type === 'ubicacion') {
      const filteredProvinces = provinces.filter(province => province.department_id === value);
      setFilteredProvinces(filteredProvinces.map(province => ({ label: province.name, value: province.id })));
      setFilteredDistricts([]);
      setFormData(prev => ({
        ...prev,
        ubicacion: {
          ...prev.ubicacion,
          provincia: '',
          distrito: ''
        }
      }));
    }

    if (key === 'provincia' && type === 'ubicacion') {
      const filteredDistricts = districts.filter(district => district.province_id === value);
      setFilteredDistricts(filteredDistricts.map(district => ({ label: district.name, value: district.id })));
      setFormData(prev => ({
        ...prev,
        ubicacion: {
          ...prev.ubicacion,
          distrito: ''
        }
      }));
    }
  };

  const handleSelectChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const isFormComplete = () => {
    // Check if all required fields are filled
    const requiredFields = [
      formData.lineaInvestigacion,
      formData.grupoInvestigacion,
      formData.agenciaFinanciamiento,
      formData.ubicacion.pais,
      formData.ubicacion.departamento,
      formData.ubicacion.provincia,
      formData.ubicacion.distrito,
      formData.ubicacion.direccion,
      formData.ubicacion.latitud,
      formData.ubicacion.longitud,
      formData.anoInvestigacion,
      formData.urlDisciplinasOCDE,
      ...formData.autores.flatMap(autor => [
        String(autor.nombre),
        String(autor.apellido),
        String(autor.dni),
        String(autor.orcid)
      ]),
      ...formData.jurados.flatMap(jurado => [
        String(jurado.nombre),
        String(jurado.apellido),
        String(jurado.dni)
      ])
    ];
    return requiredFields.every(field => typeof field === 'string' && field.trim().length > 0);
  };

  const handleAnoInvestigacionChange = ({ detail }) => {
    setAnoInvestigacionType(detail.selectedOption.value);
  };

  const handleAddOptionalField = (type) => {
    setFormData(prev => ({
      ...prev,
      ubicacionOpcional: [
        ...prev.ubicacionOpcional,
        { type, value: '' }
      ]
    }));
  };

  const handleOptionalFieldChange = (index, value) => {
    setFormData(prev => {
      const updatedOpcional = [...prev.ubicacionOpcional];
      updatedOpcional[index].value = value;
      return { ...prev, ubicacionOpcional: updatedOpcional };
    });
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
      isFormComplete={isFormComplete}
      formContent={
        <SpaceBetween direction="vertical" size="l">
          <Container header={<Header variant="h3">Autores</Header>}>
            {formData.autores.map((autor, index) => (
              <ColumnLayout key={index} columns={2}>
                <FormField label="Nombres">
                  <Input value={autor.nombre} readOnly onChange={() => {}} />
                </FormField>
                <FormField label="Apellidos">
                  <Input value={autor.apellido} readOnly onChange={() => {}} />
                </FormField>
                <FormField label="Tipo de Documento">
                  <Input value="DNI" readOnly onChange={() => {}} />
                </FormField>
                <FormField label="Número de Documento">
                  <Input value={autor.dni} readOnly onChange={() => {}} />
                </FormField>
                <FormField label="URL de ORCID">
                  <Input value={autor.orcid} onChange={({ detail }) => {
                    setFormData(prev => {
                      const updatedAutores = [...prev.autores];
                      updatedAutores[index].orcid = detail.value;
                      return { ...prev, autores: updatedAutores };
                    });
                  }} />
                </FormField>
              </ColumnLayout>
            ))}
          </Container>
          <Container header={<Header variant="h3">Jurados</Header>}>
            {formData.jurados.map((jurado, index) => (
              <ColumnLayout key={index} columns={2}>
                <FormField label="Nombres">
                  <Input value={jurado.nombre} readOnly onChange={() => {}} />
                </FormField>
                <FormField label="Apellidos">
                  <Input value={jurado.apellido} readOnly onChange={() => {}} />
                </FormField>
                <FormField label="Tipo de Documento">
                  <Input value="DNI" readOnly onChange={() => {}} />
                </FormField>
                <FormField label="Número de Documento">
                  <Input value={jurado.dni} readOnly onChange={() => {}} />
                </FormField>
              </ColumnLayout>
            ))}
          </Container>
          <Container header={<Header variant="h3">Información Adicional</Header>}>
            <FormField label="Línea de Investigación">
              <Select
                selectedOption={{ label: formData.lineaInvestigacion, value: formData.lineaInvestigacion }}
                options={[
                  { label: 'A.1.1.1. Biodiversidad y Ecología de Ecosistemas Acuáticos', value: 'A.1.1.1. Biodiversidad y Ecología de Ecosistemas Acuáticos' },
                  { label: 'A.1.1.2. Biodiversidad y Ecología de Ecosistemas terrestres', value: 'A.1.1.2. Biodiversidad y Ecología de Ecosistemas terrestres' },
                  // Agrega todas las opciones aquí
                ]}
                onChange={({ detail }) => handleSelectChange('lineaInvestigacion', detail.selectedOption.value)}
              />
            </FormField>
            <FormField label="Grupo de Investigación">
              <Select
                selectedOption={{ label: formData.grupoInvestigacion, value: formData.grupoInvestigacion }}
                options={[
                  { label: 'No aplica', value: 'No aplica' },
                  { label: 'Grupo de Investigación 1', value: 'Grupo de Investigación 1' },
                  { label: 'Grupo de Investigación 2', value: 'Grupo de Investigación 2' },
                  // Agrega todas las opciones aquí
                ]}
                disabled={user.grado_id === 1}
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
                <Select
                  selectedOption={{ label: formData.ubicacion.pais, value: formData.ubicacion.pais }}
                  options={countries}
                  onChange={({ detail }) => handleInputChange('pais', detail.selectedOption.value)}
                />
              </FormField>
              {formData.ubicacion.pais === 'Perú' ? (
                <>
                  <FormField label="Departamento">
                    <Select
                      selectedOption={{ label: departments.find(d => d.value === formData.ubicacion.departamento)?.label, value: formData.ubicacion.departamento }}
                      options={departments}
                      onChange={({ detail }) => handleInputChange('departamento', detail.selectedOption.value)}
                      filteringType="auto"
                    />
                  </FormField>
                  <FormField label="Provincia">
                    <Select
                      selectedOption={{ label: filteredProvinces.find(p => p.value === formData.ubicacion.provincia)?.label, value: formData.ubicacion.provincia }}
                      options={filteredProvinces}
                      onChange={({ detail }) => handleInputChange('provincia', detail.selectedOption.value)}
                      filteringType="auto"
                    />
                  </FormField>
                  <FormField label="Distrito">
                    <Select
                      selectedOption={{ label: filteredDistricts.find(d => d.value === formData.ubicacion.distrito)?.label, value: formData.ubicacion.distrito }}
                      options={filteredDistricts}
                      onChange={({ detail }) => handleInputChange('distrito', detail.selectedOption.value)}
                      filteringType="auto"
                    />
                  </FormField>
                </>
              ) : (
                <>
                  <FormField label="Departamento">
                    <Input
                      value={formData.ubicacion.departamento}
                      onChange={({ detail }) => handleInputChange('departamento', detail.value)}
                    />
                  </FormField>
                  <FormField label="Provincia">
                    <Input
                      value={formData.ubicacion.provincia}
                      onChange={({ detail }) => handleInputChange('provincia', detail.value)}
                    />
                  </FormField>
                  <FormField label="Distrito">
                    <Input
                      value={formData.ubicacion.distrito}
                      onChange={({ detail }) => handleInputChange('distrito', detail.value)}
                    />
                  </FormField>
                </>
              )}
              <FormField label="Dirección">
                <Input
                  value={formData.ubicacion.direccion}
                  onChange={({ detail }) => handleInputChange('direccion', detail.value)}
                />
              </FormField>
              <FormField label="Latitud">
                <Input
                  value={formData.ubicacion.latitud}
                  onChange={({ detail }) => handleInputChange('latitud', detail.value)}
                />
              </FormField>
              <FormField label="Longitud">
                <Input
                  value={formData.ubicacion.longitud}
                  onChange={({ detail }) => handleInputChange('longitud', detail.value)}
                />
              </FormField>
            </ColumnLayout>
            <Button iconName="add-plus" onClick={() => handleAddOptionalField('address')} iconAlign="left">Agregar campo opcional</Button>
            {formData.ubicacionOpcional.map((field, index) => (
              <FormField key={index} label={`Campo Opcional ${index + 1}`}>
                <Input
                  value={field.value}
                  onChange={({ detail }) => handleOptionalFieldChange(index, detail.value)}
                  placeholder="Ingrese el valor"
                />
              </FormField>
            ))}
            <FormField label="Año o rango de años en que se realizó la investigación">
              <Select
                selectedOption={{ label: anoInvestigacionType, value: anoInvestigacionType }}
                options={[
                  { label: 'Un año', value: 'Un año' },
                  { label: 'Intervalo de año', value: 'Intervalo de año' },
                  { label: 'Un año con mes', value: 'Un año con mes' },
                  { label: 'Intervalo de año con meses', value: 'Intervalo de año con meses' },
                ]}
                onChange={handleAnoInvestigacionChange}
              />
            </FormField>
            {anoInvestigacionType === 'Un año' && (
              <FormField label="Año">
                <Select
                  selectedOption={{ label: formData.anoInvestigacion, value: formData.anoInvestigacion }}
                  options={Array.from({ length: 6 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return { label: String(year), value: String(year) };
                  })}
                  onChange={({ detail }) => handleSelectChange('anoInvestigacion', detail.selectedOption.value)}
                />
              </FormField>
            )}
            {anoInvestigacionType === 'Intervalo de año' && (
              <ColumnLayout columns={2}>
                <FormField label="Desde">
                  <Select
                    selectedOption={{ label: formData.anoInvestigacion, value: formData.anoInvestigacion }}
                    options={Array.from({ length: 6 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return { label: String(year), value: String(year) };
                    })}
                    onChange={({ detail }) => handleSelectChange('anoInvestigacionDesde', detail.selectedOption.value)}
                  />
                </FormField>
                <FormField label="Hasta">
                  <Select
                    selectedOption={{ label: formData.anoInvestigacionHasta, value: formData.anoInvestigacionHasta }}
                    options={Array.from({ length: 6 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return { label: String(year), value: String(year) };
                    })}
                    onChange={({ detail }) => handleSelectChange('anoInvestigacionHasta', detail.selectedOption.value)}
                  />
                </FormField>
              </ColumnLayout>
            )}
            {anoInvestigacionType === 'Un año con mes' && (
              <FormField label="Fecha">
                <DatePicker
                  value={formData.anoInvestigacionConMes}
                  onChange={({ detail }) => handleSelectChange('anoInvestigacionConMes', detail.value)}
                  granularity="month"
                />
              </FormField>
            )}
            {anoInvestigacionType === 'Intervalo de año con meses' && (
              <ColumnLayout columns={2}>
                <FormField label="Desde">
                  <DatePicker
                    value={formData.anoInvestigacionDesdeConMes}
                    onChange={({ detail }) => handleSelectChange('anoInvestigacionDesdeConMes', detail.value)}
                    granularity="month"
                  />
                </FormField>
                <FormField label="Hasta">
                  <DatePicker
                    value={formData.anoInvestigacionHastaConMes}
                    onChange={({ detail }) => handleSelectChange('anoInvestigacionHastaConMes', detail.value)}
                    granularity="month"
                  />
                </FormField>
              </ColumnLayout>
            )}
            <FormField label="URL de disciplinas OCDE">
              <Input
                value={formData.urlDisciplinasOCDE}
                onChange={({ detail }) => handleSelectChange('urlDisciplinasOCDE', detail.value)}
              />
            </FormField>
          </Container>
        </SpaceBetween>
      }
    />
  );
};

export default MetadatosModal;
