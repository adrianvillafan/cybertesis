// src/components/cards/AdminForm.jsx

import React, { useState } from 'react';
import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Input from "@cloudscape-design/components/input";
import Checkbox from "@cloudscape-design/components/checkbox";
import Select from "@cloudscape-design/components/select";
import FormField from "@cloudscape-design/components/form-field";
import Box from '@cloudscape-design/components/box';

import { useUser } from '../../hooks/useUser';
import Alert from "@cloudscape-design/components/alert"; // Importa el componente Alert para mostrar mensajes de advertencia
import Spinner from "@cloudscape-design/components/spinner"; // Importa el componente Spinner para indicar carga
import authService from '../../services/authService'; // Importamos el servicio de autenticación

const AdminForm = ({ handleBack }) => {
  const [form, setForm] = useState({ role: { label: 'Administrador', value: 1 }, email: '', password: '', rememberMe: false });
  const [error, setError] = useState(null); // Estado para manejar el mensaje de error
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
  const { setUser } = useUser();

  // Función para manejar el cambio de rol seleccionado
  const handleRoleChange = (selectedOption) => {
    setForm(prev => ({ ...prev, role: selectedOption }));
  };

  // Función para manejar cambios en el formulario
  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // Función para manejar el submit del formulario
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Indica que la carga está en curso
    setError(null); // Limpia cualquier error previo

    try {
      // Completar el correo electrónico con el dominio "@unmsm.edu.pe"
      const emailWithDomain = form.email.includes('@unmsm.edu.pe') ? form.email : `${form.email}@unmsm.edu.pe`;
      const credentials = {
        email: emailWithDomain,
        password: form.password,
        role: form.role, // Enviando el objeto `role` completo como en el ejemplo proporcionado
      };

      // Llamada al servicio de autenticación
      const data = await authService.login(credentials);

      if (data) {
        setUser(data.userData);
        window.location.href = '/profile'; // Redirige a la página de perfil tras el login exitoso
      }
    } catch (error) {
      setError('Error: Credenciales incorrectas o problemas en la conexión.'); // Establece el mensaje de error
      console.error('Error al iniciar sesión:', error);
    } finally {
      setIsLoading(false); // Indica que la carga ha terminado
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '400px', padding: '20px', borderRadius: '5px', position: 'relative' }}>
        <div style={{ marginBottom: '10px' }}>
          <Button onClick={handleBack} variant="primary">Atrás</Button>
        </div>

        <Container header={<Header variant="h2">Ingrese sus credenciales</Header>}>
          <form onSubmit={handleFormSubmit}>
            <Form
              variant="embedded"
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  {isLoading ? (
                    <Spinner /> // Muestra el spinner si isLoading es true
                  ) : (
                    <Button type="submit" variant="primary" disabled={isLoading}>Ingresar</Button>
                  )}
                </SpaceBetween>
              }
            >
              <SpaceBetween direction="vertical" size="l">
                {error && <Alert type="error" onDismiss={() => setError(null)}>{error}</Alert>}
                <Select
                  placeholder="Selecciona un rol"
                  selectedOption={form.role}
                  onChange={({ detail }) => handleRoleChange(detail.selectedOption)}
                  options={[
                    { label: "UOARI", value: 5 },
                    { label: "Recepción Documentos", value: 4 },
                    { label: "Escuela-UPG", value: 3 },
                    { label: "Administrador", value: 1 }
                  ]}
                  required
                />
                <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                  <FormField>
                    <Input
                      controlId='email'
                      type="text"
                      onChange={({ detail }) => handleChange('email', detail.value)}
                      value={form.email}
                      placeholder="Correo electrónico"
                      required
                    />
                  </FormField>
                  <FormField>
                    <Box color="text-body-secondary" display='inline'>@unmsm.edu.pe</Box>
                  </FormField>
                </SpaceBetween>
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
            </Form>
          </form>
        </Container>
      </div>
    </div>
  );
}

export default AdminForm;
