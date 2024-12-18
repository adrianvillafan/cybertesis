import React, { useEffect, useState } from 'react';
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import ButtonDropdown from "@cloudscape-design/components/button-dropdown";
import Pagination from "@cloudscape-design/components/pagination";
import PropertyFilter from "@cloudscape-design/components/property-filter";
import uoariService from "../../../../services/uoariService";

const MyReports = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [query, setQuery] = useState({ tokens: [], operation: "and" });
  const [filteringOptions, setFilteringOptions] = useState([]);

  // Efecto para cargar los datos dinámicos desde el servicio
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await uoariService.Datos_Tabla_Principal();
        setItems(response);
        setFilteredItems(response);

        // Generar valores únicos para las opciones de filtrado
        const uniqueOptions = [];
        response.forEach((item) => {
          uniqueOptions.push({ propertyKey: "id", value: item.id.toString() });
          uniqueOptions.push({ propertyKey: "Titulo", value: item.Titulo });
          uniqueOptions.push({ propertyKey: "Tipo", value: item.Tipo });
          uniqueOptions.push({ propertyKey: "Facultad", value: item.Facultad });
          uniqueOptions.push({ propertyKey: "Grado", value: item.Grado });
        });
        setFilteringOptions([...new Set(uniqueOptions.map(JSON.stringify))].map(JSON.parse));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Función para filtrar los datos según la consulta
  useEffect(() => {
    let result = items;

    query.tokens.forEach((token) => {
      const { propertyKey, value } = token;
      result = result.filter((item) =>
        item[propertyKey]?.toString().toLowerCase().includes(value.toLowerCase())
      );
    });

    setFilteredItems(result);
  }, [query, items]);

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
          { id: "id", header: "ID", cell: (e) => e.id, sortingField: "id" },
          { id: "titulo", header: "Titulo", cell: (e) => e.Titulo, sortingField: "Titulo" },
          { id: "tipo", header: "Tipo", cell: (e) => e.Tipo, sortingField: "Tipo" },
          { id: "facultad", header: "Facultad", cell: (e) => e.Facultad, sortingField: "Facultad" },
          { id: "grado", header: "Grado", cell: (e) => e.Grado, sortingField: "Grado" },
        ]}
        enableKeyboardNavigation
        items={filteredItems}
        loadingText="Loading resources"
        selectionType="single"
        trackBy="id"
        empty={
          <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
            <SpaceBetween size="m">
              <b>No resources</b>
              <Button>Create resource</Button>
            </SpaceBetween>
          </Box>
        }
        filter={
          <PropertyFilter
            query={query}
            onChange={({ detail }) => setQuery(detail)}
            countText={`${filteredItems.length} matches`}
            filteringOptions={filteringOptions}
            filteringPlaceholder="Buscar solicitudes"
            filteringProperties={[
              { key: "id", propertyLabel: "ID", operators: ["=", "!="] },
              { key: "Titulo", propertyLabel: "Titulo", operators: ["=", "!=", ":", "!:", "^", "!^"] },
              { key: "Tipo", propertyLabel: "Tipo", operators: ["=", "!=", ":", "!:", "^", "!^"] },
              { key: "Facultad", propertyLabel: "Facultad", operators: ["=", "!=", ":", "!:", "^", "!^"] },
              { key: "Grado", propertyLabel: "Grado", operators: ["=", "!=", ":", "!:", "^", "!^"] },
            ]}
            expandToViewport
            virtualScroll
          />
        }
        header={
          <Header
            counter={`(${filteredItems.length})`}
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <ButtonDropdown
                  items={[
                    { text: "Editar", id: "edit" },
                    { text: "Eliminar", id: "delete" },
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
