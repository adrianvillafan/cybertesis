import React, { useState } from 'react';
import '../Formconfig/Styles.css';
import { Container, SpaceBetween, FormField, Input, DatePicker, Select, ColumnLayout } from '@cloudscape-design/components';

const Datos = ({ uoariDetails, updateUoariDetails, validateStep }) => {
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};

    if (!uoariDetails.fecha_publicacion) newErrors.fecha_publicacion = "Campo obligatorio";
    if (!uoariDetails.editorial) newErrors.editorial = "Campo obligatorio";
    //if (!uoariDetails.idioma) newErrors.idioma = "Campo obligatorio";
    if (!uoariDetails.estado) newErrors.estado = "Campo obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  validateStep.current = validateFields;

  return (
    <Container>
      <SpaceBetween direction="vertical" size="l">
        <ColumnLayout columns={2} borders="vertical">
          <FormField
            label="Fecha de Publicación *"
            constraintText="Use AAAA/MM/DD format."
            errorText={errors.fecha_publicacion}
          >
            <DatePicker
              onChange={({ detail }) => updateUoariDetails("fecha_publicacion", detail.value)}
              value={uoariDetails.fecha_publicacion || ""}
              placeholder="YYYY/MM/DD"
            />
          </FormField>

          <FormField label="Editorial *" errorText={errors.editorial}>
            <Input
              onChange={({ detail }) => updateUoariDetails("editorial", detail.value)}
              value={uoariDetails.editorial || ""}
            />
          </FormField>
        </ColumnLayout>

        <FormField label="Cómo Citar">
          <Input
            onChange={({ detail }) => updateUoariDetails("cita", detail.value)}
            value={uoariDetails.cita || ""}
          />
        </FormField>

        <ColumnLayout columns={2} borders="vertical">
          <FormField label="Identificador(es)">
            <Select
              selectedOption={
                uoariDetails.identificador
                  ? { label: uoariDetails.identificador, value: uoariDetails.identificador }
                  : null
              }
              onChange={({ detail }) => updateUoariDetails("identificador", detail.selectedOption.label)}
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
              onChange={({ detail }) => updateUoariDetails("enlace", detail.value)}
              value={uoariDetails.enlace || ""}
            />
          </FormField>
        </ColumnLayout>

        <ColumnLayout columns={2} borders="vertical">
          <FormField label="Tipo de publicación">
            <Select
              selectedOption={
                uoariDetails.tipo_publicacion
                  ? { label: uoariDetails.tipo_publicacion, value: uoariDetails.tipo_publicacion }
                  : null
              }
              onChange={({ detail }) => updateUoariDetails("tipo_publicacion", detail.selectedOption.label)}
              options={[
                { label: "Tesis", value: "1" },
                { label: "Proyectos de Investigación", value: "2" },
              ]}
            />
          </FormField>

          <FormField label="Formato">
            <Select
              selectedOption={
                uoariDetails.formato
                  ? { label: uoariDetails.formato, value: uoariDetails.formato }
                  : null
              }
              onChange={({ detail }) => updateUoariDetails("formato", detail.selectedOption.label)}
              options={[
                { label: "PDF", value: "1" },
                { label: "WORD", value: "2" },
              ]}
            />
          </FormField>
        </ColumnLayout>

        <FormField label="Nivel de Acceso *" errorText={errors.estado}>
          <Select
            selectedOption={
              uoariDetails.estado
                ? {
                    label: [
                      { label: "Acceso abierto", value: "1" },
                      { label: "Acceso cerrado", value: "2" },
                      { label: "Acceso embargado", value: "3" },
                    ].find(option => option.value === uoariDetails.estado)?.label,
                    value: uoariDetails.estado,
                  }
                : null
            }
            onChange={({ detail }) => updateUoariDetails("estado", detail.selectedOption.value)}
            options={[
              { label: "Acceso abierto", value: "1" },
              { label: "Acceso cerrado", value: "2" },
              { label: "Acceso embargado", value: "3" },
            ]}
          />
        </FormField>
      </SpaceBetween>
    </Container>
  );
};

export default Datos;
