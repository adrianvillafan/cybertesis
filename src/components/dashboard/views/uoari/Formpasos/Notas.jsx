import React, { useState, useEffect } from 'react';
import '../Formconfig/Styles.css';
import { Container, SpaceBetween, FormField, Input, Textarea } from '@cloudscape-design/components';

const Notas = ({ uoariDetails, updateUoariDetails, validateStep }) => {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    validateStep.current = () => {
      const newErrors = {};

      // Verificar si los campos requeridos están completos
      if (!uoariDetails.palabra_clave || uoariDetails.palabra_clave.trim() === "") {
        newErrors.palabra_clave = "Campo obligatorio";
      }
      if (!uoariDetails.conocimiento || uoariDetails.conocimiento.trim() === "") {
        newErrors.conocimiento = "Campo obligatorio";
      }
      if (!uoariDetails.resumen || uoariDetails.resumen.trim() === "") {
        newErrors.resumen = "Campo obligatorio";
      }
      if (!uoariDetails.patrocinio || uoariDetails.patrocinio.trim() === "") {
        newErrors.patrocinio = "Campo obligatorio";
      }

      setErrors(newErrors);

      // Retornar true si no hay errores, false si los hay
      return Object.keys(newErrors).length === 0;
    };
  }, [uoariDetails, validateStep]);

  return (
    <Container>
      <SpaceBetween direction="vertical" size="l">
        <FormField
          label="Palabras clave"
          errorText={errors.palabra_clave} // Mostrar mensaje de error
        >
          <Input
            onChange={({ detail }) => updateUoariDetails("palabra_clave", detail.value)}
            value={uoariDetails.palabra_clave || ""}
          />
        </FormField>

        <FormField
          label="Conocimiento"
          errorText={errors.conocimiento} // Mostrar mensaje de error
        >
          <Input
            onChange={({ detail }) => updateUoariDetails("conocimiento", detail.value)}
            value={uoariDetails.conocimiento || ""}
          />
        </FormField>

        <FormField
          label="Resumen"
          errorText={errors.resumen} // Mostrar mensaje de error
        >
          <Textarea
            onChange={({ detail }) => updateUoariDetails("resumen", detail.value)}
            value={uoariDetails.resumen || ""}
          />
        </FormField>

        <FormField
          label="Patrocinio"
          errorText={errors.patrocinio} // Mostrar mensaje de error
        >
          <Input
            onChange={({ detail }) => updateUoariDetails("patrocinio", detail.value)}
            value={uoariDetails.patrocinio || ""}
          />
        </FormField>

        <FormField label="Notas adicionales">
          <Textarea
            onChange={({ detail }) => updateUoariDetails("notas", detail.value)}
            value={uoariDetails.notas || ""}
          />
        </FormField>
      </SpaceBetween>
    </Container>
  );
};

export default Notas;
