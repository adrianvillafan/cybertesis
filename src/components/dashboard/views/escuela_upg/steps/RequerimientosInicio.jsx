import React from 'react';
import { Box, Button, SpaceBetween, Link, TextContent } from '@cloudscape-design/components';

const RequerimientosInicio = ({ handleStart }) => (
  <Box textAlign="center">
    <SpaceBetween size="xs">
      <h1>Requerimientos para iniciar la solicitud</h1>
      <p>La Dirección de la Escuela Profesional (EP) o la Dirección de la Unidad de Posgrado (UPG) enviará la tesis y la documentación al correo:</p>
      
      <Button variant="primary" onClick={handleStart}>Iniciar Solicitud</Button>
    </SpaceBetween>

    <div style={{ textAlign: 'left', width: '70%', margin: '0 auto' }}>
      <TextContent>
        <br />

        <p className="color-y"><b>REQUISITOS</b></p>
        <Box>
          <ul>
            <li>El documento de la tesis o trabajo de investigación.</li>
            <li>Los documentos añadidos.</li>
          </ul>
        </Box>

        <hr />
        <p className="color-y"><b>DESCARGABLES</b></p>
        <Box>
          <ul className="descargable">
            <li><Link href="https://drive.google.com/file/d/1bMIPHJhO8_vLGoCQNM-elyye4qKh9X0o/view?usp=sharing" external>Guía de Recepción de los archivos digitales para la publicación en Cybertesis</Link></li>
            <li><Link href="archivos/documentos/recepcion_investigacion/ORCID_ID.pdf" external>Guía de creación de perfil ORCID.</Link></li>
            <li><Link href="archivos/documentos/recepcion_investigacion/guia_metadatos_complementarios.pdf" external>Guía de usos y modelos de metadatos complementarios.</Link></li>
            <li><Link href="https://drive.google.com/drive/folders/1hlFUyaKZX_QdTnN4vLhODo1E0gyd2pzN?usp=sharing" external>Formatos de hojas de metadatos</Link></li>
            <li><Link href="archivos/documentos/recepcion_investigacion/formato_fe_errata.docx" external>Fe de erratas.</Link></li>
            <li><Link href="archivos/documentos/recepcion_investigacion/autorizacion.docx" external>Autorización para el depósito de obra en el repositorio de Cybertesis UNMSM.</Link></li>
            <li><Link href="archivos/documentos/recepcion_investigacion/postergacion.docx" external>Solicitud de postergación de publicación de documento de Cybertesis.</Link></li>
            <li><Link href="archivos/documentos/recepcion_investigacion/ocde.pdf" external>Tablas de disciplinas OCDE.</Link></li>
            <li><Link href="https://drive.google.com/drive/folders/1WysFqaDeIKR90Bg0gbEpFqzNkz-eO_Pv?usp=sharing" external>Ejemplos de carátulas.</Link></li>
            <li><Link href="https://drive.google.com/file/d/1Dd8zkcwL_DU4geR85tEeuDdySpZjPqB_/view?usp=sharing" external>Certificado de similitud</Link></li>
          </ul>
        </Box>
      </TextContent>
    </div>
  </Box>
);

export default RequerimientosInicio;
