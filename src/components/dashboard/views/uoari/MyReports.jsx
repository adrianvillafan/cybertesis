import React, { useEffect, useState } from 'react';
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import TextFilter from "@cloudscape-design/components/text-filter";
import Header from "@cloudscape-design/components/header";
import ButtonDropdown from "@cloudscape-design/components/button-dropdown";
import Pagination from "@cloudscape-design/components/pagination";
import uoariService from "../../../../services/uoariService"; // Importa tu servicio

// Componente principal MyReports
const MyReports = () => {
  const [selectedItems, setSelectedItems] = useState([]); // Estado de filas seleccionadas
  const [items, setItems] = useState([]); // Estado para almacenar los datos dinámicos

  // Efecto para cargar los datos desde el servicio al iniciar y refrescar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await uoariService.Datos_Tabla_Principal(); // Llama al servicio
        console.log(response); // Verifica los datos obtenidos en la consola
        setItems(response); // Actualiza el estado con los datos obtenidos
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Llama a la función de carga de datos
  }, []); // El efecto se ejecutará solo al montar el componente

  return (
    <div className="form-lista">
      <Table
        renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
          `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
        }
        onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
        selectedItems={selectedItems}
        ariaLabels={{
          selectionGroupLabel: "Items selection",
          allItemsSelectionLabel: () => "select all",
          itemSelectionLabel: ({ selectedItems }, item) => item.id,
        }}
        columnDefinitions={[
          { id: "id", header: "ID", cell: (e) => e.id, sortingField: "id", isRowHeader: true },
          { id: "titulo", header: "Titulo", cell: (e) => e.Titulo, sortingField: "Titulo" },
          { id: "tipo", header: "Tipo", cell: (e) => e.Tipo, sortingField: "Tipo" },
          { id: "facultad", header: "Facultad", cell: (e) => e.Facultad, sortingField: "Facultad" },
          { id: "grado", header: "Grado", cell: (e) => e.Grado, sortingField: "Grado" },
          
        ]}
        enableKeyboardNavigation
        items={items} // Asigna los datos dinámicos aquí
        loadingText="Loading resources"
        selectionType="single" // Permite selección simple
        trackBy="id"
        empty={
          <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
            <SpaceBetween size="m">
              <b>No resources</b>
              <Button>Create resource</Button>
            </SpaceBetween>
          </Box>
        }
        filter={<TextFilter filteringPlaceholder="Find resources" filteringText="" />}
        header={
          <Header
            counter={`(${items.length})`} // Contador dinámico basado en el número de elementos
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <ButtonDropdown
                  items={[
                    { text: "Editar", id: "deactivate" },
                    { text: "Activate", id: "activate" },
                  ]}
                >
                  Actions
                </ButtonDropdown>
                <Button variant="primary">Create resource</Button>
              </SpaceBetween>
            }
          >
            Listado de Solicitudes
          </Header>
        }
        pagination={<Pagination currentPageIndex={1} pagesCount={1} />}
      />
    </div>
  );
};

export default MyReports;
