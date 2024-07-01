import React, { useState, useEffect } from 'react';
import ModalTwoCol from './ModalTwoCol';
import { Button, FormField, Input, Select, SpaceBetween, Container, Header, ColumnLayout, Box } from '@cloudscape-design/components';
import { fetchDatosByDni, fetchTesisById } from '../../../../../../api';

const TesisModalVer = ({ onClose, documentos }) => {
  const [formData, setFormData] = useState({
    facultad: '',
    escuela: '',
    titulo: '',
    tipo: '',
    grado: '',
    year: '',
    autores: [],
    asesores: []
  });
  const [fileUrl, setFileUrl] = useState('');
  const [dataLoaded, setDataLoaded] = useState({ autores: false, asesores: false }); // Nuevo estado

  useEffect(() => {
    if (documentos.tesis_id) {
      fetchTesisById(documentos.tesis_id).then((data) => {
        setFormData({
          facultad: data.facultad_nombre,
          escuela: data.escuela_nombre,
          titulo: data.titulo,
          tipo: data.tipo_tesis,
          grado: data.grado_academico,
          year: data.año,
          autores: [
            {
              id: data.id_autor1,
              dni: data.autor1_dni,
              nombre: '',
              apellido: '',
              telefono: '',
              email: '',
              orcid: '',
              tipoDocumento: 'DNI'
            },
            ...(data.id_autor2 ? [{
              id: data.id_autor2,
              dni: data.autor2_dni,
              nombre: '',
              apellido: '',
              telefono: '',
              email: '',
              orcid: '',
              tipoDocumento: 'DNI'
            }] : [])
          ],
          asesores: [
            {
              id: data.id_asesor1,
              dni: data.asesor1_dni,
              nombre: '',
              apellido: '',
              titulo: '',
              orcid: '',
              tipoDocumento: 'DNI'
            },
            ...(data.id_asesor2 ? [{
              id: data.id_asesor2,
              dni: data.asesor2_dni,
              nombre: '',
              apellido: '',
              titulo: '',
              orcid: '',
              tipoDocumento: 'DNI'
            }] : [])
          ]
        });
        setFileUrl(data.file_url);
      });
    }
  }, [documentos.tesis_id]);

  const fetchAndSetDataByDni = async (tipoIdentificacionId, identificacionId, index, type) => {
    try {
      const data = await fetchDatosByDni(tipoIdentificacionId, identificacionId);
      handleChange('id', data.idpersonas, index, type);
      handleChange('nombre', data.nombre || '', index, type);
      handleChange('apellido', data.apellido || '', index, type);
      if (type === 'autores') {
        handleChange('telefono', data.telefono || '', index, type);
        handleChange('email', data.email || '', index, type);
      }
      if (data.orcid) {
        handleChange('orcid', data.orcid, index, type);
      }
    } catch (error) {
      console.error('Error al obtener datos del DNI:', error);
    }
  };

  useEffect(() => {
    if (!dataLoaded.autores && formData.autores.length > 0) {
      formData.autores.forEach((autor, index) => {
        if (autor.dni) {
          fetchAndSetDataByDni(1, autor.dni, index, 'autores');
        }
      });
      setDataLoaded(prev => ({ ...prev, autores: true })); // Marcar autores como cargados
    }

    if (!dataLoaded.asesores && formData.asesores.length > 0) {
      formData.asesores.forEach((asesor, index) => {
        if (asesor.dni) {
          fetchAndSetDataByDni(1, asesor.dni, index, 'asesores');
        }
      });
      setDataLoaded(prev => ({ ...prev, asesores: true })); // Marcar asesores como cargados
    }
  }, [formData.autores, formData.asesores, dataLoaded]);

  const handleChange = (key, value, index, type = 'autores') => {
    const newEntries = [...formData[type]];
    newEntries[index][key] = String(value);
    setFormData(prev => ({ ...prev, [type]: newEntries }));
  };

  return (
    <ModalTwoCol
      onClose={onClose}
      headerText="Ver Tesis"
      footerButtons={
        <>
          <Button onClick={onClose} variant="secondary">Cerrar</Button>
          <Button iconName="download" href={fileUrl} target="_blank" variant="primary">Descargar</Button>
        </>
      }
      fileUrl={fileUrl}
      formContent={
        <SpaceBetween direction="vertical" size="l">
          <Container header={<Header variant="h3">Formulario de Tesis</Header>}>
            <SpaceBetween direction="vertical" size="s">
              <FormField label="Facultad">
                <Input value={formData.facultad} readOnly />
              </FormField>
              <FormField label="Escuela">
                <Input value={formData.escuela} readOnly />
              </FormField>
              <FormField label="Título">
                <Input value={formData.titulo} readOnly />
              </FormField>
              <ColumnLayout columns={3}>
                <FormField label="Tipo">
                  <Select
                    selectedOption={{ label: formData.tipo, value: formData.tipo }}
                    options={[
                      { label: 'Tesis', value: 'Tesis' },
                      { label: 'Trabajo de investigación', value: 'Trabajo de investigación' }
                    ]}
                    readOnly
                  />
                </FormField>
                <FormField label="Grado">
                  <Select
                    selectedOption={{ label: formData.grado, value: formData.grado }}
                    options={[
                      { label: 'Magister', value: 'Magister' },
                      { label: 'Doctorado', value: 'Doctorado' }
                    ]}
                    readOnly
                  />
                </FormField>
                <FormField label="Año">
                  <Input value={formData.year} readOnly />
                </FormField>
              </ColumnLayout>
            </SpaceBetween>
          </Container>
          {formData.autores.map((autor, index) => (
            <Container
              key={index}
              header={<Header variant="h5">Datos del Autor {index + 1}</Header>}
            >
              <ColumnLayout columns={2}>
                <FormField label="Nombres">
                  <Input
                    value={autor.nombre}
                    readOnly
                  />
                </FormField>
                <FormField label="Apellidos">
                  <Input
                    value={autor.apellido}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={2}>
                <FormField label="Tipo de Documento">
                  <Select
                    selectedOption={{ label: autor.tipoDocumento, value: autor.tipoDocumento }}
                    options={[
                      { label: 'DNI', value: 'DNI' },
                      { label: 'Pasaporte', value: 'Pasaporte' }
                    ]}
                    readOnly
                  />
                </FormField>
                <FormField label="Número de Documento">
                  <Input
                    value={autor.dni}
                    readOnly
                  />
                </FormField>
                <FormField label="Teléfono">
                  <Input
                    value={autor.telefono}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout>
                <FormField label="Email UNMSM">
                  <Input
                    value={autor.email}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout>
                <FormField label="URL de ORCID">
                  <Input
                    value={autor.orcid}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
            </Container>
          ))}
          {formData.asesores.map((asesor, index) => (
            <Container
              key={index}
              header={<Header variant="h5">Datos del Asesor {index + 1}</Header>}
            >
              <ColumnLayout columns={2}>
                <FormField label="Nombres">
                  <Input
                    value={asesor.nombre}
                    readOnly
                  />
                </FormField>
                <FormField label="Apellidos">
                  <Input
                    value={asesor.apellido}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={2}>
                <FormField label="Tipo de Documento">
                  <Select
                    selectedOption={{ label: asesor.tipoDocumento, value: asesor.tipoDocumento }}
                    options={[
                      { label: 'DNI', value: 'DNI' },
                      { label: 'Pasaporte', value: 'Pasaporte' }
                    ]}
                    readOnly
                  />
                </FormField>
                <FormField label="Grado">
                  <Select
                    selectedOption={{ label: asesor.titulo, value: asesor.titulo }}
                    options={[
                      { label: 'Doctor', value: 'Doctor' },
                      { label: 'Magister', value: 'Magister' },
                      { label: 'Bachiller', value: 'Bachiller' }
                    ]}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
              <ColumnLayout>
                <FormField label="URL de ORCID">
                  <Input
                    value={asesor.orcid}
                    readOnly
                  />
                </FormField>
              </ColumnLayout>
            </Container>
          ))}
        </SpaceBetween>
      }
    />
  );
};

export default TesisModalVer;
