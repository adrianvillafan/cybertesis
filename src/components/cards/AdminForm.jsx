import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Input from "@cloudscape-design/components/input";
import Checkbox from "@cloudscape-design/components/checkbox";
import Select from "@cloudscape-design/components/select";
import { handleSubmit } from '../../../api';

const AdminForm = ({ handleBack }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ role: null, email: '', password: '', rememberMe: false });

  const handleRoleChange = (selectedOption) => {
    setForm(prev => ({ ...prev, role: selectedOption }));
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSubmit( form, handleLoginSuccess);
      console.log('Inicio de sesión exitoso');
      navigate('/profile');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const handleLoginSuccess = (token) => {
    // Redirigir al usuario a la página de perfil
    localStorage.setItem('token', token);
    window.location.href = '/profile';
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '400px', padding: '20px', borderRadius: '5px', position: 'relative' }}>
        <div style={{ marginBottom: '10px' }}>
          <Button onClick={handleBack} variant="primary">Atrás</Button>
        </div>

        <Container
          header={<Header variant="h2">Ingrese sus credenciales</Header>}
        >
          <form onSubmit={(e) => e.preventDefault()}><Form
            variant="embedded"
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={handleFormSubmit} variant="primary">Ingresar</Button>
              </SpaceBetween>
            }
          >
            <SpaceBetween direction="vertical" size="l">
              <Select
                placeholder="Personal administrativo"
                selectedOption={form.role}
                onChange={({ detail }) => handleRoleChange(detail.selectedOption)}
                options={[
                  { label: "UOARI", value: 5 },
                  { label: "Recepción Documentos", value: 4 },
                  { label: "Escuela-UPG", value: 3 },
                  { label: "Administrador", value: 1 }
                ]}
              />
              <Input
                controlId='email'
                type="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={({ detail }) => handleChange('email', detail.value)}
                required
              />
              <Input
                controlId='password'
                type="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={({ detail }) => handleChange('password', detail.value)}
                required
              />
              <Checkbox
                checked={form.rememberMe}
                onChange={({ detail }) => handleChange('rememberMe', detail.checked)}
              >
                Recuérdame
              </Checkbox>
            </SpaceBetween>
          </Form></form>
        </Container>
      </div>
    </div>
  );
}

export default AdminForm;
