import React from 'react';
import {
  Table,
  Container,
  Header,
  SpaceBetween
} from '@cloudscape-design/components';

// Datos simulados de las notificaciones, incluyendo notificaciones para "Hoy"
const notificationData = [
  { id: 1, icon: '📄', message: 'Nuevo documento recibido', time: '10:45 AM', date: 'Hoy' },
  { id: 2, icon: '🔔', message: 'Recordatorio de entrega', time: '11:00 AM', date: 'Hoy' },
  // Notificaciones para "Hoy"
  { id: 3, icon: '📬', message: 'Correo importante revisar', time: '09:00 AM', date: 'Martes 16 de enero del 2024' },
  { id: 4, icon: '📅', message: 'Cita agendada confirmada', time: '02:00 PM', date: 'Martes 16 de enero del 2024' }
];

const Notif = () => {
  // Función para agrupar notificaciones por fecha
  const groupNotificationsByDate = (data) => {
    return data.reduce((acc, item) => {
      (acc[item.date] = acc[item.date] || []).push(item);
      return acc;
    }, {});
  };

  const groupedData = groupNotificationsByDate(notificationData);

  return (
    <div><SpaceBetween size="l">
      {Object.entries(groupedData).map(([date, notifications]) => (
        <Container key={date}>
          <SpaceBetween size="s">
            <Header variant="h2">{date}</Header>
            <Table
              columnDefinitions={[
                {
                  id: 'icon',
                  header: 'Tipo',
                  cell: item => <span>{item.icon}</span>
                },
                {
                  id: 'message',
                  header: 'Mensaje',
                  cell: item => <span>{item.message}</span>
                },
                {
                  id: 'time',
                  header: 'Hora',
                  cell: item => <span>{item.time}</span>
                }
              ]}
              items={notifications}
              trackBy="id"
            />
          </SpaceBetween>

        </Container>
      ))}
      </SpaceBetween>
    </div>
  );
};

export default Notif;
