import React, { useState } from 'react';
import { Table, Button, Pagination, TextFilter, Box, Select, Grid } from '@cloudscape-design/components';

const Ingresados = ({ renderHeader, expedientes, isLoading }) => {
  const [filteringText, setFilteringText] = useState('');
  const [selectedFacultad, setSelectedFacultad] = useState(null);
  const [selectedGrado, setSelectedGrado] = useState('todos');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(12); // Máximo de 12 expedientes por página
  const [sortingColumn, setSortingColumn] = useState({ sortingField: 'nombre' });
  const [isAscending, setIsAscending] = useState(true);

  // Obtenemos todas las facultades disponibles en los expedientes
  const facultadesDisponibles = [...new Set(expedientes.map(exp => exp.facultad))];

  // Filtro por facultad y grado
  const filteredItems = expedientes.filter(item => {
    const matchesText = item.nombre_completo.toLowerCase().includes(filteringText.toLowerCase()) ||
      item.identificacion_id.toLowerCase().includes(filteringText.toLowerCase()) ||
      item.documento_id.toLowerCase().includes(filteringText.toLowerCase());

    const matchesFacultad = selectedFacultad ? item.facultad === selectedFacultad : true;
    const matchesGrado = selectedGrado === 'todos' ? true : item.grado.toLowerCase() === selectedGrado.toLowerCase();

    return matchesText && matchesFacultad && matchesGrado;
  });

  // Ordenar los elementos filtrados
  const sortedItems = [...filteredItems].sort((a, b) => {
    const aField = a[sortingColumn.sortingField];
    const bField = b[sortingColumn.sortingField];
    const comparison = aField > bField ? 1 : aField < bField ? -1 : 0;
    return isAscending ? comparison : -comparison;
  });

  const paginatedItems = sortedItems.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

  return (
    <Table
      header={renderHeader('Expedientes Ingresados', sortedItems.length)}
      items={paginatedItems}
      columnDefinitions={[
        { id: 'expedienteId', header: 'Exp. ID', cell: item => item.documento_id, sortingField: 'documento_id' },
        { id: 'dni', header: 'DNI', cell: item => item.identificacion_id, sortingField: 'identificacion_id' },
        { id: 'nombre', header: 'Nombre y Apellido', cell: item => item.nombre_completo, sortingField: 'nombre_completo' },
        { id: 'facultad', header: 'Facultad', cell: item => item.facultad, sortingField: 'facultad' },
        { id: 'grado', header: 'Grado', cell: item => item.grado, sortingField: 'grado' },
        { id: 'programa', header: 'Programa', cell: item => item.programa, sortingField: 'programa' },
        { id: 'tipoTrabajo', header: 'Tipo de Trabajo', cell: item => item.tipo_trabajo, sortingField: 'tipo_trabajo' }
      ]}
      sortingColumn={sortingColumn}
      sortingDescending={!isAscending}
      onSortingChange={({ detail }) => {
        setSortingColumn(detail.sortingColumn);
        setIsAscending(detail.isDescending ? false : true);
      }}
      pagination={
        <Pagination
          currentPageIndex={pageNumber}
          pagesCount={Math.ceil(sortedItems.length / pageSize)}
          onChange={({ detail }) => setPageNumber(detail.currentPageIndex)}
        />
      }
      filter={
        <Grid gridDefinition={[{ colspan: 6 }, { colspan: 3 }, { colspan: 2 }]}>
          <TextFilter
            filteringText={filteringText}
            filteringPlaceholder="Buscar expediente..."
            onChange={({ detail }) => setFilteringText(detail.filteringText)}
          />
          <Select
            selectedOption={selectedFacultad ? { label: selectedFacultad } : { label: 'Todas las facultades' }}
            onChange={({ detail }) => setSelectedFacultad(detail.selectedOption.label === 'Todas las facultades' ? null : detail.selectedOption.label)}
            options={[{ label: 'Todas las facultades', value: null }, ...facultadesDisponibles.map(facultad => ({ label: facultad, value: facultad }))]}
            placeholder="Seleccionar facultad"
          />
          <Select
            selectedOption={{ label: selectedGrado }}
            onChange={({ detail }) => setSelectedGrado(detail.selectedOption.value)}
            options={[{ label: 'Todos', value: 'todos' }, { label: 'Pregrado', value: 'pregrado' }, { label: 'Posgrado', value: 'posgrado' }]}
            placeholder="Seleccionar grado"
          />
        </Grid>
      }
      loading={isLoading}
      empty={<Box>No hay expedientes ingresados</Box>}
    />
  );
};

export default Ingresados;
