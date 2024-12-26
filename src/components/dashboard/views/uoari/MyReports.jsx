import React, { useEffect, useState } from "react";
import Tabs from "@cloudscape-design/components/tabs";
import Box from "@cloudscape-design/components/box";
import Table from "@cloudscape-design/components/table";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import Pagination from "@cloudscape-design/components/pagination";
import PropertyFilter from "@cloudscape-design/components/property-filter";
import Badge from "@cloudscape-design/components/badge";
import Modal from "@cloudscape-design/components/modal";
import uoariService from "../../../../services/uoariService";
import "../uoari/Formconfig/Styles.css";

const MyReports = ({ handleNextStep }) => {
  const [activeTab, setActiveTab] = useState("general"); // Estado de la pestaña activa
  const [selectedItems, setSelectedItems] = useState([]); // Elementos seleccionados
  const [items, setItems] = useState([]); // Elementos de la tabla
  const [filteredItems, setFilteredItems] = useState([]); // Elementos filtrados
  const [query, setQuery] = useState({ tokens: [], operation: "and" }); // Estado para el filtro
  const [filteringOptions, setFilteringOptions] = useState([]); // Opciones únicas de filtrado
  const [loading, setLoading] = useState(true); // Estado de carga
  const [modalVisible, setModalVisible] = useState(false); // Estado del modal de confirmación
  const [deletingId, setDeletingId] = useState(null); // ID del registro a eliminar

  // Función para avanzar al siguiente paso con el ID seleccionado
  const NextStep = () => {
    const docid = selectedItems[0]?.Solicitud_ID; // Asegurarse de que hay un elemento seleccionado
    if (docid) {
      handleNextStep(docid);
    } else {
      console.warn("No hay un documento seleccionado");
    }
  };

  // Función para cargar datos según la pestaña seleccionada
  const fetchData = async (tab) => {
    setLoading(true);
    setItems([]);
    setFilteredItems([]);

    try {
      let response = [];
      switch (tab) {
        case "general":
          response = await uoariService.Datos_Tabla_Principal();
          break;
        case "abierto":
          response = await uoariService.Datos_Tabla_Abierto();
          break;
        case "cerrado":
          response = await uoariService.Datos_Tabla_Cerrado();
          break;
        case "embargo":
          response = await uoariService.Datos_Tabla_Embargo();
          break;
        default:
          response = [];
      }

      const formattedResponse = response.map((item) => ({
        ...item,
        visibleId: item.Solicitud_ID, // Usamos esta clave para mostrar el ID visible
      }));

      setItems(formattedResponse);
      setFilteredItems(formattedResponse);

      // Generar valores únicos para las opciones de filtrado
      const uniqueOptions = [];
      formattedResponse.forEach((item) => {
        uniqueOptions.push({ propertyKey: "Solicitud_ID", value: item.Solicitud_ID.toString() });
        uniqueOptions.push({ propertyKey: "Titulo", value: item.Titulo });
        uniqueOptions.push({ propertyKey: "Tipo", value: item.Tipo });
        uniqueOptions.push({ propertyKey: "Facultad", value: item.Facultad });
        uniqueOptions.push({ propertyKey: "Grado", value: item.Grado });
        uniqueOptions.push({ propertyKey: "Estado", value: item.Estado || "Enviado" });
      });
      setFilteringOptions([...new Set(uniqueOptions.map(JSON.stringify))].map(JSON.parse));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Llamar a `fetchData` cuando cambie la pestaña activa
  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  // Filtrar los datos según la consulta
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

  // Función para abrir el modal de confirmación
  const showDeleteModal = () => {
    if (selectedItems.length > 0) {
      setDeletingId(selectedItems[0]?.id); // Toma el ID interno para eliminar
      setModalVisible(true);
    } else {
      console.warn("No hay un registro seleccionado para eliminar");
    }
  };

  // Función para eliminar el registro
  const handleDelete = async () => {
    try {
      if (deletingId) {
        console.log("Eliminando registro con ID:", deletingId);
        await uoariService.Delete_Uoari_Datos(deletingId); // Llamada al servicio
        setItems((prev) => prev.filter((item) => item.id !== deletingId)); // Actualizar la tabla
        setFilteredItems((prev) => prev.filter((item) => item.id !== deletingId));
        setDeletingId(null);
        setModalVisible(false);
        console.log("Registro eliminado con éxito");
      }
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
    }
  };
  

  // Función para renderizar la tabla
  const renderTable = () => (
    <Table
      renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
        `Mostrando elementos ${firstIndex} a ${lastIndex} de ${totalItemsCount}`
      }
      onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
      selectedItems={selectedItems}
      ariaLabels={{
        selectionGroupLabel: "Selección de elementos",
        allItemsSelectionLabel: () => "Seleccionar todo",
        itemSelectionLabel: ({ selectedItems }, item) => `Seleccionar ${item.visibleId}`,
      }}
      columnDefinitions={[
        { id: "Solicitud_ID", header: "SolicitudID", cell: (e) => e.visibleId, sortingField: "Solicitud_ID" },
        { id: "titulo", header: "Título", cell: (e) => e.Titulo, sortingField: "Titulo" },
        { id: "tipo", header: "Tipo", cell: (e) => e.Tipo, sortingField: "Tipo" },
        { id: "facultad", header: "Facultad", cell: (e) => e.Facultad, sortingField: "Facultad" },
        { id: "grado", header: "Grado", cell: (e) => e.Grado, sortingField: "Grado" },
        {
          id: "estado",
          header: "Estado",
          cell: (e) => {
            switch (e.Estado) {
              case "1":
              case 1:
                return <Badge color="green">Abierto</Badge>;
              case "2":
              case 2:
                return <Badge color="red">Cerrado</Badge>;
              case "3":
              case 3:
                return <Badge color="grey">Embargado</Badge>;
              default:
                return <Badge color="blue">Enviado</Badge>;
            }
          },
        },
      ]}
      enableKeyboardNavigation
      items={filteredItems}
      loading={loading}
      loadingText="Cargando datos"
      selectionType="single"
      trackBy="visibleId"
      empty={
        <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
          <SpaceBetween size="m">
            <b>Sin registros</b>
          </SpaceBetween>
        </Box>
      }
      filter={
        <PropertyFilter
          query={query}
          onChange={({ detail }) => setQuery(detail)}
          countText={`${filteredItems.length} coincidencias`}
          filteringOptions={filteringOptions}
          filteringPlaceholder="Buscar solicitudes"
          filteringProperties={[
            { key: "Solicitud_ID", propertyLabel: "SolicitudID", operators: ["=", "!="] },
            { key: "Titulo", propertyLabel: "Título", operators: ["=", "!=", ":", "!:", "^", "!^"] },
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
              {activeTab === "general" ? (
                <Button onClick={NextStep} variant="primary">
                  Subir Datos
                </Button>
              ) : (
                <>
                  <Button onClick={() => console.log("Editar acción")} variant="normal">
                    Editar
                  </Button>
                  <Button onClick={showDeleteModal} variant="primary">
                    Eliminar
                  </Button>
                </>
              )}
            </SpaceBetween>
          }
        >
          Listado de Solicitudes
        </Header>
      }
      pagination={<Pagination currentPageIndex={1} pagesCount={1} />}
    />
  );

  return (
    <div className="tabs-container">
      <Tabs
        activeTabId={activeTab}
        onChange={({ detail }) => setActiveTab(detail.activeTabId)}
        tabs={[
          { label: "General", id: "general", content: renderTable() },
          { label: "Acceso Abierto", id: "abierto", content: renderTable() },
          { label: "Acceso Cerrado", id: "cerrado", content: renderTable() },
          { label: "Acceso Embargado", id: "embargo", content: renderTable() },
        ]}
      />
      {/* Modal de confirmación */}
      <Modal
        onDismiss={() => setModalVisible(false)}
        visible={modalVisible}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setModalVisible(false)} variant="link">
                Cancelar
              </Button>
              <Button onClick={handleDelete} variant="primary">
                Eliminar
              </Button>
            </SpaceBetween>
          </Box>
        }
        header="Confirmar eliminación"
      >
        ¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.
      </Modal>
    </div>
  );
};

export default MyReports;
