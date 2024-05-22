import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Modal, TextFilter, Header, Pagination, SpaceBetween, Box } from '@cloudscape-design/components'; // Asegúrate de importar los componentes correctos de Cloudscape
import UserContext from '../../contexts/UserContext';
import { fetchAlumnadoByEscuelaId } from '../../../../../api';

const Alumnos = () => {
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
    setIsLoading(true);
    fetchAlumnadoByEscuelaId(user.escuela_id, user.grado_id)
      .then(data => {
        setAlumnos(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
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
    alumno.name.toLowerCase().includes(filteringText.toLowerCase())
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

  return (
    <div>
      <Table
        items={paginatedAlumnos}
        loading={isLoading}
        loadingText="Cargando alumnado..."
        empty={
          <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
            <SpaceBetween size="m">
              <b>No hay alumnado registrado</b>
            </SpaceBetween>
          </Box>
        }
        columnDefinitions={[
          { id: 'codigo_estudiante', header: 'Código', cell: item => item.codigo_estudiante },
          { id: 'dni', header: 'DNI', cell: item => item.dni },
          { id: 'name', header: 'Nombre', cell: item => item.name },
          { id: 'email', header: 'Email', cell: item => item.email },
          {
            id: 'ver_info',
            header: 'Ver Info',
            cell: (alumno) => (
              <Button onClick={() => openModal(alumno)}>Ver Info</Button>
            )
          }
        ]}
        ariaLabels={{ tableLabel: 'Tabla de Alumnos' }}
        filter={
          <TextFilter
            filteringText={filteringText}
            filteringPlaceholder="Buscar alumno..."
            onChange={({ detail }) => {
              handleTextFilter(detail.filteringText);
            }}
          />
        }
        header={
          <Header counter={`(${filteredAlumnos.length})`}>Alumnos</Header>
        }
        pagination={
          <Pagination
            currentPageIndex={pageNumber}
            pagesCount={Math.ceil(filteredAlumnos.length / pageSize)}
            onChange={handlePageChange}
          />
        }
      />

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

export default Alumnos;
