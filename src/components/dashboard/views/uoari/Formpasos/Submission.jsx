// Formpasos/Extra.jsx
import React from 'react';
import ColumnLayout from "@cloudscape-design/components/column-layout";
import { Container, SpaceBetween, FormField, Input, Header } from '@cloudscape-design/components';

export default function Submission() {
  return (
    <Container header={<Header variant="h2">Notas</Header>}>
      <SpaceBetween direction="vertical" size="l">

        <ColumnLayout columns={2}>
          <FormField label="Palabra(s) Clave*">
            <Input />
          </FormField>

          <FormField label="Campo del Conocimiento OCDE*">
            <Input />
          </FormField>
        </ColumnLayout>

        <FormField label="Resumen*">
          <Input />
        </FormField>

        <FormField label="Patrocinio">
          <Input />
        </FormField>

        <FormField label="Notas">
          <Input />
        </FormField>

      </SpaceBetween>
    </Container>
  );
}
