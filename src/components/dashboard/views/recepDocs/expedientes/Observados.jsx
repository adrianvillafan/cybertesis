import React, { useState } from 'react';
import { Table, Button, Pagination, TextFilter, Box } from '@cloudscape-design/components';

const Observados = ({ renderHeader }) => {
  const [filteringText, setFilteringText] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);

  const expedientesObservados = [
    { id: 5, nombre: 'Luis Martínez', estado: 'Observado', dni: '56789012', expedienteId: 'EXP005' },
    { id: 6, nombre: 'Lucía Fernández', estado: 'Observado', dni: '21098765', expedienteId: 'EXP006' },
  ];

  const filteredItems = expedientesObservados.filter(item =>
    item.nombre.toLowerCase().includes(filteringText.toLowerCase()) ||
    item.dni.toLowerCase().includes(filteringText.toLowerCase()) ||
    item.expedienteId.toLowerCase().includes(filteringText.toLowerCase())
  );

  const paginatedItems = filteredItems.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

  return (
    <Table
      header={renderHeader('Expedientes Observados', filteredItems.length)}
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
      empty={<Box>No hay expedientes observados</Box>}
    />
  );
};

export default Observados;
