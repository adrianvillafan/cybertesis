import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Modal, TextFilter, Header, Pagination, SpaceBetween, Box, Badge, ProgressBar } from '@cloudscape-design/components';
import UserContext from '../../contexts/UserContext';
import { fetchAlumnadoByEscuelaId } from '../../../../../api';

const Solicitudes = () => {
  const { user } = useContext(UserContext);
  const [alumnos, setAlumnos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [filteringText, setFilteringText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchAlumnos = async () => {
      setIsLoading(true);
      try {
        const allAlumnos = await Promise.all(
          user.escuelas.map(escuela =>
            fetchAlumnadoByEscuelaId(escuela.id_escuela, user.grado_id)
          )
        );
        const mergedAlumnos = allAlumnos.flat();
        setAlumnos(mergedAlumnos);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchAlumnos();
    console.log('Alumnos:', alumnos);
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
    setPageNumber(1);
  };

  const handlePageChange = ({ detail }) => {
    setPageNumber(detail.currentPageIndex);
  };

  const startIndex = (pageNumber - 1) * pageSize;
  const filteredAlumnos = alumnos.filter(alumno =>
    alumno.nombre.toLowerCase().includes(filteringText.toLowerCase())
  );
  const paginatedAlumnos = filteredAlumnos.slice(startIndex, startIndex + pageSize);

  if (error) {
    return <p>Error al cargar alumnos: {error}</p>;
  }

  const openModal = (alumno) => {
    setSelectedAlumno(alumno);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderBadge = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return <Badge color="red">Pendiente</Badge>;
      case 'Registrado':
        return <Badge color="blue">Registrado</Badge>;
      case 'Aceptado':
        return <Badge color="green">Aceptado</Badge>;
      default:
        return <Badge color="grey">Desconocido</Badge>;
    }
  };

  const generateRandomData = () => {
    const states = ['Pendiente', 'Registrado', 'Aceptado'];
    return Array.from({ length: 30 }, (_, id) => ({
      folio_id: `${id + 1}`.padStart(4, '0'),
      codigo: `${Math.floor(Math.random() * 90000000) + 10000000}`,
      dni: `${Math.floor(Math.random() * 100000000)}${Math.random() > 0.5 ? '' : String.fromCharCode(Math.floor(Math.random() * 26) + 65)}`,
      nombre: `Nombre Apellido${id + 1}`,
      estado: states[Math.floor(Math.random() * states.length)],
      proceso: Math.floor(Math.random() * 100)
    }));
  };

  const alumnosData = generateRandomData();

  const pendingAlumnos = alumnosData.filter(alumno => alumno.estado === 'Pendiente');
  const registeredAlumnos = alumnosData.filter(alumno => alumno.estado !== 'Pendiente');

  return (
    <div>
      <SpaceBetween size="l">
        <Box>
          <Table
            header=<Header>Alumnos Pendientes</Header>
            items={pendingAlumnos}
            loading={isLoading}
            loadingText="Cargando alumnos pendientes..."
            empty={
              <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
                <SpaceBetween size="m">
                  <b>No hay alumnos pendientes</b>
                </SpaceBetween>
              </Box>
            }
            columnDefinitions={[
              { id: 'folio_id', header: 'Folio ID', cell: item => item.folio_id },
              { id: 'codigo', header: 'Código', cell: item => item.codigo },
              { id: 'dni', header: 'Doc. Identidad', cell: item => item.dni },
              { id: 'nombre', header: 'Nombre y Apellido', cell: item => item.nombre },
              { id: 'estado', header: 'Estado', cell: item => renderBadge(item.estado) },
              { id: 'documentos', header: 'Documentos', cell: () => <Button>Ver Folio</Button> },
              { id: 'proceso', header: 'Proceso', cell: item => <ProgressBar value={item.proceso} label={`${item.proceso}%`} /> }
            ]}
            ariaLabels={{ tableLabel: 'Tabla de Alumnos Pendientes' }}
            filter={
              <TextFilter
                filteringText={filteringText}
                filteringPlaceholder="Buscar alumno..."
                onChange={({ detail }) => {
                  handleTextFilter(detail.filteringText);
                }}
              />
            }
            pagination={
              <Pagination
                currentPageIndex={pageNumber}
                pagesCount={Math.ceil(pendingAlumnos.length / pageSize)}
                onChange={handlePageChange}
              />
            }
          />
        </Box>

        <Box>
          <Table
          header=<Header>Alumnos Cargados</Header>
            items={registeredAlumnos}
            loading={isLoading}
            loadingText="Cargando alumnos cargados..."
            empty={
              <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
                <SpaceBetween size="m">
                  <b>No hay alumnos cargados</b>
                </SpaceBetween>
              </Box>
            }
            columnDefinitions={[
              { id: 'folio_id', header: 'Folio ID', cell: item => item.folio_id },
              { id: 'codigo', header: 'Código', cell: item => item.codigo },
              { id: 'dni', header: 'Doc. Identidad', cell: item => item.dni },
              { id: 'nombre', header: 'Nombre y Apellido', cell: item => item.nombre },
              { id: 'estado', header: 'Estado', cell: item => renderBadge(item.estado) },
              { id: 'documentos', header: 'Documentos', cell: () => <Button>Ver Folio</Button> },
              { id: 'proceso', header: 'Proceso', cell: item => <ProgressBar value={item.proceso} label={`${item.proceso}%`} /> }
            ]}
            ariaLabels={{ tableLabel: 'Tabla de Alumnos Cargados' }}
            filter={
              <TextFilter
                filteringText={filteringText}
                filteringPlaceholder="Buscar alumno..."
                onChange={({ detail }) => {
                  handleTextFilter(detail.filteringText);
                }}
              />
            }
            pagination={
              <Pagination
                currentPageIndex={pageNumber}
                pagesCount={Math.ceil(registeredAlumnos.length / pageSize)}
                onChange={handlePageChange}
              />
            }
          />
        </Box>
      </SpaceBetween>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <div>
            <h2>Información del Alumno</h2>
            <p><strong>Nombre:</strong> {selectedAlumno.name}</p>
            <p><strong>DNI:</strong> {selectedAlumno.dni}</p>
            <p><strong>Email:</strong> {selectedAlumno.email}</p>
            {/* Agrega aquí más campos de información del alumno si es necesario */}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Solicitudes;
