import React, { useState } from 'react';
import ColumnLayout from "@cloudscape-design/components/column-layout";
import { Container, SpaceBetween, FormField, Input, Header, Textarea } from '@cloudscape-design/components';

export default function Notas() {
  // Estados para manejar los valores de cada campo
  const [palabrasClave, setPalabrasClave] = useState("");
  const [campoConocimiento, setCampoConocimiento] = useState("");
  const [resumen, setResumen] = useState("");
  const [patrocinio, setPatrocinio] = useState("");
  const [notas, setNotas] = useState("");

  return (
    <Container >
      <SpaceBetween direction="vertical" size="l">

        <ColumnLayout columns={2}>
          {/* Palabra(s) Clave */}
          <FormField label="Palabra(s) Clave*">
            <Input 
              value={palabrasClave}
              onChange={({ detail }) => setPalabrasClave(detail.value)}
              placeholder="Ingrese palabras clave..."
            /> 
          </FormField>

          {/* Campo del Conocimiento OCDE */}
          <FormField label="Campo del Conocimiento OCDE*">
            <Input 
              value={campoConocimiento}
              onChange={({ detail }) => setCampoConocimiento(detail.value)}
              placeholder="Ingrese el campo de conocimiento..."
            />
          </FormField>
        </ColumnLayout>

        {/* Resumen */}
        <FormField label="Resumen*">
          <Textarea 
            value={resumen}
            onChange={({ detail }) => setResumen(detail.value)}
            placeholder="Ingrese resumen..." 
            rows={4} 
          />
        </FormField>

        {/* Patrocinio */}
        <FormField label="Patrocinio">
          <Textarea 
            value={patrocinio}
            onChange={({ detail }) => setPatrocinio(detail.value)}
            placeholder="Ingrese patrocinio..." 
            rows={4} 
          />
        </FormField>

        {/* Notas */}
        <FormField label="Notas">
          <Textarea 
            value={notas}
            onChange={({ detail }) => setNotas(detail.value)}
            placeholder="Ingrese notas..." 
            rows={4} 
          />
        </FormField>

      </SpaceBetween>
    </Container>
  );
}
