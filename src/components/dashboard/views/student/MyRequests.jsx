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
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]); // Estado para almacenar las solicitudes filtradas
  const [pageNumber, setPageNumber] = useState(1); // Estado para almacenar el número de página actual
  const [pageSize, setPageSize] = useState(10); // Estado para el número de elementos por página
  const [filteringText, setFilteringText] = useState(""); // Estado para el texto de filtrado


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
    // Función para ajustar el número de elementos mostrados en función del tamaño de la pantalla
    const ajustarElementosMostrados = () => {
      const screenHeight = window.innerHeight;
      const tablePadding = 25; // Ajusta según el padding de tu tabla
      const availableHeight = screenHeight*0.70 - tablePadding;
      const averageRowHeight = 50; // Altura promedio de una fila en píxeles (ajusta según tu diseño)
      const rowsPerPage = Math.floor(availableHeight / averageRowHeight);
      
      const elementosPorPagina = Math.max(rowsPerPage, 1);
      console.log("PageSize:", elementosPorPagina);
      setPageSize(elementosPorPagina);
    };
    

    // Llama a la función de ajuste cuando se carga la página o cambia el tamaño de la ventana
    window.addEventListener('load', ajustarElementosMostrados);
    window.addEventListener('resize', ajustarElementosMostrados);

    // Limpia el event listener al desmontar el componente
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
    setPageNumber(1); // Reiniciar la página a la primera cuando se aplica un filtro
  };



  const handlePageChange = async (requestedPageIndex) => {
    if (requestedPageIndex !== pageNumber && requestedPageIndex.detail.currentPageIndex ) {
      console.log(requestedPageIndex);
      //console.log(requestedPageIndex.detail.currentPageIndex);
      //console.log(pageNumber);
      setPageNumber(requestedPageIndex.detail.currentPageIndex);
    }
  };
  

  const startIndex = (pageNumber - 1) * pageSize; // Índice inicial para la paginación
  const endIndex = Math.min(startIndex + pageSize, filteredSolicitudes.length); // Índice final para la paginación
  const paginatedSolicitudes = filteredSolicitudes.slice(startIndex, endIndex);

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
            minWidth: 40, // Puedes ajustar según tus necesidades
            width: 50,
            maxWidth: 60 // Asegura que esta columna siempre tenga el mismo tamaño
          },
          {
            id: 'descripcion',
            header: 'Descripción',
            cell: item => item.tipoSolicitud,
            minWidth: 235, // Suficiente para acomodar los botones sin apretar
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
        //onRowClick={({ item }) => abrirDetallesModal(item)}
        //onRowContextMenu={({ item }) => abrirEditarModal(item)}
        filter={
          <TextFilter
            filteringText={filteringText}
            filteringPlaceholder="Buscar solicitud..."
            onChange={({ detail }) => {
              handleTextFilter(detail.filteringText)
            }}
          />
        }
        header={
          <Header
            counter={
              " (" + filteredSolicitudes.length + ")"
            }
          >
            Mis Solicitudes
          </Header>
        }
        pagination={
          <Pagination
            totalItemsCount={filteredSolicitudes.length}
            pageSize={pageSize}
            activePage={pageNumber}
            onChange={handlePageChange}
            onNextPageClick={() => {
              if (pageNumber < Math.ceil(filteredSolicitudes.length / pageSize)) {
                setPageNumber(pageNumber + 1);
              }
            }}
            onPreviousPageClick={() => {
              if (pageNumber > 1) {
                setPageNumber(pageNumber - 1);
              }
            }}
            pagesCount={Math.ceil(filteredSolicitudes.length / pageSize)}
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
