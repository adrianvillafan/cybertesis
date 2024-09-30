import React from 'react';
import { Header, Box, Badge } from '@cloudscape-design/components';

const NotificacionesHeader = () => {
  return (
    <Box padding={{ vertical: 's', horizontal: 'l' }} display="flex" justifyContent="space-between" alignItems="center" className="notificaciones--header">
      <Header variant="h2">Notificaciones</Header>
      <Badge color="blue">22</Badge>
    </Box>
  );
};

export default NotificacionesHeader;
