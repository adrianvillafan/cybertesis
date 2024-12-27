import React, { useState, useEffect } from 'react';
import '../Formconfig/Styles.css';
import { Container, SpaceBetween, FormField, Select, RadioGroup, Autosuggest } from '@cloudscape-design/components';

const Credencial = ({ updateUoariDetails }) => {
  const [selectedOption1, setSelectedOption1] = useState({ label: "Creative commons", value: "1" });
  const [radioValue1, setRadioValue1] = useState("first");
  const [radioValue2, setRadioValue2] = useState("first");

  useEffect(() => {
    const nuevaLicencia =
      selectedOption1.value === "1" && // Creative commons seleccionado
      radioValue1 === "first" && // No usos comerciales
      radioValue2 === "first" // No modificaciones
        ? "https://creativecommons.org/licenses/by-nc-sa/4.0/"
        : null;

    // Actualiza el campo "licencia" solo si cambia el valor
    updateUoariDetails("licencia", nuevaLicencia);
  }, [selectedOption1, radioValue1, radioValue2, updateUoariDetails]);

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
                { label: "CCO", value: "2" },
              ]}
            />
          </FormField>

          <FormField label="¿Quiere permitir usos comerciales de su obra?">
            <RadioGroup
              onChange={({ detail }) => setRadioValue1(detail.value)}
              value={radioValue1}
              items={[
                { value: "second", label: "Sí" },
                { value: "first", label: "No" },
              ]}
            />
          </FormField>

          <FormField label="¿Quiere permitir modificaciones de su obra?">
            <RadioGroup
              onChange={({ detail }) => setRadioValue2(detail.value)}
              value={radioValue2}
              items={[
                { value: "third", label: "Sí" },
                { value: "second", label: "ShareAlike" },
                { value: "first", label: "No" },
              ]}
            />
          </FormField>

          <FormField label="Jurisdicción de tu licencia">
            <Autosuggest
              value="Perú"
              options={[]}
              disabled
              ariaLabel="Jurisdicción seleccionada"
              placeholder="Perú"
            />
          </FormField>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
};

export default Credencial;
