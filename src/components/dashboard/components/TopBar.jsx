import React from 'react';

const TopBar = () => {
  const headerStyle = {
    fontFamily: 'Open Sans',
    color: 'black'
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #e7e7e7'
    }}>
      <div>
        <img src="src\components\dashboard\components\logo-pa-vrip1.png" alt="Logo Left" style={{ height: '80px' }} />
      </div>
      <div>
        <h1 style={headerStyle}>Recepción de Documentos de Grado y Títulos en Cybertesis</h1>
      </div>
      <div>
        <img src="src\components\dashboard\components\biblioteca_pedro_zulen-scaled.jpg" alt="Logo Right" style={{ height: '50px' }} />
      </div>
    </div>
  );
}

export default TopBar;
