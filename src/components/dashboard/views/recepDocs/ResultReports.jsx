// ResultReports.jsx
import React, { useState } from 'react';
import { Table, Input, Button, SpaceBetween, Container, Header, DatePicker, Select } from '@cloudscape-design/components';

const ResultReports = () => {
  // Datos iniciales de la tabla
  const [data, setData] = useState([
    {
      id: 1,
      numeroIngreso: '',
      fechaRecepcion: '',
      dni: '',
      apellidosNombres: '',
      nombreGrado: '',
      facultad: '',
      nivelAcademico: '',
      titulo: '',
      tipoTrabajo: '',
      anioPublicacion: '',
      tipoAcceso: '',
      fechaInicioEmbargo: '',
      fechaVencimientoEmbargo: '',
      tiempoSolicitudEmbargo: '',
      renovacionEmbargo: '',
      publicadoEn: '',
      fechaPublicacion: '',
      enlaceHandle: '',
      correoEPUP: '',
      envioConfirmacion: '',
      fechaEnvioConfirmacion: '',
      catalogador: '',
      notas: '',
    },
  ]);

  // Opciones para los campos de selección
  const publicadoEnOptions = [
    { label: 'Cybertesis', value: 'Cybertesis' },
    { label: 'Repositorio Nacional', value: 'Repositorio Nacional' },
    { label: 'Otro', value: 'Otro' },
  ];

  const tipoTrabajoOptions = [
    { label: 'Tesis', value: 'Tesis' },
    { label: 'Trabajo de Investigación', value: 'Trabajo de Investigación' },
    { label: 'Otro', value: 'Otro' },
  ];

  const tipoAccesoOptions = [
    { label: 'Acceso Abierto', value: 'Acceso Abierto' },
    { label: 'Restricción', value: 'Restricción' },
  ];

  // Función para manejar cambios en las celdas
  const handleCellChange = (id, field, value) => {
    const updatedData = data.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setData(updatedData);
  };

  // Función para agregar una nueva fila a la tabla
  const addRow = () => {
    const newRow = {
      id: data.length + 1,
      numeroIngreso: '',
      fechaRecepcion: '',
      dni: '',
      apellidosNombres: '',
      nombreGrado: '',
      facultad: '',
      nivelAcademico: '',
      titulo: '',
      tipoTrabajo: '',
      anioPublicacion: '',
      tipoAcceso: '',
      fechaInicioEmbargo: '',
      fechaVencimientoEmbargo: '',
      tiempoSolicitudEmbargo: '',
      renovacionEmbargo: '',
      publicadoEn: '',
      fechaPublicacion: '',
      enlaceHandle: '',
      correoEPUP: '',
      envioConfirmacion: '',
      fechaEnvioConfirmacion: '',
      catalogador: '',
      notas: '',
    };
    setData([...data, newRow]);
  };

  return (
    <Container header={<Header variant="h2">Reporte de Resultados</Header>}>
      <SpaceBetween size="l">
        <Button onClick={addRow}>Agregar Nueva Fila</Button>
        <Table
          columnDefinitions={[
            { id: 'numeroIngreso', header: 'Número de Ingreso', cell: (item) => <Input value={item.numeroIngreso} onChange={({ detail }) => handleCellChange(item.id, 'numeroIngreso', detail.value)} /> },
            { id: 'fechaRecepcion', header: 'Fecha de recepción', cell: (item) => <DatePicker value={item.fechaRecepcion} onChange={({ detail }) => handleCellChange(item.id, 'fechaRecepcion', detail.value)} placeholder="Seleccionar fecha" /> },
            { id: 'dni', header: 'DNI', cell: (item) => <Input value={item.dni} onChange={({ detail }) => handleCellChange(item.id, 'dni', detail.value)} /> },
            { id: 'apellidosNombres', header: 'Apellidos y Nombres', cell: (item) => <Input value={item.apellidosNombres} onChange={({ detail }) => handleCellChange(item.id, 'apellidosNombres', detail.value)} /> },
            { id: 'nombreGrado', header: 'Nombre del Grado', cell: (item) => <Input value={item.nombreGrado} onChange={({ detail }) => handleCellChange(item.id, 'nombreGrado', detail.value)} /> },
            { id: 'facultad', header: 'Facultad', cell: (item) => <Input value={item.facultad} onChange={({ detail }) => handleCellChange(item.id, 'facultad', detail.value)} /> },
            { id: 'nivelAcademico', header: 'Nivel Académico', cell: (item) => <Input value={item.nivelAcademico} onChange={({ detail }) => handleCellChange(item.id, 'nivelAcademico', detail.value)} /> },
            { id: 'titulo', header: 'Título', cell: (item) => <Input value={item.titulo} onChange={({ detail }) => handleCellChange(item.id, 'titulo', detail.value)} /> },
            { id: 'tipoTrabajo', header: 'Tipo de Trabajo', cell: (item) => <Select selectedOption={tipoTrabajoOptions.find(option => option.value === item.tipoTrabajo)} onChange={({ detail }) => handleCellChange(item.id, 'tipoTrabajo', detail.selectedOption.value)} options={tipoTrabajoOptions} placeholder="Seleccionar opción" /> },
            { id: 'anioPublicacion', header: 'Año de Publicación', cell: (item) => <Input type="number" value={item.anioPublicacion} onChange={({ detail }) => handleCellChange(item.id, 'anioPublicacion', detail.value)} /> },
            { id: 'tipoAcceso', header: 'Tipo de Acceso', cell: (item) => <Select selectedOption={tipoAccesoOptions.find(option => option.value === item.tipoAcceso)} onChange={({ detail }) => handleCellChange(item.id, 'tipoAcceso', detail.selectedOption.value)} options={tipoAccesoOptions} placeholder="Seleccionar opción" /> },
            { id: 'fechaInicioEmbargo', header: 'Fecha de inicio de embargo', cell: (item) => <DatePicker value={item.fechaInicioEmbargo} onChange={({ detail }) => handleCellChange(item.id, 'fechaInicioEmbargo', detail.value)} placeholder="Seleccionar fecha" /> },
            { id: 'fechaVencimientoEmbargo', header: 'Fecha de vencimiento embargo', cell: (item) => <DatePicker value={item.fechaVencimientoEmbargo} onChange={({ detail }) => handleCellChange(item.id, 'fechaVencimientoEmbargo', detail.value)} placeholder="Seleccionar fecha" /> },
            { id: 'tiempoSolicitudEmbargo', header: 'Tiempo solicitud de embargo', cell: (item) => <Input value={item.tiempoSolicitudEmbargo} onChange={({ detail }) => handleCellChange(item.id, 'tiempoSolicitudEmbargo', detail.value)} /> },
            { id: 'renovacionEmbargo', header: 'Renovación embargo', cell: (item) => <Input value={item.renovacionEmbargo} onChange={({ detail }) => handleCellChange(item.id, 'renovacionEmbargo', detail.value)} /> },
            { id: 'publicadoEn', header: 'Publicado en', cell: (item) => <Select selectedOption={publicadoEnOptions.find(option => option.value === item.publicadoEn)} onChange={({ detail }) => handleCellChange(item.id, 'publicadoEn', detail.selectedOption.value)} options={publicadoEnOptions} placeholder="Seleccionar opción" /> },
            { id: 'fechaPublicacion', header: 'Fecha de publicación', cell: (item) => <DatePicker value={item.fechaPublicacion} onChange={({ detail }) => handleCellChange(item.id, 'fechaPublicacion', detail.value)} placeholder="Seleccionar fecha" /> },
            { id: 'enlaceHandle', header: 'Enlace HANDLE', cell: (item) => <Input value={item.enlaceHandle} onChange={({ detail }) => handleCellChange(item.id, 'enlaceHandle', detail.value)} /> },
            { id: 'correoEPUP', header: 'Correo electrónico de EP/UP', cell: (item) => <Input value={item.correoEPUP} onChange={({ detail }) => handleCellChange(item.id, 'correoEPUP', detail.value)} /> },
            { id: 'envioConfirmacion', header: 'Envío de Confirmación', cell: (item) => <Input value={item.envioConfirmacion} onChange={({ detail }) => handleCellChange(item.id, 'envioConfirmacion', detail.value)} /> },
            { id: 'fechaEnvioConfirmacion', header: 'Fecha de envío de confirmación', cell: (item) => <DatePicker value={item.fechaEnvioConfirmacion} onChange={({ detail }) => handleCellChange(item.id, 'fechaEnvioConfirmacion', detail.value)} placeholder="Seleccionar fecha" /> },
            { id: 'catalogador', header: 'Catalogador', cell: (item) => <Input value={item.catalogador} onChange={({ detail }) => handleCellChange(item.id, 'catalogador', detail.value)} /> },
            { id: 'notas', header: 'NOTAS', cell: (item) => <Input value={item.notas} onChange={({ detail }) => handleCellChange(item.id, 'notas', detail.value)} /> },
          ]}
          items={data}
          header={<Header>Detalles del Reporte</Header>}
          stickyHeader
          empty={
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <b>No hay datos disponibles</b>
            </div>
          }
        />
      </SpaceBetween>
    </Container>
  );
};

export default ResultReports;
