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

import { handleSubmit } from '../../../api';
import { useUser } from '../../hooks/useUser';
import Alert from "@cloudscape-design/components/alert"; // Importa el componente Alert para mostrar mensajes de advertencia
import Spinner from "@cloudscape-design/components/spinner"; // Importa el componente Spinner para indicar carga

const AdminForm = ({ handleBack }) => {
  const [form, setForm] = useState({ role: null, email: '', password: '', rememberMe: false });
  const [error, setError] = useState(null); // Estado para manejar el mensaje de error
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
  const { setUser } = useUser();

  const handleRoleChange = (selectedOption) => {
    setForm(prev => ({ ...prev, role: selectedOption }));
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Indica que la carga está en curso
    try {
      console.log("handleFormSubmit called", form); // Confirma que se llama a esta función
      form.email = form.email + '@unmsm.edu.pe'; // Agrega el dominio al correo
      await handleSubmit(form, handleLoginSuccess);
    } catch (error) {
      setError('Error: Credenciales incorrectas.'); // Establece el mensaje de error
      console.error('Error al iniciar sesión:', error);
    } finally {
      setIsLoading(false); // Indica que la carga ha terminado
    }
  };

  const handleLoginSuccess = (token, userData) => {
    console.log("handleLoginSuccess called", { token, userData }); // Confirma que se llama a esta función
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    window.location.href = '/profile';
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '400px', padding: '20px', borderRadius: '5px', position: 'relative' }}>
        <div style={{ marginBottom: '10px' }}>
          <Button onClick={handleBack} variant="primary">Atrás</Button>
        </div>

        <Container header={<Header variant="h2">Ingrese sus credenciales</Header>}>

          <form onSubmit={(e) => e.preventDefault()}>
            <Form
              variant="embedded"
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  {isLoading ? (
                    <Spinner /> // Muestra el spinner si isLoading es true
                  ) : (
                    <Button onClick={handleFormSubmit} variant="primary">Ingresar</Button>
                  )}
                </SpaceBetween>
              }
            >
              <SpaceBetween direction="vertical" size="l">
                {error && <Alert type="error" onDismiss={() => setError(null)}>{error}</Alert>}
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
                <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                  <FormField>
                    <Input
                      controlId='email'
                      type="email"
                      onChange={({ detail }) => setForm((prev) => ({ ...prev, email: detail.value }))}
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
