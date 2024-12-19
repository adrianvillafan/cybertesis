import React, { useState } from 'react';
import '../Formconfig/Styles.css';
import ColumnLayout from "@cloudscape-design/components/column-layout";
import {
  Container,
  SpaceBetween,
  FormField,
  Autosuggest,
  Input,
  Header,
  Button,
  DatePicker,
  Select
} from '@cloudscape-design/components';

const Datos = () => {
  // Estados individuales para cada campo
  const [titulo, setTitulo] = useState("");
  const [tituloAlternativo, setTituloAlternativo] = useState("");
  const [fechaPublicacion, setFechaPublicacion] = useState("");
  const [editorial, setEditorial] = useState("");
  const [comoCitar, setComoCitar] = useState("");
  const [recursoRelacionado, setRecursoRelacionado] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [numeroReporte, setNumeroReporte] = useState("");
  const [identificador, setIdentificador] = useState({ label: "Seleccionar", value: "1" });
  const [enlace, setEnlace] = useState("");
  const [tipoPublicacion, setTipoPublicacion] = useState({ label: "Seleccionar", value: "1" });
  const [formato, setFormato] = useState({ label: "Seleccionar", value: "1" });
  const [idioma, setIdioma] = useState("");
  const [nivelAcceso, setNivelAcceso] = useState("");
  const [authors, setAuthors] = useState([{ id: 1, value: "" }]);

  // Manejo de autores
  const handleAuthorChange = (id, newValue) => {
    setAuthors(authors.map(author => (author.id === id ? { ...author, value: newValue } : author)));
  };

  const addAuthor = () => {
    setAuthors([...authors, { id: authors.length + 1, value: "" }]);
  };

  const removeAuthor = (id) => {
    setAuthors(authors.filter(author => author.id !== id));
  };

  return (
    <Container>
      <SpaceBetween direction="vertical" size="l">

        {/* Sección de autores */}
        <FormField label="Autor(es)">
          <SpaceBetween direction="vertical" size="s">
            {authors.map((author, index) => (
              <div
                key={author.id}
                className="form-automatico"
              >
                <Autosuggest
                  onChange={({ detail }) => handleAuthorChange(author.id, detail.value)}
                  value={author.value}
                  options={[
                    { value: "Perú" },
                    { value: "Brasil" },
                    { value: "Chile" },
                    { value: "USA" }
                  ]}
                  placeholder={`Tesista ${author.id}`}
                  style={{ flex: 1 }}
                  virtualScroll
                />
                {index > 0 && (
                  <Button
                    onClick={() => removeAuthor(author.id)}
                    variant="normal"
                    className="button-eliminar"
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            ))}
            <Button onClick={addAuthor}>Agregar Autor</Button>
          </SpaceBetween>
        </FormField>

        {/* Título */}
        <FormField label="Título *">
          <Input
            onChange={({ detail }) => setTitulo(detail.value)}
            value={titulo}
          />
        </FormField>

        <FormField label="Título Alternativo">
          <Input
            onChange={({ detail }) => setTituloAlternativo(detail.value)}
            value={tituloAlternativo}
          />
        </FormField>

        {/* Fecha de publicación y editorial */}
        <ColumnLayout columns={2}>
          <FormField label="Fecha de Publicación *" constraintText="Use AAAA/MM/DD format.">
            <DatePicker
              onChange={({ detail }) => setFechaPublicacion(detail.value)}
              value={fechaPublicacion}
              placeholder="YYYY/MM/DD"
            />
          </FormField>
          <FormField label="Editorial *">
            <Input
              onChange={({ detail }) => setEditorial(detail.value)}
              value={editorial}
            />
          </FormField>
        </ColumnLayout>

        {/* Cómo citar */}
        <FormField label="Cómo Citar">
          <Input
            onChange={({ detail }) => setComoCitar(detail.value)}
            value={comoCitar}
          />
        </FormField>

        {/* Recurso relacionado, número de serie, y número de reporte */}
        <ColumnLayout columns={3}>
          <FormField label="Recurso Relacionado">
            <Input
              onChange={({ detail }) => setRecursoRelacionado(detail.value)}
              value={recursoRelacionado}
            />
          </FormField>
          <FormField label="Número de Serie">
            <Input
              onChange={({ detail }) => setNumeroSerie(detail.value)}
              value={numeroSerie}
            />
          </FormField>
          <FormField label="Número de Reporte">
            <Input
              onChange={({ detail }) => setNumeroReporte(detail.value)}
              value={numeroReporte}
            />
          </FormField>
        </ColumnLayout>

        {/* Identificadores */}
        <ColumnLayout columns={2}>
          <FormField label="Identificador(es)">
            <Select
              selectedOption={identificador}
              onChange={({ detail }) => setIdentificador(detail.selectedOption)}
              options={[
                { label: "DOI", value: "1" },
                { label: "ISSN", value: "2" },
                { label: "ISMN", value: "3" },
                { label: "ISBN", value: "4" },
                { label: "URI", value: "5" },
              ]}
            />
          </FormField>
          <FormField label="Enlace">
            <Input
              onChange={({ detail }) => setEnlace(detail.value)}
              value={enlace}
            />
          </FormField>
        </ColumnLayout>

        {/* Tipo de publicación y formato */}
        <ColumnLayout columns={2}>
          <FormField label="Tipo de publicación">
            <Select
              selectedOption={tipoPublicacion}
              onChange={({ detail }) => setTipoPublicacion(detail.selectedOption)}
              options={[
                { label: "Creative commons", value: "1" },
                { label: "Option 2", value: "2" },
                { label: "Option 3", value: "3" },
                { label: "Option 4", value: "4" },
                { label: "Option 5", value: "5" },
              ]}
            />
          </FormField>
          <FormField label="Formato">
            <Select
              selectedOption={formato}
              onChange={({ detail }) => setFormato(detail.selectedOption)}
              options={[
                { label: "PDF", value: "1" },
                { label: "WORLD", value: "2" },
                { label: "HTML", value: "3" },
              ]}
            />
          </FormField>
        </ColumnLayout>

        <FormField label="Idioma *">
          <Input
            onChange={({ detail }) => setIdioma(detail.value)}
            value={idioma}
          />
        </FormField>

        <FormField label="Nivel de Acceso *">
          <Input
            onChange={({ detail }) => setNivelAcceso(detail.value)}
            value={nivelAcceso}
          />
        </FormField>
      </SpaceBetween>
    </Container>
  );
};

export default Datos;
