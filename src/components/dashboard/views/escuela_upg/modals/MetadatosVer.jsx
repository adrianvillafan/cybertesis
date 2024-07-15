import React, { useState, useEffect, useContext } from 'react';
import ModalTwoCol from './ModalTwoCol';
import { Button, FormField, Input, SpaceBetween, Container, Header, ColumnLayout, Multiselect } from '@cloudscape-design/components';
import UserContext from '../../../contexts/UserContext';
import { fetchDatosByDni, fetchTesisById, fetchActaById, fetchMetadataById } from '../../../../../../api';

const MetadatosVer = ({ onClose, documentos }) => {
  const { user } = useContext(UserContext);
  const [fileUrl, setFileUrl] = useState('');
  const [formData, setFormData] = useState({
    autores: [],
    jurados: [],
    presidente: {},
    asesores: [],
    lineaInvestigacion: '',
    grupoInvestigacion: '',
    agenciaFinanciamiento: '',
    pais: '',
    departamento: '',
    provincia: '',
    distrito: '',
    direccion: '',
    latitud: '',
    longitud: '',
    anoInicio: '',
    anoFin: '',
    disciplinasOCDE: []
  });

  useEffect(() => {
    const fetchParticipantsData = async () => {
      try {
        const metadataData = await fetchMetadataById(documentos.metadatos_id);
        console.log('metadataData:', metadataData);

        const tesisData = await fetchTesisById(documentos.tesis_id);
        console.log('tesisData:', tesisData);

        const autores = [];
        if (tesisData.autor1_dni) {
          const tipoDocumento1 = isNaN(tesisData.autor1_dni) ? 2 : 1;
          autores.push(await fetchDatosByDni(tipoDocumento1, tesisData.autor1_dni));
        }
        if (tesisData.autor2_dni) {
          const tipoDocumento2 = isNaN(tesisData.autor2_dni) ? 2 : 1;
          autores.push(await fetchDatosByDni(tipoDocumento2, tesisData.autor2_dni));
        }

        const actaData = await fetchActaById(documentos.actasust_id);
        console.log('actaData:', actaData);

        const presidente = actaData.presidente_dni ? await fetchDatosByDni(isNaN(actaData.presidente_dni) ? 2 : 1, actaData.presidente_dni) : {};

        const jurados = [];
        if (actaData.miembro1_dni) {
          const tipoDocumento1 = isNaN(actaData.miembro1_dni) ? 2 : 1;
          jurados.push(await fetchDatosByDni(tipoDocumento1, actaData.miembro1_dni));
        }
        if (actaData.miembro2_dni) {
          const tipoDocumento2 = isNaN(actaData.miembro2_dni) ? 2 : 1;
          jurados.push(await fetchDatosByDni(tipoDocumento2, actaData.miembro2_dni));
        }
        if (actaData.miembro3_dni) {
          const tipoDocumento3 = isNaN(actaData.miembro3_dni) ? 2 : 1;
          jurados.push(await fetchDatosByDni(tipoDocumento3, actaData.miembro3_dni));
        }

        const asesores = [];
        if (tesisData.asesor1_dni) {
          const tipoDocumento1 = isNaN(tesisData.asesor1_dni) ? 2 : 1;
          asesores.push(await fetchDatosByDni(tipoDocumento1, tesisData.asesor1_dni));
        }
        if (tesisData.asesor2_dni) {
          const tipoDocumento2 = isNaN(tesisData.asesor2_dni) ? 2 : 1;
          asesores.push(await fetchDatosByDni(tipoDocumento2, tesisData.asesor2_dni));
        }

        const disciplinasOCDE = [];
        if (metadataData.disciplina_1) {
          disciplinasOCDE.push({ label: metadataData.disciplina_1, value: metadataData.uri_disciplina_1, description: metadataData.uri_disciplina_1 });
        }
        if (metadataData.disciplina_2) {
          disciplinasOCDE.push({ label: metadataData.disciplina_2, value: metadataData.uri_disciplina_2, description: metadataData.uri_disciplina_2 });
        }
        if (metadataData.disciplina_3) {
          disciplinasOCDE.push({ label: metadataData.disciplina_3, value: metadataData.uri_disciplina_3, description: metadataData.uri_disciplina_3 });
        }

        console.log('autores:', autores);
        console.log('presidente:', presidente);
        console.log('jurados:', jurados);
        console.log('asesores:', asesores);

        setFormData(prev => ({
          ...prev,
          presidente,
          jurados,
          asesores,
          autores,
          lineaInvestigacion: metadataData.linea_investigacion,
          grupoInvestigacion: metadataData.grupo_investigacion,
          agenciaFinanciamiento: metadataData.agencia_financiamiento,
          pais: metadataData.pais,
          departamento: metadataData.departamento,
          provincia: metadataData.provincia,
          distrito: metadataData.distrito,
          latitud: metadataData.latitud,
          longitud: metadataData.longitud,
          anoInicio: metadataData.ano_inicio,
          anoFin: metadataData.ano_fin,
          disciplinasOCDE
        }));
        setFileUrl(metadataData.file_url);
      } catch (error) {
        console.error('Error al obtener datos de participantes:', error);
      }
    };

    fetchParticipantsData();
  }, [documentos]);

  return (
    <ModalTwoCol
      onClose={onClose}
      headerText="Ver Hoja de Metadatos"
      footerButtons={
        <>
          <Button onClick={onClose} variant="secondary">Cerrar</Button>
          <Button iconName="download" href={fileUrl} target="_blank" variant="primary">Descargar</Button>
        </>
      }
      fileUrl={fileUrl}
      mode={'view'}
      formContent={
        <SpaceBetween direction="vertical" size="l">
            {formData.autores.length > 0 && (
              <Container header={<Header variant="h3">Autor</Header>}>
                {formData.autores.map((autor, index) => (
                  <ColumnLayout key={`autor-${autor.idpersonas}`} columns={2}>
                    <FormField label="Nombres">
                      <Input value={autor.nombre} readOnly />
                    </FormField>
                    <FormField label="Apellidos">
                      <Input value={autor.apellido} readOnly />
                    </FormField>
                    <FormField label="Tipo de Documento">
                      <Input value="DNI" readOnly />
                    </FormField>
                    <FormField label="Número de Documento">
                      <Input value={autor.identificacion_id} readOnly />
                    </FormField>
                    <FormField label="URL de ORCID">
                      <Input value={autor.orcid} readOnly />
                    </FormField>
                  </ColumnLayout>
                ))}
              </Container>
            )}
            {formData.asesores.length > 0 && (
              formData.asesores.map((asesor, index) => (
                <Container key={`asesor-${asesor.idpersonas}-${index}`} header={<Header variant="h3">{index === 0 ? "Asesor" : "Asesor 2"}</Header>}>
                  <ColumnLayout columns={2}>
                    <FormField label="Nombres">
                      <Input value={asesor.nombre} readOnly />
                    </FormField>
                    <FormField label="Apellidos">
                      <Input value={asesor.apellido} readOnly />
                    </FormField>
                    <FormField label="Tipo de Documento">
                      <Input value="DNI" readOnly />
                    </FormField>
                    <FormField label="Número de Documento">
                      <Input value={asesor.identificacion_id} readOnly />
                    </FormField>
                  </ColumnLayout>
                </Container>
              ))
            )}
            {formData.presidente && (
              <Container key={`presidente-${formData.presidente.idpersonas}`} header={<Header variant="h3">Presidente</Header>}>
                <ColumnLayout columns={2}>
                  <FormField label="Nombres">
                    <Input value={formData.presidente.nombre} readOnly />
                  </FormField>
                  <FormField label="Apellidos">
                    <Input value={formData.presidente.apellido} readOnly />
                  </FormField>
                  <FormField label="Tipo de Documento">
                    <Input value="DNI" readOnly />
                  </FormField>
                  <FormField label="Número de Documento">
                    <Input value={formData.presidente.identificacion_id} readOnly />
                  </FormField>
                </ColumnLayout>
              </Container>
            )}
            {formData.jurados.length > 0 && (
              formData.jurados.map((jurado, index) => (
                <Container key={`jurado-${jurado.idpersonas}-${index}`} header={<Header variant="h3">{`Jurado ${index + 1}`}</Header>}>
                  <ColumnLayout columns={2}>
                    <FormField label="Nombres">
                      <Input value={jurado.nombre} readOnly />
                    </FormField>
                    <FormField label="Apellidos">
                      <Input value={jurado.apellido} readOnly />
                    </FormField>
                    <FormField label="Tipo de Documento">
                      <Input value="DNI" readOnly />
                    </FormField>
                    <FormField label="Número de Documento">
                      <Input value={jurado.identificacion_id} readOnly />
                    </FormField>
                  </ColumnLayout>
                </Container>
              ))
            )}


          <Container header={<Header variant="h3">Información Adicional</Header>}>
            <ColumnLayout columns={2}>
              <FormField label="Línea de Investigación">
                <Input value={formData.lineaInvestigacion} readOnly />
              </FormField>
              <FormField label="Grupo de Investigación">
                <Input value={formData.grupoInvestigacion} readOnly />
              </FormField>
            </ColumnLayout>
            <ColumnLayout columns={2}>
              <FormField label="Agencia de Financiamiento">
                <Input value={formData.agenciaFinanciamiento} readOnly />
              </FormField>
              <FormField label="País">
                <Input value={formData.pais} readOnly />
              </FormField>
            </ColumnLayout>
            <ColumnLayout columns={2}>
              <FormField label="Departamento">
                <Input value={formData.departamento} readOnly />
              </FormField>
              <FormField label="Provincia">
                <Input value={formData.provincia} readOnly />
              </FormField>
            </ColumnLayout>
            <ColumnLayout columns={2}>
              <FormField label="Distrito">
                <Input value={formData.distrito} readOnly />
              </FormField>
              <FormField label="Latitud">
                <Input value={formData.latitud} readOnly />
              </FormField>
              <FormField label="Longitud">
                <Input value={formData.longitud} readOnly />
              </FormField>
            </ColumnLayout>
            <ColumnLayout columns={1}>
              <FormField label="Año o rango de años en que se realizó la investigación">
                <Input value={`${formData.anoInicio} - ${formData.anoFin}`} readOnly />
              </FormField>
            </ColumnLayout>
            <ColumnLayout columns={1}>
              <FormField label="Disciplinas OCDE">
                <Multiselect
                  selectedOptions={formData.disciplinasOCDE}
                  options={formData.disciplinasOCDE}
                  readOnly
                />
              </FormField>
            </ColumnLayout>
          </Container>
        </SpaceBetween>
      }
    />
  );
};

export default MetadatosVer;
