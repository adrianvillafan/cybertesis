// src/views/NotAuthorized.jsx

import React from 'react';

const NotAuthorized = () => {

  console.log('NotAuthorized component loaded');
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Acceso Denegado</h1>
      <p>No tienes permiso para acceder a esta página.</p>
    </div>
  );
};

export default NotAuthorized;
