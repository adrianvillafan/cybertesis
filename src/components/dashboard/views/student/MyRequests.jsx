import React, { useState, useEffect, useContext } from 'react';
import { Button, SpaceBetween, Table, Badge, Box, Spinner, TextFilter, Pagination, Header } from '@cloudscape-design/components';
import UserContext from '../../contexts/UserContext';
import DetallesModal from './MyRequests/DetallesModal';
import EditarModal from './MyRequests/EditarModal';
import EliminarModal from './MyRequests/EliminarModal';
import { fetchSolicitudesByStudentId } from '../../../../../api';

const MyRequests = () => {
  const { user } = useContext(UserContext);
  const [solicitudes, setSolicitudes] = useState([]);
  const [currentSolicitud, setCurrentSolicitud] = useState(null);
  const [isDetallesModalOpen, setIsDetallesModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteringText, setFilteringText] = useState("");

  useEffect(() => {
    setIsLoading(true);
    if (user && user.id) {
      fetchSolicitudesByStudentId(user.id)
        .then(data => {
          setSolicitudes(data);
          setFilteredSolicitudes(data);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [user]);

  useEffect(() => {
    const ajustarElementosMostrados = () => {
      const screenHeight = window.innerHeight;
      const tablePadding = 25;
      const availableHeight = screenHeight * 0.70 - tablePadding;
      const averageRowHeight = 50;
      const rowsPerPage = Math.floor(availableHeight / averageRowHeight);
      const elementosPorPagina = Math.max(rowsPerPage, 1);
      setPageSize(elementosPorPagina);
    };

    window.addEventListener('load', ajustarElementosMostrados);
    window.addEventListener('resize', ajustarElementosMostrados);

    return () => {
      window.removeEventListener('load', ajustarElementosMostrados);
      window.removeEventListener('resize', ajustarElementosMostrados);
    };
  }, []);

  const handleTextFilter = (text) => {
    setFilteringText(text);
    const filteredData = solicitudes.filter(solicitud =>
      solicitud.tipoSolicitud.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredSolicitudes(filteredData);
    setPageNumber(1);
  };

  const handlePageChange = ({ detail }) => {
    setPageNumber(detail.currentPageIndex);
  };

  const startIndex = (pageNumber - 1) * pageSize;
  const paginatedSolicitudes = filteredSolicitudes.slice(startIndex, startIndex + pageSize);

  if (error) {
    return <p>Error al cargar solicitudes: {error}</p>;
  }

  const abrirDetallesModal = (solicitud) => {
    setCurrentSolicitud(solicitud);
    setIsDetallesModalOpen(true);
  };

  const abrirEditarModal = (solicitud) => {
    setCurrentSolicitud(solicitud);
    setIsEditarModalOpen(true);
  };

  const abrirEliminarModal = (solicitud) => {
    setCurrentSolicitud(solicitud);
    setIsEliminarModalOpen(true);
  };

  const cerrarModal = () => {
    setIsDetallesModalOpen(false);
    setIsEditarModalOpen(false);
    setIsEliminarModalOpen(false);
  };

  const handleDeleteUser = (id) => {
    setSolicitudes(solicitudes.filter(solicitud => solicitud.id !== id));
    cerrarModal();
  };

  return (
    <div>
      <Table
        items={paginatedSolicitudes}
        loading={isLoading}
        loadingText="Cargando solicitudes..."
        empty={
          <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
            <SpaceBetween size="m">
              <b>No hay solicitudes</b>
            </SpaceBetween>
          </Box>
        }
        resizableColumns
        columnDefinitions={[
          {
            id: 'id',
            header: 'ID',
            cell: item => item.id,
            minWidth: 40,
            width: 50,
            maxWidth: 60
          },
          {
            id: 'descripcion',
            header: 'Descripción',
            cell: item => item.tipoSolicitud,
            minWidth: 235,
            width: 240,
            maxWidth: 300
          },
          { id: 'fechaEnvio', header: 'Fecha de Envío', cell: item => item.fechaRegistro },
          {
            id: 'estado',
            header: 'Estado',
            cell: item => <Badge color={item.estado === "Aprobado" ? "green" : item.estado === "Pendiente" ? "blue" : "red"}>{item.estado}</Badge>
          },
          {
            id: 'acciones',
            header: 'Acciones',
            cell: item => (
              <Box>
                <SpaceBetween direction="horizontal" size="xxs">
                  <Button onClick={() => abrirDetallesModal(item)}>Ver</Button>
                  <Button onClick={() => abrirEditarModal(item)}>Editar</Button>
                  <Button onClick={() => abrirEliminarModal(item)}>Eliminar</Button>
                </SpaceBetween>
              </Box>
            ),
            minWidth: 300,
            width: 350,
            maxWidth: 400
          }
        ]}
        ariaLabels={{ tableLabel: 'Tabla de solicitudes' }}
        filter={
          <TextFilter
            filteringText={filteringText}
            filteringPlaceholder="Buscar solicitud..."
            onChange={({ detail }) => {
              handleTextFilter(detail.filteringText);
            }}
          />
        }
        header={
          <Header counter={`(${filteredSolicitudes.length})`}>
            Mis Solicitudes
          </Header>
        }
        pagination={
          <Pagination
            currentPageIndex={pageNumber}
            pagesCount={Math.ceil(filteredSolicitudes.length / pageSize)}
            onChange={handlePageChange}
          />
        }
      />

      {isDetallesModalOpen && (
        <DetallesModal solicitud={currentSolicitud} onClose={cerrarModal} />
      )}
      {isEditarModalOpen && (
        <EditarModal solicitud={currentSolicitud} onClose={cerrarModal} />
      )}
      {isEliminarModalOpen && (
        <EliminarModal solicitud={currentSolicitud} onClose={cerrarModal} onConfirm={() => handleDeleteUser(currentSolicitud.id)} />
      )}
    </div>
  );
};

export default MyRequests;
