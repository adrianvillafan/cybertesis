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
        { id: 'expedienteId', header: 'Exp. ID', cell: item => item.expedienteId },
        { id: 'dni', header: 'DNI', cell: item => item.dni },
        { id: 'nombre', header: 'Nombre y Apellido', cell: item => item.nombre },
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
