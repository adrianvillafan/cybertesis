import React, { useState, useEffect } from 'react';
import ModalTwoCol from './ModalTwoCol';
import { Button, FormField, Input, Select, SpaceBetween, Container, Header, ColumnLayout } from '@cloudscape-design/components';
import { fetchActaById } from '../../../../../../api';

const ActaSustentacionModalVer = ({ onClose, documentos }) => {
  const [formData, setFormData] = useState({
    presidente: { nombre: '', apellido: '', dni: '', grado: '' },
    miembros: [{ nombre: '', apellido: '', dni: '', grado: '' }, { nombre: '', apellido: '', dni: '', grado: '' }],
    asesores: []
  });
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    if (documentos.actasust_id) {
      fetchActaById(documentos.actasust_id).then(data => {
        setFormData({
          presidente: data.presidente,
          miembros: data.miembros,
          asesores: data.asesores
        });
        setFileUrl(data.file_url);
      });
    }
  }, [documentos.actasust_id]);

  return (
    <ModalTwoCol
      onClose={onClose}
      headerText="Ver Acta de Sustentación"
      footerButtons={
        <>
          <Button onClick={onClose} variant="secondary">Cerrar</Button>
          <Button iconName="download" href={fileUrl} target="_blank" variant="primary">Descargar</Button>
        </>
      }
      fileUrl={fileUrl}
      formContent={
        <SpaceBetween direction="vertical" size="l">
          <Container header={<Header variant="h3">Formulario de Acta de Sustentación</Header>}>
            <SpaceBetween direction="vertical" size="s">
              <Header variant="h5">Presidente</Header>
              <ColumnLayout columns={2}>
                <FormField label="Nombres">
                  <Input value={formData.presidente.nombre} readOnly />
                </FormField>
                <FormField label="Apellidos">
                  <Input value={formData.presidente.apellido} readOnly />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={2}>
                <FormField label="DNI">
                  <Input value={formData.presidente.dni} readOnly />
                </FormField>
                <FormField label="Grado">
                  <Select
                    selectedOption={{ label: formData.presidente.grado, value: formData.presidente.grado }}
                    options={[
                      { label: 'Doctor', value: 'Doctor' },
                      { label: 'Magister', value: 'Magister' }
                    ]}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
            </SpaceBetween>
          </Container>

          {formData.miembros.map((miembro, index) => (
            <Container key={index} header={<Header variant="h5">Miembro del Jurado {index + 1}</Header>}>
              <ColumnLayout columns={2}>
                <FormField label="Nombres">
                  <Input value={miembro.nombre} readOnly />
                </FormField>
                <FormField label="Apellidos">
                  <Input value={miembro.apellido} readOnly />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={2}>
                <FormField label="DNI">
                  <Input value={miembro.dni} readOnly />
                </FormField>
                <FormField label="Grado">
                  <Select
                    selectedOption={{ label: miembro.grado, value: miembro.grado }}
                    options={[
                      { label: 'Doctor', value: 'Doctor' },
                      { label: 'Magister', value: 'Magister' }
                    ]}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
            </Container>
          ))}

          {formData.asesores.map((asesor, index) => (
            <Container key={index} header={<Header variant="h5">Datos del Asesor {index + 1}</Header>}>
              <ColumnLayout columns={2}>
                <FormField label="Nombres">
                  <Input value={asesor.nombre} readOnly />
                </FormField>
                <FormField label="Apellidos">
                  <Input value={asesor.apellido} readOnly />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={2}>
                <FormField label="DNI">
                  <Input value={asesor.dni} readOnly />
                </FormField>
                <FormField label="Título">
                  <Input value={asesor.titulo} readOnly />
                </FormField>
              </ColumnLayout>
              <ColumnLayout>
                <FormField label="URL de ORCID">
                  <Input value={asesor.orcid} readOnly />
                </FormField>
              </ColumnLayout>
            </Container>
          ))}
        </SpaceBetween>
      }
    />
  );
};

export default ActaSustentacionModalVer;
