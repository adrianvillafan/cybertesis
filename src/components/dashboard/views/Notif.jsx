import React, { useEffect, useState, useContext } from 'react';
import {
  Table,
  Container,
  Header,
  SpaceBetween
} from '@cloudscape-design/components';
import {
  fetchEventosNoLeidosPorTarget,
  fetchEventosNoLeidosPorActor,
  fetchEventosPorTarget,
  fetchEventosPorActor,
  fetchEventosPorDocumento
} from '../../../../api';
import UserContext from '../contexts/UserContext';

const Notif = () => {
  const [eventosNoLeidosTarget, setEventosNoLeidosTarget] = useState([]);
  const [eventosNoLeidosActor, setEventosNoLeidosActor] = useState([]);
  const [eventosTarget, setEventosTarget] = useState([]);
  const [eventosActor, setEventosActor] = useState([]);
  const [eventosDocumento, setEventosDocumento] = useState([]);
  const { user } = useContext(UserContext);
  
  // IDs de ejemplo
  const userId = user.user_id; // Usuario actual
  const tipoUserId = user.current_team_id; // Tipo de usuario actual
  const documentId = 1; // ID del documento a probar

  useEffect(() => {
    // Cargar eventos no leídos donde el usuario es el target
    fetchEventosNoLeidosPorTarget(8, 2)
      .then(data => setEventosNoLeidosTarget(data))
      .catch(error => console.error('Error al cargar eventos no leídos (target):', error));

    // Cargar eventos no leídos donde el usuario es el actor
    fetchEventosNoLeidosPorActor(userId, tipoUserId)
      .then(data => setEventosNoLeidosActor(data))
      .catch(error => console.error('Error al cargar eventos no leídos (actor):', error));

    // Cargar todos los eventos donde el usuario es el target
    fetchEventosPorTarget(8, 2)
      .then(data => setEventosTarget(data))
      .catch(error => console.error('Error al cargar eventos (target):', error));

    // Cargar todos los eventos donde el usuario es el actor
    fetchEventosPorActor(userId, tipoUserId)
      .then(data => setEventosActor(data))
      .catch(error => console.error('Error al cargar eventos (actor):', error));

    // Cargar eventos relacionados con un documento
    fetchEventosPorDocumento(8, 3, 2)
      .then(data => setEventosDocumento(data))
      .catch(error => console.error('Error al cargar eventos del documento:', error));
  }, [userId, tipoUserId, documentId]);

  const renderTable = (header, items) => (
    <Container>
      <SpaceBetween size="s">
        <Header variant="h2">{header}</Header>
        <Table
          columnDefinitions={[
            { id: 'action_type', header: 'Acción', cell: item => <span>{item.action_type}</span> },
            { id: 'event_description', header: 'Descripción', cell: item => <span>{item.event_description}</span> },
            { id: 'created_at', header: 'Fecha', cell: item => <span>{new Date(item.created_at).toLocaleString()}</span> },
            { id: 'is_notificacion', header: 'Notificación', cell: item => <span>{item.is_notificacion ? 'Sí' : 'No'}</span> }
          ]}
          items={items}
          trackBy="event_id"
        />
      </SpaceBetween>
    </Container>
  );

  return (
    <div>
      <SpaceBetween size="l">
        {renderTable('Eventos No Leídos (Target)', eventosNoLeidosTarget)}
        {renderTable('Eventos No Leídos (Actor)', eventosNoLeidosActor)}
        {renderTable('Todos los Eventos (Target)', eventosTarget)}
        {renderTable('Todos los Eventos (Actor)', eventosActor)}
        {renderTable('Eventos por Documento', eventosDocumento)}
      </SpaceBetween>
    </div>
  );
};

export default Notif;
