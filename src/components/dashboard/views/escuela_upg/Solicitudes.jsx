import React, { useState, useEffect, useContext } from 'react';
import { SegmentedControl, Box, SpaceBetween, Header } from '@cloudscape-design/components';
import Pendientes from './Solicitudes/Pendientes.jsx';
import Ingresados from './Solicitudes/Ingresados.jsx';
import Observados from './Solicitudes/Observados.jsx';
import UserContext from '../../contexts/UserContext';
import { fetchDocumentosPorEstudiante } from '../../../../../api';

const Solicitudes = () => {
  const { user } = useContext(UserContext);
  const [expedientes, setExpedientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('pendientes'); // Para controlar el tab seleccionado

  useEffect(() => {
    const fetchExpedientes = async () => {
      setIsLoading(true);
      try {
        // Llamada para obtener documentos de cada escuela
        const allExpedientes = await Promise.all(
          user.escuelas.map(escuela =>
            fetchDocumentosPorEstudiante(user.facultad_id, user.grado_id, [escuela.id_escuela])
          )
        );
        const mergedExpedientes = allExpedientes.flat(); // Unificamos todos los resultados
        setExpedientes(mergedExpedientes);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchExpedientes();
  }, [user]);

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
            { text: "Pendientes", id: "pendientes" },
            { text: "Ingresados", id: "ingresados" },
            { text: "Observados", id: "observados" }
          ]}
        />
      }
    >
      {headerText}
    </Header>
  );

  // Función para filtrar expedientes según su estado
  const filtrarExpedientes = (estadoId) => {
    return expedientes.filter(expediente => expediente.estado_id === estadoId);
  };

  // Filtramos los expedientes en tres categorías
  const expedientesPendientes = filtrarExpedientes(3); // Estado pendiente
  const expedientesIngresados = filtrarExpedientes(1); // Estado ingresado o registrado
  const expedientesObservados = filtrarExpedientes(2); // Estado observado

  if (error) {
    return <Box variant="p">Error al cargar expedientes: {error}</Box>;
  }

  return (
    <Box>
      <SpaceBetween size="l">
        {selectedTab === 'pendientes' && (
          <Pendientes
            renderHeader={renderHeader}
            expedientes={expedientesPendientes}
            isLoading={isLoading}
          />
        )}
        {selectedTab === 'ingresados' && (
          <Ingresados
            renderHeader={renderHeader}
            expedientes={expedientesIngresados}
            isLoading={isLoading}
          />
        )}
        {selectedTab === 'observados' && (
          <Observados
            renderHeader={renderHeader}
            expedientes={expedientesObservados}
            isLoading={isLoading}
          />
        )}
      </SpaceBetween>
    </Box>
  );
};

export default Solicitudes;
