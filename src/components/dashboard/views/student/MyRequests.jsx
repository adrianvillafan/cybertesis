import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Table, SpaceBetween, TextFilter, Header, Pagination, Badge } from '@cloudscape-design/components';
import { fetchSolicitudesByAlumno } from '../../../../../api'; // Ruta correcta al archivo de API
import UserContext from '../../contexts/UserContext';

const MyRequests = () => {
  const { user } = useContext(UserContext);
  const [solicitudes, setSolicitudes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteringText, setFilteringText] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const itemsPerPage = 8; // Número de elementos por página

  useEffect(() => {
    if (user) {
      fetchSolicitudesByAlumno(user.estudiante_id)  // Usar el id del alumno desde el contexto del usuario
        .then((data) => {
          setSolicitudes(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error al cargar solicitudes:', error);
          setIsLoading(false);
        });
    }
  }, [user]);

  const filteredItems = solicitudes.filter(
    item =>
      (item.tesis_titulo ? item.tesis_titulo.toLowerCase() : '').includes(filteringText.toLowerCase()) ||
      (item.programa_nombre ? item.programa_nombre.toLowerCase() : '').includes(filteringText.toLowerCase()) ||
      (item.id ? item.id.toString() : '').includes(filteringText) ||
      (item.fecha_alum ? new Date(item.fecha_alum).toLocaleString().toLowerCase() : '').includes(filteringText.toLowerCase()) ||
      (item.id_estado ? item.id_estado.toString() : '').includes(filteringText)
  );
  

  const paginatedItems = filteredItems.slice(
    (currentPageIndex - 1) * itemsPerPage,
    currentPageIndex * itemsPerPage
  );

  const estadoBadge = (estadoId) => {
    const estados = {
      3: <Badge color="grey">Registrada</Badge>,
      2: <Badge color="blue">En Revisión</Badge>,
      1: <Badge color="green">Completada</Badge>,
      // Puedes añadir más estados según tu lógica de negocio
    };
    return estados[estadoId] || <Badge color="grey">Desconocido</Badge>;
  };

  return (
    <Table
      columnDefinitions={[
        {
          id: 'solicitudId',
          header: 'ID de Solicitud',
          cell: item => item.id,
          sortingField: 'id',
          isRowHeader: true,
          width: 120
        },
        {
          id: 'tesisTitulo',
          header: 'Título de la Tesis',
          cell: item => item.tesis_titulo,
          sortingField: 'tesis_titulo',
          width: 250
        },
        {
          id: 'programaNombre',
          header: 'Programa',
          cell: item => item.programa_nombre,
          sortingField: 'programa_nombre',
          width: 300  // Ajustado el ancho de la columna del programa
        },
        {
          id: 'fechaSolicitud',
          header: 'Fecha de Solicitud',
          cell: item => new Date(item.fecha_alum).toLocaleString(),
          sortingField: 'fecha_alum',
          width: 200
        },
        {
          id: 'estado',
          header: 'Estado',
          cell: item => estadoBadge(item.id_estado),
          sortingField: 'id_estado',
          width: 120
        },
        {
          id: 'acciones',
          header: 'Acciones',
          cell: item => (
            <Button onClick={() => console.log(`Ver solicitud ${item.id}`)} size="small">Ver</Button>
          ),
          width: 100,
          align: 'center'
        }
      ]}
      items={paginatedItems}
      loading={isLoading}
      loadingText="Cargando solicitudes..."
      selectedItems={[]}
      onSelectionChange={() => {}}
      empty={
        <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
          <SpaceBetween size="m">
            <b>No tienes solicitudes registradas</b>
          </SpaceBetween>
        </Box>
      }
      filter={
        <TextFilter
          filteringPlaceholder="Buscar solicitudes"
          filteringText={filteringText}
          onChange={({ detail }) => setFilteringText(detail.filteringText)}
        />
      }
      pagination={
        <Pagination
          currentPageIndex={currentPageIndex}
          pagesCount={Math.ceil(filteredItems.length / itemsPerPage)}
          onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
        />
      }
      renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) => 
        `Mostrando solicitudes ${firstIndex} a ${lastIndex} de ${totalItemsCount}`
      }
      stickyHeader
      wrapLines
      resizableColumns
    />
  );
};

export default MyRequests;
