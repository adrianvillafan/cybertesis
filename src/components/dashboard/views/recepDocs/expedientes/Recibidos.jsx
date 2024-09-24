import React, { useState } from 'react';
import { Table, Button, Pagination, TextFilter, Box, Select, Grid } from '@cloudscape-design/components';
import RevisarExpediente from './recibidos/RevisarExpediente'; // Importamos el nuevo componente

const Recibidos = ({ renderHeader }) => {
    const [filteringText, setFilteringText] = useState('');
    const [selectedFacultad, setSelectedFacultad] = useState(null);
    const [selectedGrado, setSelectedGrado] = useState('todos');
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(12); // Máximo de 12 expedientes por página
    const [sortingColumn, setSortingColumn] = useState({ sortingField: 'nombre' });
    const [isAscending, setIsAscending] = useState(true);
    const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null); // Para seleccionar un expediente

    // Datos ficticios de expedientes
    const expedientesRecibidos = [
        { id: 1, nombre: 'Juan Pérez', facultad: 'Ingeniería', grado: 'Pregrado', programa: 'Ingeniería de Sistemas', tipoTrabajo: 'Tesis', estado: 'Recibido', dni: '12345678', expedienteId: 'EXP001' },
        { id: 2, nombre: 'María López', facultad: 'Ciencias', grado: 'Posgrado', programa: 'Maestría en Física', tipoTrabajo: 'Trabajo de investigación', estado: 'Recibido', dni: '87654321', expedienteId: 'EXP002' },
        { id: 3, nombre: 'Carlos García', facultad: 'Ingeniería', grado: 'Posgrado', programa: 'Maestría en Ingeniería de Software', tipoTrabajo: 'Tesis', estado: 'Recibido', dni: '56781234', expedienteId: 'EXP003' },
        { id: 4, nombre: 'Ana Torres', facultad: 'Letras', grado: 'Pregrado', programa: 'Literatura', tipoTrabajo: 'Trabajo de investigación', estado: 'Recibido', dni: '45678901', expedienteId: 'EXP004' },
        { id: 5, nombre: 'Luis Fernández', facultad: 'Ingeniería', grado: 'Pregrado', programa: 'Ingeniería Civil', tipoTrabajo: 'Tesis', estado: 'Recibido', dni: '34567890', expedienteId: 'EXP005' },
        { id: 6, nombre: 'Lucía Martínez', facultad: 'Ciencias', grado: 'Posgrado', programa: 'Maestría en Biología', tipoTrabajo: 'Tesis', estado: 'Recibido', dni: '23456789', expedienteId: 'EXP006' },
        { id: 7, nombre: 'David García', facultad: 'Derecho', grado: 'Pregrado', programa: 'Derecho Penal', tipoTrabajo: 'Trabajo de investigación', estado: 'Recibido', dni: '12345677', expedienteId: 'EXP007' },
        { id: 8, nombre: 'Sofía López', facultad: 'Ingeniería', grado: 'Posgrado', programa: 'Maestría en Mecánica', tipoTrabajo: 'Tesis', estado: 'Recibido', dni: '87654320', expedienteId: 'EXP008' },
        { id: 9, nombre: 'Miguel Torres', facultad: 'Ciencias', grado: 'Pregrado', programa: 'Física', tipoTrabajo: 'Tesis', estado: 'Recibido', dni: '76543210', expedienteId: 'EXP009' },
        { id: 10, nombre: 'Carmen Herrera', facultad: 'Ciencias', grado: 'Posgrado', programa: 'Maestría en Matemáticas', tipoTrabajo: 'Tesis', estado: 'Recibido', dni: '65432109', expedienteId: 'EXP010' },
        { id: 11, nombre: 'Pedro Sánchez', facultad: 'Ingeniería', grado: 'Pregrado', programa: 'Ingeniería Electrónica', tipoTrabajo: 'Tesis', estado: 'Recibido', dni: '54321098', expedienteId: 'EXP011' },
        { id: 12, nombre: 'Ana Paredes', facultad: 'Letras', grado: 'Pregrado', programa: 'Historia', tipoTrabajo: 'Trabajo de investigación', estado: 'Recibido', dni: '43210987', expedienteId: 'EXP012' },
        { id: 13, nombre: 'Gustavo Fernández', facultad: 'Derecho', grado: 'Posgrado', programa: 'Maestría en Derecho Civil', tipoTrabajo: 'Tesis', estado: 'Recibido', dni: '32109876', expedienteId: 'EXP013' },
        { id: 14, nombre: 'Carlos Ramírez', facultad: 'Ingeniería', grado: 'Posgrado', programa: 'Maestría en Ingeniería Industrial', tipoTrabajo: 'Tesis', estado: 'Recibido', dni: '21098765', expedienteId: 'EXP014' },
        { id: 15, nombre: 'Verónica Gómez', facultad: 'Ciencias', grado: 'Pregrado', programa: 'Química', tipoTrabajo: 'Trabajo de investigación', estado: 'Recibido', dni: '10987654', expedienteId: 'EXP015' },
        { id: 16, nombre: 'Julio Reyes', facultad: 'Ingeniería', grado: 'Pregrado', programa: 'Ingeniería de Sistemas', tipoTrabajo: 'Tesis', estado: 'Recibido', dni: '98765432', expedienteId: 'EXP016' },
        { id: 17, nombre: 'Laura Sánchez', facultad: 'Derecho', grado: 'Pregrado', programa: 'Derecho Constitucional', tipoTrabajo: 'Trabajo de investigación', estado: 'Recibido', dni: '87654321', expedienteId: 'EXP017' },
        { id: 18, nombre: 'Sergio Díaz', facultad: 'Ciencias', grado: 'Posgrado', programa: 'Maestría en Biología', tipoTrabajo: 'Tesis', estado: 'Recibido', dni: '76543219', expedienteId: 'EXP018' },
        { id: 19, nombre: 'Natalia López', facultad: 'Ingeniería', grado: 'Posgrado', programa: 'Maestría en Ingeniería Mecánica', tipoTrabajo: 'Tesis', estado: 'Recibido', dni: '65432109', expedienteId: 'EXP019' },
        { id: 20, nombre: 'Alberto Ruiz', facultad: 'Ciencias', grado: 'Pregrado', programa: 'Física', tipoTrabajo: 'Tesis', estado: 'Recibido', dni: '54321098', expedienteId: 'EXP020' }
    ];

    // Obtenemos todas las facultades disponibles en los expedientes
    const facultadesDisponibles = [...new Set(expedientesRecibidos.map(exp => exp.facultad))];

    // Filtro por facultad y grado
    const filteredItems = expedientesRecibidos.filter(item => {
        const matchesText = item.nombre.toLowerCase().includes(filteringText.toLowerCase()) ||
            item.dni.toLowerCase().includes(filteringText.toLowerCase()) ||
            item.expedienteId.toLowerCase().includes(filteringText.toLowerCase());

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

    if (expedienteSeleccionado) {
        return (
          <RevisarExpediente
            expedienteId={expedienteSeleccionado.expedienteId}
            onBack={() => setExpedienteSeleccionado(null)}
          />
        );
      }

    return (
        <Table
            header={renderHeader('Expedientes Recibidos', sortedItems.length)}
            items={paginatedItems}
            columnDefinitions={[
                {
                    id: 'expedienteId',
                    header: 'Exp. ID',
                    cell: item => item.expedienteId,
                    sortingField: 'expedienteId', // Ordenamiento por ID de expediente
                },
                {
                    id: 'dni',
                    header: 'DNI',
                    cell: item => item.dni,
                    sortingField: 'dni', // Ordenamiento por DNI
                },
                {
                    id: 'nombre',
                    header: 'Nombre y Apellido',
                    cell: item => item.nombre,
                    sortingField: 'nombre', // Ordenamiento por nombre
                },
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
                    id: 'programa',
                    header: 'Programa',
                    cell: item => item.programa,
                    sortingField: 'programa', // Ordenamiento por programa
                },
                {
                    id: 'tipoTrabajo',
                    header: 'Tipo de Trabajo',
                    cell: item => item.tipoTrabajo,
                    sortingField: 'tipoTrabajo', // Ordenamiento por tipo de trabajo
                },
                {
                    id: 'acciones',
                    header: 'Acciones',
                    cell: item => <Button onClick={() => setExpedienteSeleccionado(item)}>Revisar</Button>,
                    sortingDisabled: true,
                    minWidth: 140,
                  }
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
            empty={<Box>No hay expedientes recibidos</Box>}
        />
    );
};

export default Recibidos;
