import React, { useState } from 'react';
import { SegmentedControl, Box, SpaceBetween, Header } from '@cloudscape-design/components';
import Recibidos from './expedientes/Recibidos.jsx';
import Aceptados from './expedientes/Aceptados.jsx';
import Observados from './expedientes/Observados.jsx';

const Expedientes = () => {
  const [selectedTab, setSelectedTab] = useState('recibidos');

  // Función que maneja los cambios del SegmentedControl
  const handleTabChange = ({ detail }) => {
    setSelectedTab(detail.selectedId);
  };

  const renderHeader = (headerText, counter) => (
    <Header
      counter={`(${counter})`}
      actions={
        <SegmentedControl
          selectedId={selectedTab}
          onChange={handleTabChange}
          label="Seleccionar tipo de expediente"
          options={[
            { text: "Recibidos", id: "recibidos" },
            { text: "Aceptados", id: "aceptados" },
            { text: "Observados", id: "observados" }
          ]}
        />
      }
    >
      {headerText}
    </Header>
  );

  return (
    <Box>
      <SpaceBetween size="l">
        {selectedTab === 'recibidos' && <Recibidos renderHeader={renderHeader} />}
        {selectedTab === 'aceptados' && <Aceptados renderHeader={renderHeader} />}
        {selectedTab === 'observados' && <Observados renderHeader={renderHeader} />}
      </SpaceBetween>
    </Box>
  );
};

export default Expedientes;
