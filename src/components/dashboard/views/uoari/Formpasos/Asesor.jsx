import React, { useState } from 'react';
import '../Formconfig/Styles.css';
import { Container, SpaceBetween, FormField, Input, Button, Autosuggest, Select } from '@cloudscape-design/components';

const Asesor = () => {
  const [asesores, setAsesores] = useState([{ id: 1, value: "" }]);
  const [jurados, setJurados] = useState([{ id: 1, value: "" }]);
  const [documentosAutor, setDocumentosAutor] = useState([{ id: 1, tipo: { label: "Creative commons", value: "1" }, numero: "" }]);
  const [documentosAsesor, setDocumentosAsesor] = useState([{ id: 1, tipo: { label: "Creative commons", value: "1" }, numero: "" }]);
  const [orcids, setOrcids] = useState([{ id: 1, value: "" }]);
  const [tipoTrabajo, setTipoTrabajo] = useState("");
  const [nombreGrado, setNombreGrado] = useState("");
  const [gradoAcademico, setGradoAcademico] = useState("");
  const [nombrePrograma, setNombrePrograma] = useState("");
  const [codigoPrograma, setCodigoPrograma] = useState("");
  const [institucionGrado, setInstitucionGrado] = useState("");

  // Funciones para manejar los asesores
  const handleAsesorChange = (id, newValue) => {
    setAsesores(asesores.map(asesor => (asesor.id === id ? { ...asesor, value: newValue } : asesor)));
  };

  const addAsesor = () => {
    setAsesores([...asesores, { id: asesores.length + 1, value: "" }]);
  };

  const removeAsesor = (id) => {
    setAsesores(asesores.filter(asesor => asesor.id !== id));
  };

  // Funciones para manejar los jurados
  const handleJuradoChange = (id, newValue) => {
    setJurados(jurados.map(jurado => (jurado.id === id ? { ...jurado, value: newValue } : jurado)));
  };

  const addJurado = () => {
    setJurados([...jurados, { id: jurados.length + 1, value: "" }]);
  };

  const removeJurado = (id) => {
    setJurados(jurados.filter(jurado => jurado.id !== id));
  };

  // Funciones para manejar los documentos de autor
  const handleDocumentoAutorChange = (id, field, value) => {
    setDocumentosAutor(documentosAutor.map(doc => (doc.id === id ? { ...doc, [field]: value } : doc)));
  };

  const addDocumentoAutor = () => {
    setDocumentosAutor([...documentosAutor, { id: documentosAutor.length + 1, tipo: { label: "Creative commons", value: "1" }, numero: "" }]);
  };

  const removeDocumentoAutor = (id) => {
    setDocumentosAutor(documentosAutor.filter(doc => doc.id !== id));
  };

  // Funciones para manejar los documentos de asesor
  const handleDocumentoAsesorChange = (id, field, value) => {
    setDocumentosAsesor(documentosAsesor.map(doc => (doc.id === id ? { ...doc, [field]: value } : doc)));
  };

  const addDocumentoAsesor = () => {
    setDocumentosAsesor([...documentosAsesor, { id: documentosAsesor.length + 1, tipo: { label: "Creative commons", value: "1" }, numero: "" }]);
  };

  const removeDocumentoAsesor = (id) => {
    setDocumentosAsesor(documentosAsesor.filter(doc => doc.id !== id));
  };

  // Funciones para manejar ORCID
  const handleOrcidChange = (id, value) => {
    setOrcids(orcids.map(orcid => (orcid.id === id ? { ...orcid, value } : orcid)));
  };

  const addOrcid = () => {
    setOrcids([...orcids, { id: orcids.length + 1, value: "" }]);
  };

  const removeOrcid = (id) => {
    setOrcids(orcids.filter(orcid => orcid.id !== id));
  };

  return (
    <Container>
      <SpaceBetween direction="vertical" size="l">
        <FormField label="Código de País de Publicación">
          <Input />
        </FormField>

        <FormField label="Tipo de Documento y Número (Autor)">
          <SpaceBetween direction="vertical" size="s">
            {documentosAutor.map((doc, index) => (
              <div key={doc.id} className="form-automatico">
                <Select
                  selectedOption={doc.tipo}
                  onChange={({ detail }) => handleDocumentoAutorChange(doc.id, "tipo", detail.selectedOption)}
                  options={[
                    { label: "Creative commons", value: "1" },
                    { label: "Option 2", value: "2" },
                  ]}
                  placeholder={`Tipo de Documento ${doc.id}`}
                />
                <Input
                  value={doc.numero}
                  onChange={({ detail }) => handleDocumentoAutorChange(doc.id, "numero", detail.value)}
                  placeholder={`Número de Documento ${doc.id}`}
                />
                {index > 0 && <Button onClick={() => removeDocumentoAutor(doc.id)}>Eliminar</Button>}
              </div>
            ))}
            <Button onClick={addDocumentoAutor}>Agregar Documento</Button>
          </SpaceBetween>
        </FormField>

        <FormField label="Tipo de trabajo de investigación">
          <Input value={tipoTrabajo} onChange={({ detail }) => setTipoTrabajo(detail.value)} />
        </FormField>

        <FormField label="Nombre del Grado">
          <Input value={nombreGrado} onChange={({ detail }) => setNombreGrado(detail.value)} />
        </FormField>

        <FormField label="Grado Académico o Título Profesional">
          <Input value={gradoAcademico} onChange={({ detail }) => setGradoAcademico(detail.value)} />
        </FormField>

        <FormField label="Nombre del Programa">
          <Input value={nombrePrograma} onChange={({ detail }) => setNombrePrograma(detail.value)} />
        </FormField>

        <FormField label="Código del Programa">
          <Input value={codigoPrograma} onChange={({ detail }) => setCodigoPrograma(detail.value)} />
        </FormField>

        <FormField label="Institución Otorgante del Grado">
          <Input value={institucionGrado} onChange={({ detail }) => setInstitucionGrado(detail.value)} />
        </FormField>

        <FormField label="Asesor(es)">
          <SpaceBetween direction="vertical" size="s">
            {asesores.map((asesor, index) => (
              <div key={asesor.id} className="form-automatico">
                <Autosuggest
                  onChange={({ detail }) => handleAsesorChange(asesor.id, detail.value)}
                  value={asesor.value}
                  options={[
                    { value: "Asesor 1" },
                    { value: "Asesor 2" },
                  ]}
                  placeholder={`Asesor ${asesor.id}`}
                />
                {index > 0 && <Button onClick={() => removeAsesor(asesor.id)}>Eliminar</Button>}
              </div>
            ))}
            <Button onClick={addAsesor}>Agregar Asesor</Button>
          </SpaceBetween>
        </FormField>
      </SpaceBetween>
    </Container>
  );
};

export default Asesor;
