import React, { useState } from 'react';
import '../Formconfig/Styles.css';
import { Container, SpaceBetween, FormField, Select, RadioGroup, Autosuggest, Header } from '@cloudscape-design/components';

const Credencial = () => {
  const [selectedOption1, setSelectedOption1] = useState({ label: "Creative commons", value: "1" });
  const [radioValue1, setRadioValue1] = useState("first");
  const [radioValue2, setRadioValue2] = useState("first");
  const [value, setValue] = useState("");

  return (
    <SpaceBetween direction="vertical" size="l">
      <Container>
        <SpaceBetween direction="vertical" size="l">

          <FormField label="Seleccione una licencia">
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

          <FormField label="¿Quiere permitir usos comerciales de su obra?">
            <RadioGroup
              onChange={({ detail }) => setRadioValue1(detail.value)}
              value={radioValue1}
              items={[
                { value: "first", label: "Sí" },
                { value: "second", label: "No" },
              ]}
            />
          </FormField>

          <FormField label="¿Quiere permitir modificaciones de su obra?">
            <RadioGroup
              onChange={({ detail }) => setRadioValue2(detail.value)}
              value={radioValue2}
              items={[
                { value: "first", label: "Sí" },
                { value: "second", label: "ShareAlike" },
                { value: "third", label: "No" },
              ]}
            />
          </FormField>

          <FormField label="Jurisdicción de tu licencia">
            <Autosuggest
              onChange={({ detail }) => setValue(detail.value)}
              value={value}
              options={[
                { value: "Perú" },
                { value: "Brasil" },
                { value: "Chile" },
                { value: "USA" },
              ]}
              ariaLabel="Autosuggest example with suggestions"
              placeholder="Ingrese País"
            />
          </FormField>

        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
};

export default Credencial;
