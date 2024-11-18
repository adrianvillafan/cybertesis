//src/components/dashboard/views/recepDocs/expedientes/Observados.jsx

import React, { useState } from 'react';
import { Table, Button, Pagination, TextFilter, Box, Grid, Select } from '@cloudscape-design/components';

const Observados = ({ renderHeader }) => {
  const [filteringText, setFilteringText] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedFacultad, setSelectedFacultad] = useState(null);
  const [pageSize] = useState(10);
  const [selectedGrado, setSelectedGrado] = useState('todos');


  const expedientesObservados = [
    { id: 5, nombre: 'Luis Martínez', estado: 'Observado', dni: '56789012', expedienteId: 'EXP005' },
    { id: 6, nombre: 'Lucía Fernández', estado: 'Observado', dni: '21098765', expedienteId: 'EXP006' },
  ];

  const filteredItems = expedientesObservados.filter(item =>
    item.nombre.toLowerCase().includes(filteringText.toLowerCase()) ||
    item.dni.toLowerCase().includes(filteringText.toLowerCase()) ||
    item.expedienteId.toLowerCase().includes(filteringText.toLowerCase())||
    item.codigo_estudiante.toString().includes(filteringText.toLowerCase())
  );

  const paginatedItems = filteredItems.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    // Función para formatear el programa: primera letra en mayúscula
    const formatPrograma = (programa) => {
      return programa.charAt(0).toUpperCase() + programa.slice(1).toLowerCase();
  };

// Obtenemos todas las facultades disponibles en los expedientes
const facultadesDisponibles = [...new Set(expedientesObservados.map(exp => exp.facultad))];


  return (
    <Table
      header={renderHeader('Expedientes Observados', filteredItems.length)}
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
        { id: 'dni', header: 'DNI', cell: item => item.dni, sortingField: 'dni'},

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
        {
          id: 'acciones',
          header: 'Acciones',
          cell: item => <Button>Abrir</Button>,
          sortingDisabled: true,
          minWidth: 140,
      }
      ]}
      pagination={
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', transform: 'translateY(-20px)' }}>
        <Pagination
          currentPageIndex={pageNumber}
          pagesCount={Math.ceil(filteredItems.length / pageSize)}
          onChange={({ detail }) => setPageNumber(detail.currentPageIndex)}
        />
        </div>
      }
      filter={
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Grid gridDefinition={[{ colspan: 6 }, { colspan: 3 }, { colspan: 3 }]}>
                <Box marginRight="s">
                    <TextFilter
                        filteringText={filteringText}
                        filteringPlaceholder="Buscar expediente..."
                        onChange={({ detail }) => setFilteringText(detail.filteringText)}
                    />
                </Box>
                <Box marginRight="s">
                    <Select
                        selectedOption={selectedFacultad ? { label: selectedFacultad } : { label: 'Todas las facultades' }}
                        onChange={({ detail }) => setSelectedFacultad(detail.selectedOption.label === 'Todas las facultades' ? null : detail.selectedOption.label)}
                        options={[
                            { label: 'Todas las facultades', value: null },
                            ...facultadesDisponibles.map(facultad => ({ label: facultad, value: facultad }))
                        ]}
                        placeholder="Seleccionar facultad"
                    />
                </Box>
                <Box marginRight="s">
                    <Select
                        selectedOption={{ label: selectedGrado }}
                        onChange={({ detail }) => setSelectedGrado(detail.selectedOption.value)}
                        options={[
                            { label: 'Todos', value: 'todos' },
                            { label: 'Pregrado', value: 'pregrado' },
                            { label: 'Posgrado', value: 'posgrado' }
                        ]}
                        placeholder="Seleccionar grado"
                    />
                </Box>
            </Grid>
          </div>
      }
      empty={<Box>No hay expedientes observados</Box>}
    />
  );
};

export default Observados;
