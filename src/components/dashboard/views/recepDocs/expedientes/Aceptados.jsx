import React, { useState } from 'react';
import { Table, Button, Pagination, TextFilter, Box } from '@cloudscape-design/components';

const Aceptados = ({ renderHeader }) => {
  const [filteringText, setFilteringText] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);

  const expedientesAceptados = [
    { id: 3, nombre: 'Carlos García', estado: 'Aceptado', dni: '56781234', expedienteId: 'EXP003' },
    { id: 4, nombre: 'Ana Torres', estado: 'Aceptado', dni: '43218765', expedienteId: 'EXP004' },
  ];

  const filteredItems = expedientesAceptados.filter(item =>
    item.nombre.toLowerCase().includes(filteringText.toLowerCase()) ||
    item.dni.toLowerCase().includes(filteringText.toLowerCase()) ||
    item.expedienteId.toLowerCase().includes(filteringText.toLowerCase())
  );

  const paginatedItems = filteredItems.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

  return (
    <Table
      header={renderHeader('Expedientes Aceptados', filteredItems.length)}
      items={paginatedItems}
      columnDefinitions={[
        {
          id: 'solicitudId',
          header: 'Solicitud ID',
          cell: item => item.solicitudid,
          sortingField: 'solicitudid', // Ordenamiento por ID de solicitud
      },
        { id: 'expedienteId', header: 'Exp. ID', cell: item => item.expedienteId },
        {
          id: 'codigoEstudiante',
          header: 'Código Estudiante',
          cell: item => item.codigo_estudiante,
          sortingField: 'codigo_estudiante', // Ordenamiento por código de estudiante
      },
        { id: 'dni', header: 'DNI', cell: item => item.dni, sortingField: 'dni' },
        { id: 'nombre', header: 'Nombre y Apellido', cell: item => item.nombre, sortingField: 'nombre_completo', },
        {
          id: 'facultad',
          header: 'Facultad',
          cell: item => item.facultad,
          sortingField: 'facultad', // Ordenamiento por facultad
      },
      {
        id: 'grado',
        header: 'Grado',
        cell: item => item.grado,
        sortingField: 'grado', // Ordenamiento por grado
    },
    {
      /*id: 'programa',
      header: 'Programa',
      cell: item => formatPrograma(item.programa),
      sortingField: 'programa', // Ordenamiento por programa*/
        id: 'programa',
        header: 'Programa',
        cell: item => item.programa ? formatPrograma(item.programa) : 'No definido',
        sortingField: 'programa',
  },
    {
      id: 'fechaCarga',
      header: 'Fecha de Carga',
      cell: item => new Date(item.fecha_carga).toLocaleDateString(),
      sortingField: 'fecha_carga', // Ordenamiento por fecha de carga
  },
        { id: 'acciones', header: 'Acciones', cell: item => <Button>Abrir</Button> }
      ]}
      pagination={
        <Pagination
          currentPageIndex={pageNumber}
          pagesCount={Math.ceil(filteredItems.length / pageSize)}
          onChange={({ detail }) => setPageNumber(detail.currentPageIndex)}
        />
      }
      filter={
        <TextFilter
          filteringText={filteringText}
          filteringPlaceholder="Buscar expediente..."
          onChange={({ detail }) => setFilteringText(detail.filteringText)}
        />
      }
      empty={<Box>No hay expedientes aceptados</Box>}
    />
  );
};

export default Aceptados;
