import React, { useState } from 'react';
import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Input from "@cloudscape-design/components/input";
import Checkbox from "@cloudscape-design/components/checkbox";
import { handleSubmit } from '../../../api';
import { useUser } from '../../hooks/useUser';
import Alert from "@cloudscape-design/components/alert"; // Importa el componente Alert para mostrar mensajes de advertencia
import Spinner from "@cloudscape-design/components/spinner"; // Importa el componente Spinner para indicar carga

const StudentForm = ({ handleBack }) => {
  // States
  const [form, setForm] = useState({
    role: { label: 'Estudiante', value: 2 },
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState(null); // Estado para manejar el mensaje de error
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
  const { setUser } = useUser();

  // Functions
  const handleLoginSuccess = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    window.location.href = '/profile';
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Indica que la carga está en curso
    try {
      await handleSubmit(form, handleLoginSuccess);
    } catch (error) {
      setError('Error al iniciar sesión: credenciales incorrectas.'); // Establece el mensaje de error
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
        <Container>
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
              header={<Header variant="h2">Ingrese sus credenciales</Header>}
            >
              <SpaceBetween direction="vertical" size="l">
              {error && <Alert type="error" onDismiss={() => setError(null)}>{error}</Alert>}
                <Input
                  controlId='email'
                  type="email"
                  onChange={({ detail }) => setForm((prev) => ({ ...prev, email: detail.value }))}
                  value={form.email}
                  placeholder="Correo electrónico"
                  required
                />
                <Input
                  controlId='password'
                  type="password"
                  onChange={({ detail }) => setForm((prev) => ({ ...prev, password: detail.value }))}
                  value={form.password}
                  placeholder="Contraseña"
                  required
                />
                <Checkbox
                  controlId='rememberMe'
                  onChange={({ detail }) => setForm((prev) => ({ ...prev, rememberMe: detail.checked }))}
                  checked={form.rememberMe}
                >
                  Recuerdame
                </Checkbox>
              </SpaceBetween>
            </Form>
          </form>
        </Container>
      </div>
    </div>
  );
}

export default StudentForm;
