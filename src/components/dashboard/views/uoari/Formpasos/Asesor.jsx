import React, { useState, useEffect } from 'react';
import '../Formconfig/Styles.css';
import { Container, SpaceBetween, FormField, Input } from '@cloudscape-design/components';

const Asesor = ({ uoariDetails, updateUoariDetails, validateStep }) => {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    validateStep.current = () => {
      const newErrors = {};

      // Verificar si los campos requeridos están completos
      if (!uoariDetails.tipo_investigacion || uoariDetails.tipo_investigacion.trim() === "") {
        newErrors.tipo_investigacion = "Campo obligatorio";
      }
      if (!uoariDetails.nombre_grado || uoariDetails.nombre_grado.trim() === "") {
        newErrors.nombre_grado = "Campo obligatorio";
      }
      if (!uoariDetails.titulo_profesional || uoariDetails.titulo_profesional.trim() === "") {
        newErrors.titulo_profesional = "Campo obligatorio";
      }
      if (!uoariDetails.programa || uoariDetails.programa.trim() === "") {
        newErrors.programa = "Campo obligatorio";
      }
      if (!uoariDetails.codigo_programa || uoariDetails.codigo_programa.trim() === "") {
        newErrors.codigo_programa = "Campo obligatorio";
      }
      if (!uoariDetails.institucion_otorgante || uoariDetails.institucion_otorgante.trim() === "") {
        newErrors.institucion_otorgante = "Campo obligatorio";
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
          label="Tipo de investigación"
          errorText={errors.tipo_investigacion} // Mostrar mensaje de error
        >
          <Input
            value={uoariDetails.tipo_investigacion || ""}
            onChange={({ detail }) => updateUoariDetails("tipo_investigacion", detail.value)}
          />
        </FormField>

        <FormField
          label="Nombre del Grado"
          errorText={errors.nombre_grado} // Mostrar mensaje de error
        >
          <Input
            value={uoariDetails.nombre_grado || ""}
            onChange={({ detail }) => updateUoariDetails("nombre_grado", detail.value)}
          />
        </FormField>

        <FormField
          label="Título Profesional"
          errorText={errors.titulo_profesional} // Mostrar mensaje de error
        >
          <Input
            value={uoariDetails.titulo_profesional || ""}
            onChange={({ detail }) => updateUoariDetails("titulo_profesional", detail.value)}
          />
        </FormField>

        <FormField
          label="Nombre del Programa"
          errorText={errors.programa} // Mostrar mensaje de error
        >
          <Input
            value={uoariDetails.programa || ""}
            onChange={({ detail }) => updateUoariDetails("programa", detail.value)}
          />
        </FormField>

        <FormField
          label="Código del Programa"
          errorText={errors.codigo_programa} // Mostrar mensaje de error
        >
          <Input
            value={uoariDetails.codigo_programa || ""}
            onChange={({ detail }) => updateUoariDetails("codigo_programa", detail.value)}
          />
        </FormField>

        <FormField
          label="Institución Otorgante"
          errorText={errors.institucion_otorgante} // Mostrar mensaje de error
        >
          <Input
            value={uoariDetails.institucion_otorgante || ""}
            onChange={({ detail }) => updateUoariDetails("institucion_otorgante", detail.value)}
          />
        </FormField>
      </SpaceBetween>
    </Container>
  );
};

export default Asesor;
