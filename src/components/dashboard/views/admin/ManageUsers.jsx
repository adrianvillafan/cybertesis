import React, { useState } from 'react';
import {
  Table,
  Button,
  Container,
  Header,
  SpaceBetween,
  Modal,
  FormField,
  Input,
  Box
} from '@cloudscape-design/components';

const initialUsers = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "User" },
];

const ManageUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: '', email: '', role: '' });

  const handleAddUser = () => {
    setIsModalVisible(true);
    setCurrentUser({ name: '', email: '', role: '', id: null }); // Para agregar un nuevo usuario
  };

  const handleEditUser = (user) => {
    setIsModalVisible(true);
    setCurrentUser({ ...user }); // Editar usuario existente
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleSaveUser = () => {
    if (currentUser.id) {
      setUsers(users.map(user => user.id === currentUser.id ? currentUser : user));
    } else {
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      setUsers([...users, { ...currentUser, id: newId }]);
    }
    setIsModalVisible(false);
  };

  const handleChange = (field, value) => {
    setCurrentUser({ ...currentUser, [field]: value });
  };

  return (
    <Container>
      <SpaceBetween size="l"><SpaceBetween size="l">
        <Header variant="h1">Gestión de Usuarios</Header>
        <Button onClick={handleAddUser}>Agregar Usuario</Button>
      </SpaceBetween>
        <Table
          items={users}
          columnDefinitions={[
            { header: 'Nombre', cell: item => item.name },
            { header: 'Correo Electrónico', cell: item => item.email },
            { header: 'Rol', cell: item => item.role },
            {
              header: 'Acciones', cell: item => (
                <SpaceBetween direction="horizontal" size="xs">
                  <Button onClick={() => handleEditUser(item)}>Editar</Button>
                  <Button onClick={() => handleDeleteUser(item.id)}>Eliminar</Button>
                </SpaceBetween>
              )
            }
          ]}
        />
        {isModalVisible && (
          <Modal
            visible={isModalVisible}
            onDismiss={() => setIsModalVisible(false)}
            header="Datos de Usuario"
            footer={
              <Box float="right">
                <SpaceBetween direction="horizontal" size="xs">
                  <Button onClick={() => setIsModalVisible(false)}>Cancelar</Button>
                  <Button variant="primary" onClick={handleSaveUser}>Guardar</Button>
                </SpaceBetween>
              </Box>
            }
          >
            <SpaceBetween size='xs'><FormField label="Nombre">
              <Input value={currentUser.name} onChange={e => handleChange('name', e.detail.value)} />
            </FormField>
              <FormField label="Correo Electrónico">
                <Input value={currentUser.email} onChange={e => handleChange('email', e.detail.value)} />
              </FormField>
              <FormField label="Rol">
                <Input value={currentUser.role} onChange={e => handleChange('role', e.detail.value)} />
              </FormField></SpaceBetween>
          </Modal>
        )}</SpaceBetween>

    </Container>
  );
};

export default ManageUsers;
