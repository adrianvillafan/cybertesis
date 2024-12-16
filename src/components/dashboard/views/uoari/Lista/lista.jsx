import * as React from "react";
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import TextFilter from "@cloudscape-design/components/text-filter";
import Header from "@cloudscape-design/components/header";
import ButtonDropdown from "@cloudscape-design/components/button-dropdown";
import Pagination from "@cloudscape-design/components/pagination";
import uoariService from "../../../../../services/uoariService";



export default function TableWithActions() {
  const [selectedItems, setSelectedItems] = React.useState([]);
  
  // Lista de elementos
  const items = [
    { name: "Item 1", alt: "First", description: "This is the first item", type: "1A" },
    { name: "Item 2", alt: "Second", description: "This is the second item", type: "1B" },
    { name: "Item 3", alt: "Third", description: "-", type: "1A" },
    { name: "Item 4", alt: "Fourth", description: "This is the fourth item", type: "2A" },
    { name: "Item 5", alt: "-", description: "This is the fifth item", type: "2A" },
    { name: "Item 6", alt: "Sixth", description: "This is the sixth item", type: "1A" },
  ];

  //console.log(uoariService.Datos_Tabla_Principal())

  return (
    <Table
      renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
        `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
      }
      onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
      selectedItems={selectedItems}
      ariaLabels={{
        selectionGroupLabel: "Items selection",
        allItemsSelectionLabel: () => "select all",
        itemSelectionLabel: ({ selectedItems }, item) => item.name,
      }}
      columnDefinitions={[
        { id: "variable", header: "Variable name", cell: (e) => e.name, sortingField: "name", isRowHeader: true },
        { id: "value", header: "Text value", cell: (e) => e.alt, sortingField: "alt" },
        { id: "type", header: "Type", cell: (e) => e.type },
        { id: "description", header: "Description", cell: (e) => e.description },
      ]}
      enableKeyboardNavigation
      items={items} // Aquí asignamos los elementos
      loadingText="Loading resources"
      selectionType="single" // Permite selección simple
      trackBy="name"
      empty={
        <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
          <SpaceBetween size="m">
            <b>No resources</b>
            <Button>Create resource</Button>
          </SpaceBetween>
        </Box>
      }
      filter={
        <TextFilter filteringPlaceholder="Find resources" filteringText="" />
      }
      header={
        <Header
          counter={`(${items.length})`} // Contador dinámico
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <ButtonDropdown
                items={[
                  { text: "Deactivate", id: "deactivate" },
                  { text: "Activate", id: "activate" },
                  { text: "View details", id: "view-details" },
                  { text: "Edit", id: "edit" },
                  { text: "Delete", id: "delete" },
                ]}
              >
                Actions
              </ButtonDropdown>
              <Button>Secondary button</Button>
              <Button variant="primary">Create resource</Button>
            </SpaceBetween>
          }
        >
          Table with action buttons
        </Header>
      }
      pagination={
        <Pagination currentPageIndex={1} pagesCount={1} />
      }
    />
  );
}
