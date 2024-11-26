import React, { useState } from 'react';
import { Table, Button, Pagination, TextFilter, Box, Select, Grid, ProgressBar, Badge } from '@cloudscape-design/components';

const Pendientes = ({ renderHeader, expedientes }) => {
    const [filteringText, setFilteringText] = useState('');
    const [selectedFacultad, setSelectedFacultad] = useState(null);
    const [selectedGrado, setSelectedGrado] = useState('todos');
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(12); // Máximo de 12 expedientes por página
    const [sortingColumn, setSortingColumn] = useState({ sortingField: 'nombre_completo' });
    const [isAscending, setIsAscending] = useState(true);

    // Obtenemos todas las facultades disponibles en los expedientes
    const facultadesDisponibles = [...new Set(expedientes.map(exp => exp.facultad))];

    // Función que maneja el progreso basado en los documentos del expediente
    const calcularProgreso = (alumno) => {
        const fields = ['tesis_id', 'actasust_id', 'certsimil_id', 'autocyber_id', 'metadatos_id', 'repturnitin_id', 'consentimiento_id'];
        const totalFields = fields.length + (alumno.postergacion_id ? 1 : 0); // Sumar 1 si postergacion_id no es null
        const filledFields = fields.reduce((count, field) => count + (alumno[field] ? 1 : 0), 0) + (alumno.postergacion_id ? 1 : 0);
        return parseInt((filledFields / totalFields) * 100);
    };

    // Función para filtrar y ordenar expedientes
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
            header={renderHeader('Expedientes Pendientes', sortedItems.length)}
            items={paginatedItems}
            columnDefinitions={[
                { id: 'documento_id', header: 'Exp. ID', cell: item => item.documento_id, sortingField: 'documento_id' },
                { id: 'codigo_estudiante', header: 'Código', cell: item => item.codigo_estudiante, sortingField: 'codigo_estudiante' },
                { id: 'identificacion_id', header: 'Doc. Identidad', cell: item => item.identificacion_id, sortingField: 'identificacion_id' },
                { id: 'nombre_completo', header: 'Nombre y Apellido', cell: item => item.nombre_completo, sortingField: 'nombre_completo' },
                {
                    id: 'estado', header: 'Estado', cell: item =>
                        <Badge color={item.estado_id === 3 ? 'red' : 'blue'}>
                            {item.estado_id === 3 ? 'Pendiente' : 'Ingresado'}
                        </Badge>
                },
                {
                    id: 'progreso',
                    header: 'Progreso',
                    cell: item => <ProgressBar value={calcularProgreso(item)} label={`${calcularProgreso(item)}%`} />,
                    sortingDisabled: true
                },
                {
                    id: 'acciones',
                    header: 'Acciones',
                    minWidth: 150,
                    cell: item => <Button>Revisar</Button>, // Aquí podrías manejar la acción que corresponda
                    sortingDisabled: true
                }
            ]}
            sortingColumn={sortingColumn}
            sortingDescending={!isAscending}
            stickyColumns={{ first: 0, last: 1 }}
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
                        options={[
                            { label: 'Todas las facultades', value: null },
                            ...facultadesDisponibles.map(facultad => ({ label: facultad, value: facultad }))
                        ]}
                        placeholder="Seleccionar facultad"
                    />
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
                </Grid>
            }
            empty={<Box>No hay expedientes pendientes</Box>}
        />
    );
};

export default Pendientes;
