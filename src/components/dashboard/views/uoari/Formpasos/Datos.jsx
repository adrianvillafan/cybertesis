// src/Formpasos/Datos.jsx
import React from 'react';
import '../Formconfig/Styles.css';
import ColumnLayout from "@cloudscape-design/components/column-layout";
import {
  Grid,
  Select,
  Container,
  SpaceBetween,
  FormField,
  Autosuggest,
  Input,
  Header,
  Button,
  DatePicker
} from '@cloudscape-design/components';

export default function Datos() {
  const [value, setValue] = React.useState("");
  const [authors, setAuthors] = React.useState([{ id: 1, value: "" }]);
  const [selectedOption1, setSelectedOption1] = React.useState({ label: "Creative commons", value: "1" });

  // Función para manejar el cambio de valor en el autosuggest específico
  const handleAuthorChange = (id, newValue) => {
    setAuthors(authors.map(author => (author.id === id ? { ...author, value: newValue } : author)));
  };

  // Función para agregar un nuevo campo de autor
  const addAuthor = () => {
    setAuthors([...authors, { id: authors.length + 1, value: "" }]);
  };

  // Función para eliminar un campo de autor específico
  const removeAuthor = (id) => {
    setAuthors(authors.filter(author => author.id !== id));
  };

  return (
    <Container header={<Header variant="h2">Información Personal del Tesista</Header>}>
      <SpaceBetween direction="vertical" size="l">
        {/* Sección de autores */}
        <FormField label="Autor(es)">
          <SpaceBetween direction="vertical" size="s">
            {authors.map((author, index) => (
              <div
                key={author.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
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
                  <Button onClick={() => removeAuthor(author.id)} variant="normal">
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
          <Input onChange={({ detail }) => setValue(detail.value)} value={value} />
        </FormField>

        <FormField label="Título Alternativo">
          <Input onChange={({ detail }) => setValue(detail.value)} value={value} />
        </FormField>

        {/* Fecha de publicación y editorial */}
        <ColumnLayout columns={2}>
          <FormField label="Fecha de Publicación *" constraintText="Use AAAA/MM/DD format.">
            <DatePicker
              onChange={({ detail }) => setValue(detail.value)}
              value={value}
              openCalendarAriaLabel={selectedDate =>
                `Choose certificate expiry date${selectedDate ? `, selected date is ${selectedDate}` : ""}`
              }
              placeholder="YYYY/MM/DD"
            />
          </FormField>
          <FormField label="Editorial *">
            <Input onChange={({ detail }) => setValue(detail.value)} value={value} />
          </FormField>
        </ColumnLayout>

        {/* Cómo citar */}
        <FormField label="Cómo Citar">
          <Input onChange={({ detail }) => setValue(detail.value)} value={value} />
        </FormField>

        {/* Recurso relacionado, número de serie, y número de reporte */}
        <ColumnLayout columns={3}>
          <FormField label="Recurso Relacionado">
            <Input onChange={({ detail }) => setValue(detail.value)} value={value} />
          </FormField>
          <FormField label="Número de Serie">
            <Input onChange={({ detail }) => setValue(detail.value)} value={value} />
          </FormField>
          <FormField label="Número de Reporte">
            <Input onChange={({ detail }) => setValue(detail.value)} value={value} />
          </FormField>
        </ColumnLayout>

        {/* Identificadores */}
        <ColumnLayout columns={2}>
          <FormField label="Identificador(es)">
            <Select
              selectedOption={selectedOption1}
              onChange={({ detail }) => setSelectedOption1(detail.selectedOption)}
              options={[
                { label: "Creative commons", value: "1" },
                { label: "Option 2", value: "2" },
                { label: "Option 3", value: "3" },
                { label: "Option 4", value: "4" },
                { label: "Option 5", value: "5" },
              ]}
            />
          </FormField>
          <FormField label = "Enlace">
            <Input onChange={({ detail }) => setValue(detail.value)} value={value} />
          </FormField>
        </ColumnLayout>

        {/* Tipo de publicación y formato */}
        <ColumnLayout columns={2}>
          <FormField label="Tipo de publicación">
            <Select
              selectedOption={selectedOption1}
              onChange={({ detail }) => setSelectedOption1(detail.selectedOption)}
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
              selectedOption={selectedOption1}
              onChange={({ detail }) => setSelectedOption1(detail.selectedOption)}
              options={[
                { label: "Creative commons", value: "1" },
                { label: "Option 2", value: "2" },
                { label: "Option 3", value: "3" },
                { label: "Option 4", value: "4" },
                { label: "Option 5", value: "5" },
              ]}
            />
          </FormField>
        </ColumnLayout>

      <FormField label="Idioma *">
        <Input onChange={({ detail }) => setValue(detail.value)} value={value} />
      </FormField>
      
      <FormField label="Nivel de Acceso *">
        <Input onChange={({ detail }) => setValue(detail.value)} value={value} />
      </FormField>

      </SpaceBetween>

    
    </Container>
  );
}
