import React, { useState, useEffect } from 'react';
import { Table, Button, Pagination, TextFilter, Box, Select, Grid } from '@cloudscape-design/components';
import { fetchExpedientesByEstado } from '../../../../../../api'; // Importar la función para obtener los expedientes
import RevisarExpediente from './recibidos/RevisarExpediente'; // Importamos el nuevo componente

const Recibidos = ({ renderHeader }) => {
    const [expedientesRecibidos, setExpedientesRecibidos] = useState([]);
    const [filteringText, setFilteringText] = useState('');
    const [selectedFacultad, setSelectedFacultad] = useState(null);
    const [selectedGrado, setSelectedGrado] = useState('todos');
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(12); // Máximo de 12 expedientes por página
    const [sortingColumn, setSortingColumn] = useState({ sortingField: 'nombre' });
    const [isAscending, setIsAscending] = useState(true);
    const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null); // Para seleccionar un expediente
    const [isLoading, setIsLoading] = useState(true);

    // Al montar el componente, cargar los expedientes recibidos desde la API
    useEffect(() => {
        const cargarExpedientes = async () => {
            setIsLoading(true);
            try {
                const expedientes = await fetchExpedientesByEstado(3); // Estado 3 para "Recibidos"
                setExpedientesRecibidos(expedientes);
                setIsLoading(false);
            } catch (error) {
                console.error('Error al cargar los expedientes recibidos:', error);
                setIsLoading(false);
            }
        };

        cargarExpedientes();
    }, []);

    // Obtenemos todas las facultades disponibles en los expedientes
    const facultadesDisponibles = [...new Set(expedientesRecibidos.map(exp => exp.facultad))];

    // Filtro por facultad y grado
    const filteredItems = expedientesRecibidos.filter(item => {
        const matchesText = item.nombre_completo.toLowerCase().includes(filteringText.toLowerCase()) ||
            item.dni.toLowerCase().includes(filteringText.toLowerCase()) ||
            item.expedienteid.toString().includes(filteringText.toLowerCase()) ||
            item.codigo_estudiante.toString().includes(filteringText.toLowerCase());

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

    // Redireccionar a RevisarExpediente cuando se seleccione un expediente
    if (expedienteSeleccionado) {
        return (
            <RevisarExpediente
                solicitudId={expedienteSeleccionado.solicitudid}
                expedienteId={expedienteSeleccionado.expedienteid}
                onBack={() => setExpedienteSeleccionado(null)}
            />
        );
    }

    // Función para formatear el programa: primera letra en mayúscula
    const formatPrograma = (programa) => {
        return programa.charAt(0).toUpperCase() + programa.slice(1).toLowerCase();
    };

    return (
        <Table
            header={renderHeader('Expedientes Recibidos', sortedItems.length)}
            items={paginatedItems}
            loading={isLoading}
            loadingText="Cargando expedientes recibidos..."
            columnDefinitions={[
                {
                    id: 'solicitudId',
                    header: 'Solicitud ID',
                    cell: item => item.solicitudid,
                    sortingField: 'solicitudid', // Ordenamiento por ID de solicitud
                },
                {
                    id: 'expedienteId',
                    header: 'Exp. ID',
                    cell: item => item.expedienteid,
                    sortingField: 'expedienteid', // Ordenamiento por ID de expediente
                },
                {
                    id: 'codigoEstudiante',
                    header: 'Código Estudiante',
                    cell: item => item.codigo_estudiante,
                    sortingField: 'codigo_estudiante', // Ordenamiento por código de estudiante
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
                    cell: item => item.nombre_completo,
                    sortingField: 'nombre_completo', // Ordenamiento por nombre
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
                    cell: item => formatPrograma(item.programa),
                    sortingField: 'programa', // Ordenamiento por programa
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
