// src/components/dashboard/views/escuela_upg/Solicitudes/Observados.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Table, Pagination, TextFilter, Box, Select, Grid, Button, Modal, SpaceBetween } from '@cloudscape-design/components';
import solicitudService from '../../../../../services/solicitudService';
import UserContext from '../../../contexts/UserContext';
import ModalObservados from './observados/ModalObservados'; // Importar el nuevo modal

const Observados = ({ renderHeader }) => {
  const { user } = useContext(UserContext); // Extraer datos del usuario del contexto
  const [expedientes, setExpedientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteringText, setFilteringText] = useState('');
  const [selectedFacultad, setSelectedFacultad] = useState(null);
  const [selectedGrado, setSelectedGrado] = useState('todos');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(12); // Máximo de 12 expedientes por página
  const [sortingColumn, setSortingColumn] = useState({ sortingField: 'nombre' });
  const [isAscending, setIsAscending] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocumentos, setSelectedDocumentos] = useState([]);

  // Al montar el componente, cargar las solicitudes observadas desde el servicio
  useEffect(() => {
    const fetchExpedientesObservados = async () => {
      setIsLoading(true);
      try {
        const { facultad_id, grado_id } = user;
        const expedientesObservados = await solicitudService.fetchSolicitudesObservadasPorFacultadYGrado(facultad_id, grado_id);
        setExpedientes(expedientesObservados);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener expedientes observados:', error);
        setIsLoading(false);
      }
    };
    fetchExpedientesObservados();
  }, [user]);

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

  const handleVerDocumentos = (documentosObservados) => {
    setSelectedDocumentos(documentosObservados);
    setIsModalOpen(true);
  };

  return (
    <>
      <Table
        header={renderHeader('Expedientes Observados', sortedItems.length)}
        items={paginatedItems}
        columnDefinitions={[
          { id: 'expedienteId', header: 'Exp. ID', cell: item => item.documento_id, sortingField: 'documento_id' },
          { id: 'dni', header: 'DNI', cell: item => item.identificacion_id, sortingField: 'identificacion_id' },
          { id: 'nombre', header: 'Nombre y Apellido', cell: item => item.nombre_completo, sortingField: 'nombre_completo' },
          { id: 'facultad', header: 'Facultad', cell: item => item.facultad, sortingField: 'facultad' },
          { id: 'grado', header: 'Grado', cell: item => item.grado, sortingField: 'grado' },
          { id: 'programa', header: 'Programa', cell: item => item.programa, sortingField: 'programa' },
          {
            id: 'tipoTrabajo',
            header: 'Acciones',
            cell: item => (
              <Button onClick={() => handleVerDocumentos(item.documentos_observados)}>
                Ver Documentos
              </Button>
            ),
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
        empty={<Box>No hay expedientes observados</Box>}
      />

      {isModalOpen && (
        <ModalObservados
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          documentos={selectedDocumentos}
        />
      )}
    </>
  );
};

export default Observados;
