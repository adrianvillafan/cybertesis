import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Modal, TextFilter, Header, Pagination, SpaceBetween, Box, Badge, ProgressBar } from '@cloudscape-design/components';
import UserContext from '../../contexts/UserContext';
import { fetchDocumentosPorEstudiante } from '../../../../../api';

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
            fetchDocumentosPorEstudiante(user.facultad_id, user.grado_id, [escuela.id_escuela])
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
    (alumno.nombre_completo && String(alumno.nombre_completo).toLowerCase().includes(filteringText.toLowerCase())) ||
    (alumno.codigo_estudiante && String(alumno.codigo_estudiante).toLowerCase().includes(filteringText.toLowerCase())) ||
    (alumno.identificacion_id && String(alumno.identificacion_id).toLowerCase().includes(filteringText.toLowerCase())) ||
    (alumno.documento_id && String(alumno.documento_id).toLowerCase().includes(filteringText.toLowerCase())) // Convertimos a string si es necesario
  );

  const paginatedAlumnos = filteredAlumnos.slice(startIndex, startIndex + pageSize);

  // Filtramos solo los que tienen estado_id = 3 para pendientes
  const pendingAlumnos = paginatedAlumnos.filter(alumno => alumno.estado_id === 3);
  const registeredAlumnos = paginatedAlumnos.filter(alumno => alumno.estado_id !== 3);

  if (error) {
    return <Box variant="p">Error al cargar alumnos: {error}</Box>;
  }

  const openModal = (alumno) => {
    setSelectedAlumno(alumno);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderBadge = (estado_id) => {
    switch (estado_id) {
      case 3:
        return <Badge color="red">Pendiente</Badge>;
      case 1:
        return <Badge color="blue">Registrado</Badge>;
      case 2:
        return <Badge color="grey">Rechazado</Badge>;
      case 4:
        return <Badge color="green">Solicitado</Badge>;
      default:
        return <Badge color="grey">Desconocido</Badge>;
    }
  };

  const calcularProgreso = (alumno) => {
    const fields = ['tesis_id', 'actasust_id', 'certsimil_id', 'autocyber_id', 'metadatos_id', 'repturnitin_id'];
    const totalFields = fields.length;
    const filledFields = fields.reduce((count, field) => count + (alumno[field] ? 1 : 0), 0);
    return parseInt((filledFields / totalFields) * 100);
  };

  const calcularProgresoFraccion = (alumno) => {
    const fields = ['tesis_id', 'actasust_id', 'certsimil_id', 'autocyber_id', 'metadatos_id', 'repturnitin_id'];
    const totalFields = fields.length;
    const filledFields = fields.reduce((count, field) => count + (alumno[field] ? 1 : 0), 0);
    return `${filledFields}/${totalFields}`;
  };

  return (
    <Box>
      <SpaceBetween size="l">
        <Box>
          <Table
            header={<Header>Expedientes Pendientes</Header>}
            items={pendingAlumnos}
            loading={isLoading}
            loadingText="Cargando Expedientes pendientes..."
            empty={
              <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
                <SpaceBetween size="m">
                  <Box variant="p"><strong>No hay Expedientes pendientes</strong></Box>
                </SpaceBetween>
              </Box>
            }
            columnDefinitions={[
              { id: 'Expediente_id', header: 'Exp. ID', cell: item => item.documento_id },
              { id: 'codigo', header: 'Código', cell: item => item.codigo_estudiante },
              { id: 'dni', header: 'Doc. Identidad', cell: item => item.identificacion_id },
              { id: 'nombre', header: 'Nombre y Apellido', cell: item => item.nombre_completo },
              { id: 'estado', header: 'Estado', cell: item => renderBadge(item.estado_id) },
              { id: 'documentos', header: 'Documentos', cell: item => <Button onClick={() => openModal(item)}>Abrir folio</Button> },
              { id: 'proceso', header: 'Proceso', cell: item => <ProgressBar value={calcularProgreso(item)} label={calcularProgresoFraccion(item)} /> }
            ]}
            ariaLabels={{ tableLabel: 'Tabla de Expedientes Pendientes' }}
            filter={
              <TextFilter
                filteringText={filteringText}
                filteringPlaceholder="Buscar Expediente..."
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
            header={<Header>Expedientes Ingresados</Header>}
            items={registeredAlumnos}
            loading={isLoading}
            loadingText="Cargando Expedientes ingresados..."
            empty={
              <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
                <SpaceBetween size="m">
                  <Box variant="p"><strong>No hay Expedientes ingresados</strong></Box>
                </SpaceBetween>
              </Box>
            }
            columnDefinitions={[
              { id: 'Expediente_id', header: 'Exp. ID', cell: item => item.documento_id },
              { id: 'codigo', header: 'Código', cell: item => item.codigo_estudiante },
              { id: 'dni', header: 'Doc. Identidad', cell: item => item.identificacion_id },
              { id: 'nombre', header: 'Nombre y Apellido', cell: item => item.nombre_completo },
              { id: 'estado', header: 'Estado', cell: item => renderBadge(item.estado_id) },
              { id: 'documentos', header: 'Documentos', cell: item => <Button onClick={() => openModal(item)}>Abrir folio</Button> },
              { id: 'proceso', header: 'Proceso', cell: item => <ProgressBar value={calcularProgreso(item)} label={calcularProgresoFraccion(item)} /> }
            ]}
            ariaLabels={{ tableLabel: 'Tabla de Expedientes Ingresados' }}
            filter={
              <TextFilter
                filteringText={filteringText}
                filteringPlaceholder="Buscar Expediente..."
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

      {isModalOpen && selectedAlumno && (
        <Modal onClose={closeModal}>
          <Box>
            <Box variant="h2">Información del Alumno</Box>
            <Box variant="p"><strong>Nombre:</strong> {selectedAlumno.nombre_completo}</Box>
            <Box variant="p"><strong>DNI:</strong> {selectedAlumno.identificacion_id}</Box>
            <Box variant="p"><strong>Código Estudiante:</strong> {selectedAlumno.codigo_estudiante}</Box>
            <Box variant="p"><strong>Documento ID:</strong> {selectedAlumno.documento_id}</Box>
            <Box variant="p"><strong>Fecha de Carga:</strong> {new Date(selectedAlumno.Fecha_Carga).toLocaleDateString()}</Box>
            <Box variant="p"><strong>Última Modificación:</strong> {new Date(selectedAlumno.Ultima_Modificacion).toLocaleDateString()}</Box>
            {/* Agrega aquí más campos de información del alumno si es necesario */}
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default Solicitudes;
