import React, { useState, useEffect, useContext } from 'react';
import { Button, SpaceBetween, Table, Badge, Box } from '@cloudscape-design/components';
import UserContext from '../../contexts/UserContext';
import DetallesModal from './MyRequests/DetallesModal';
import EditarModal from './MyRequests/EditarModal';
import EliminarModal from './MyRequests/EliminarModal';

const MyRequests = () => {
  const { user } = useContext(UserContext);
  const [solicitudes, setSolicitudes] = useState([]);
  const [currentSolicitud, setCurrentSolicitud] = useState(null);
  const [isDetallesModalOpen, setIsDetallesModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);

  // Simulación de carga de solicitudes
  useEffect(() => {
    // Aquí se debería cargar desde el backend
    setSolicitudes([
      { id: 1, descripcion: "Solicitud de Matrícula", fechaEnvio: "2024-01-02", fechaModificacion: "2024-01-05", estado: "Pendiente" },
      { id: 2, descripcion: "Solicitud de Titulación", fechaEnvio: "2024-01-10", fechaModificacion: "2024-01-12", estado: "Aprobada" }
    ]);
  }, [user]);

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
        columnDefinitions={[
          { header: 'ID', cell: item => item.id },
          { header: 'Descripción', cell: item => item.descripcion },
          { header: 'Fecha de Envío', cell: item => item.fechaEnvio },
          { header: 'Última Modificación', cell: item => item.fechaModificacion },
          { header: 'Estado', cell: item => <Badge color={item.estado === "Aprobada" ? "green" : "red"}>{item.estado}</Badge> },
          {
            header: 'Acciones', cell: item => (
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
