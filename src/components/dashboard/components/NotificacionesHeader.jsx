import React from 'react';
import { Box, Badge } from '@cloudscape-design/components';

const NotificacionesHeader = () => {
  return (
    <Box padding={{ vertical: 's', horizontal: 'l' }} display="flex" alignItems="center">
      <Box display="flex" alignItems="center">
        <h2 style={{ marginRight: '10px' }}>Advertencias</h2>
        <Badge color="blue">22</Badge>
      </Box>
    </Box>
  );
};

export default NotificacionesHeader;
