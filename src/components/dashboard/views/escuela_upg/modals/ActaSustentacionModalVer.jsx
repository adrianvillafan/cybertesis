import React, { useState, useEffect } from 'react';
import ModalTwoCol from './ModalTwoCol';
import { Button, FormField, Input, Select, SpaceBetween, Container, Header, ColumnLayout } from '@cloudscape-design/components';
import { fetchActaById } from '../../../../../../src/apis/escuela_upg/modals/ApiActaSustentacionModal';

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
          presidente: {
            nombre: data.presidente_nombre,
            apellido: data.presidente_apellido,
            dni: data.presidente_numero_documento,
            grado: data.presidente_grado_id === 1 ? 'Doctor' : 'Magister'
          },
          miembros: data.miembros.map(miembro => ({
            nombre: miembro.nombre,
            apellido: miembro.apellido,
            dni: miembro.numero_documento,
            grado: miembro.grado_id === 1 ? 'Doctor' : 'Magister'
          })),
          asesores: data.asesores.map(asesor => ({
            nombre: asesor.nombre,
            apellido: asesor.apellido,
            dni: asesor.dni,
            titulo: asesor.titulo,
            orcid: asesor.orcid
          }))
        });
        setFileUrl(data.file_url);
      }).catch(error => {
        console.error('Error al obtener el acta:', error);
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
                <FormField label="Número de Documento">
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
                <FormField label="Número de Documento">
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
                <FormField label="Número de Documento">
                  <Input value={asesor.dni} readOnly />
                </FormField>
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
