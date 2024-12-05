// Formpasos/Extra.jsx
import React from 'react';
import { Container, SpaceBetween, FormField, Input, Header } from '@cloudscape-design/components';

export default function Acesor() {
  return (
    <Container header={<Header variant="h2">Pasos Extra 1</Header>}>
      <SpaceBetween direction="vertical" size="l">
        <FormField label="Campo 1">
          <Input />
        </FormField>
        <FormField label="Campo 4">
          <Input />
        </FormField>
      </SpaceBetween>
    </Container>
  );
}
