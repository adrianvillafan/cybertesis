import React, { useState, useEffect, useContext } from 'react';
import { Button, SpaceBetween, Table, Badge, Box, Spinner } from '@cloudscape-design/components';
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

  useEffect(() => {
    setIsLoading(true);
    if (user && user.id) {
      fetchSolicitudesByStudentId(user.id)
        .then(data => {
          setSolicitudes(data);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [user]);

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
        items={solicitudes}
        loading={isLoading}
        loadingText="Cargando solicitudes..."
        empty={
          <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
            <SpaceBetween size="m">
              <b>No resources</b>
            </SpaceBetween>
          </Box>
        }
        columnDefinitions={[
          { id: 'id', header: 'ID', cell: item => item.id },
          { id: 'descripcion', header: 'Descripción', cell: item => item.tipoSolicitud },
          { id: 'fechaEnvio', header: 'Fecha de Envío', cell: item => item.fechaRegistro },
          { id: 'estado', header: 'Estado', cell: item => <Badge color={item.estado === "Aprobado" ? "green" : item.estado === "Pendiente" ? "blue" : "red"}>{item.estado}</Badge> },
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
            )
          }
        ]}
      />{isDetallesModalOpen && (
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
