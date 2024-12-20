import React, { useState } from 'react';
import '../Formconfig/Styles.css';
import ColumnLayout from "@cloudscape-design/components/column-layout";
import {
  Container,
  SpaceBetween,
  FormField,
  Input,
  Button,
  Autosuggest,
  Select,
  Header,
} from '@cloudscape-design/components';

const Asesor = () => {
  // Estado para Asesores, Jurados, ORCID y Tipos de Documento
  const [asesores, setAsesores] = useState([{ id: 1, value: '' }]);
  const [jurados, setJurados] = useState([{ id: 1, value: '' }]);
  const [documentosAutor, setDocumentosAutor] = useState([{ id: 1, tipo: { label: 'Creative commons', value: '1' }, numero: '' }]);
  const [documentosAsesor, setDocumentosAsesor] = useState([{ id: 1, tipo: { label: 'Creative commons', value: '1' }, numero: '' }]);
  const [orcids, setOrcids] = useState([{ id: 1, value: '' }]);
  const [tipoTrabajo, setTipoTrabajo] = useState('');
  const [nombreGrado, setNombreGrado] = useState('');
  const [gradoAcademico, setGradoAcademico] = useState('');
  const [nombrePrograma, setNombrePrograma] = useState('');
  const [codigoPrograma, setCodigoPrograma] = useState('');
  const [institucionGrado, setInstitucionGrado] = useState('');

  // Función para manejar cambios en los asesores
  const handleAsesorChange = (id, newValue) => {
    setAsesores(asesores.map(asesor => (asesor.id === id ? { ...asesor, value: newValue } : asesor)));
  };

  const addAsesor = () => {
    setAsesores([...asesores, { id: asesores.length + 1, value: '' }]);
  };

  const removeAsesor = (id) => {
    setAsesores(asesores.filter(asesor => asesor.id !== id));
  };

  // Función para manejar cambios en los jurados
  const handleJuradoChange = (id, newValue) => {
    setJurados(jurados.map(jurado => (jurado.id === id ? { ...jurado, value: newValue } : jurado)));
  };

  const addJurado = () => {
    setJurados([...jurados, { id: jurados.length + 1, value: '' }]);
  };

  const removeJurado = (id) => {
    setJurados(jurados.filter(jurado => jurado.id !== id));
  };

  // Funciones para manejar los documentos (Autor)
  const handleDocumentoAutorChange = (id, field, value) => {
    setDocumentosAutor(documentosAutor.map(doc => (doc.id === id ? { ...doc, [field]: value } : doc)));
  };

  const addDocumentoAutor = () => {
    setDocumentosAutor([...documentosAutor, { id: documentosAutor.length + 1, tipo: { label: 'Creative commons', value: '1' }, numero: '' }]);
  };

  const removeDocumentoAutor = (id) => {
    setDocumentosAutor(documentosAutor.filter(doc => doc.id !== id));
  };

  // Funciones para manejar los documentos (Asesor)
  const handleDocumentoAsesorChange = (id, field, value) => {
    setDocumentosAsesor(documentosAsesor.map(doc => (doc.id === id ? { ...doc, [field]: value } : doc)));
  };

  const addDocumentoAsesor = () => {
    setDocumentosAsesor([...documentosAsesor, { id: documentosAsesor.length + 1, tipo: { label: 'Creative commons', value: '1' }, numero: '' }]);
  };

  const removeDocumentoAsesor = (id) => {
    setDocumentosAsesor(documentosAsesor.filter(doc => doc.id !== id));
  };

  // Funciones para manejar ORCID
  const handleOrcidChange = (id, value) => {
    setOrcids(orcids.map(orcid => (orcid.id === id ? { ...orcid, value } : orcid)));
  };

  const addOrcid = () => {
    setOrcids([...orcids, { id: orcids.length + 1, value: '' }]);
  };

  const removeOrcid = (id) => {
    setOrcids(orcids.filter(orcid => orcid.id !== id));
  };

  return (
    <Container header={<Header variant="h2">Datos Adicionales</Header>}>
      <SpaceBetween direction="vertical" size="l">
        {/* Código de País */}
        <FormField label="Código de País de Publicación">
          <Input />
        </FormField>

        {/* Tipo de Documento y Número (Autor) */}
        <FormField label="Tipo de Documento y Número (Autor)">
          <SpaceBetween direction="vertical" size="s">
            {documentosAutor.map((doc, index) => (
              <ColumnLayout key={doc.id} columns={3} borders="vertical">
                <Select
                  selectedOption={doc.tipo}
                  onChange={({ detail }) => handleDocumentoAutorChange(doc.id, 'tipo', detail.selectedOption)}
                  options={[
                    { label: 'Creative commons', value: '1' },
                    { label: 'Option 2', value: '2' },
                    { label: 'Option 3', value: '3' },
                  ]}
                  placeholder={`Tipo de Documento ${doc.id}`}
                />
                <Input
                  value={doc.numero}
                  onChange={({ detail }) => handleDocumentoAutorChange(doc.id, 'numero', detail.value)}
                  placeholder={`Número de Documento ${doc.id}`}
                />
                {index > 0 && (
                  <Button
                    onClick={() => removeDocumentoAutor(doc.id)}
                    variant="normal"
                    className="button-eliminar"
                  >
                    Eliminar
                  </Button>
                )}
              </ColumnLayout>
            ))}
            <Button onClick={addDocumentoAutor}>Agregar Documento</Button>
          </SpaceBetween>
        </FormField>


        {/* Asesores */}
        <FormField label="Asesor(es)">
          <SpaceBetween direction="vertical" size="s">
            {asesores.map((asesor, index) => (
              <div key={asesor.id} className="form-automatico">
                <Autosuggest
                  onChange={({ detail }) => handleAsesorChange(asesor.id, detail.value)}
                  value={asesor.value}
                  options={[{ value: 'Asesor 1' }, { value: 'Asesor 2' }]}
                  placeholder={`Asesor ${asesor.id}`}
                />
                {index > 0 && <Button onClick={() => removeAsesor(asesor.id)} variant="normal" className="button-eliminar">Eliminar</Button>}
              </div>
            ))}
            <Button onClick={addAsesor}>Agregar Asesor</Button>
          </SpaceBetween>
        </FormField>

        {/* ORCID */}
        <FormField label="ORCID (Asesor)">
          <SpaceBetween direction="vertical" size="l">
            {orcids.map((orcid, index) => (
              <div key={orcid.id} className="form-automatico">
                <Input
                  value={orcid.value}
                  onChange={({ detail }) => handleOrcidChange(orcid.id, detail.value)}
                  placeholder={`ORCID ${orcid.id}`}
                />
                {index > 0 && <Button onClick={() => removeOrcid(orcid.id)}>Eliminar</Button>}
              </div>
            ))}
            <Button onClick={addOrcid}>Agregar ORCID</Button>
          </SpaceBetween>
        </FormField>

        {/* Tipo de trabajo de investigación */}
        <FormField label="Tipo de trabajo de investigación">
          <Input value={tipoTrabajo} onChange={({ detail }) => setTipoTrabajo(detail.value)} />
        </FormField>

        {/* Nombre del Grado */}
        <FormField label="Nombre del Grado">
          <Input value={nombreGrado} onChange={({ detail }) => setNombreGrado(detail.value)} />
        </FormField>

        {/* Grado Académico o Título Profesional */}
        <FormField label="Grado Académico o Título Profesional">
          <Input value={gradoAcademico} onChange={({ detail }) => setGradoAcademico(detail.value)} />
        </FormField>

        {/* Nombre del Programa */}
        <FormField label="Nombre del Programa">
          <Input value={nombrePrograma} onChange={({ detail }) => setNombrePrograma(detail.value)} />
        </FormField>

        {/* Código del Programa */}
        <FormField label="Código del Programa">
          <Input value={codigoPrograma} onChange={({ detail }) => setCodigoPrograma(detail.value)} />
        </FormField>

        {/* Institución Otorgante del Grado */}
        <FormField label="Institución Otorgante del Grado">
          <Input value={institucionGrado} onChange={({ detail }) => setInstitucionGrado(detail.value)} />
        </FormField>

        {/* Jurados */}
        <FormField label="Jurado(s)">
          <SpaceBetween direction="vertical" size="s">
            {jurados.map((jurado, index) => (
              <div key={jurado.id} className="form-automatico">
                <Autosuggest
                  onChange={({ detail }) => handleJuradoChange(jurado.id, detail.value)}
                  value={jurado.value}
                  options={[{ value: 'Jurado 1' }, { value: 'Jurado 2' }]}
                  placeholder={`Jurado ${jurado.id}`}
                />
                {index > 0 && <Button onClick={() => removeJurado(jurado.id)} variant="normal" className="button-eliminar">Eliminar</Button>}
              </div>
            ))}
            <Button onClick={addJurado}>Agregar Jurado</Button>
          </SpaceBetween>
        </FormField>
      </SpaceBetween>
    </Container>
  );
};

export default Asesor;
