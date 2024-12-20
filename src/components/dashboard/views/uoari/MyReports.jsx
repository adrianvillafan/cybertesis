import React, { useEffect, useState } from 'react';
import Table from "@cloudscape-design/components/table";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import ButtonDropdown from "@cloudscape-design/components/button-dropdown";
import Pagination from "@cloudscape-design/components/pagination";
import PropertyFilter from "@cloudscape-design/components/property-filter";
import uoariService from "../../../../services/uoariService";

const MyReports = ({ handleNextStep }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [query, setQuery] = useState({ tokens: [], operation: "and" });
  const [filteringOptions, setFilteringOptions] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga

  // Función para avanzar al siguiente paso con el ID seleccionado
  const NextStep = () => {
    const docid = selectedItems[0]?.id; // Asegurarse de que hay un elemento seleccionado
    if (docid) {
      handleNextStep(docid);
    } else {
      console.warn("No hay un documento seleccionado");
    }
  };

  // Efecto para cargar los datos dinámicos desde el servicio (solo una vez)
  useEffect(() => {
    let isMounted = true; // Para evitar actualizaciones después de desmontar el componente
    const fetchData = async () => {
      try {
        const response = await uoariService.Datos_Tabla_Principal();
        if (isMounted) {
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
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) {
          setLoading(false); // Cambiar el estado de carga a false después de obtener los datos
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Marcar como desmontado
    };
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
        loading={loading} // Mostrar el estado de carga
        loadingText="Cargando datos" // Texto para el estado de carga
        selectionType="single"
        trackBy="id"
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
                <Button onClick={NextStep} variant="primary">Subir Datos</Button>
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
