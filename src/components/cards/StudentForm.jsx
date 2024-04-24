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


const StudentForm = ({ handleBack }) => {

  //States
  const [form, setForm] = useState({
    role:
      { label: 'Estudiante', value: 2 }, email: null, password: null, rememberMe: false
  });
  const { setUser } = useUser();

  //Functions
  const handleLoginSuccess = (token, userData) => {
    console.log("handleLoginSuccess called", { token, userData }); // Confirma que se llama a esta función
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    window.location.href = '/profile';
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSubmit(form, handleLoginSuccess);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };



  return (

    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '400px', padding: '20px', borderRadius: '5px', position: 'relative' }}>
        <div style={{ marginBottom: '10px' }}>
          <Button onClick={handleBack} variant="primary">Atrás</Button>
        </div>

        <Container>

          <form onSubmit={(e) => e.preventDefault()}><Form
            variant="embedded"
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={handleFormSubmit} variant="primary">Ingresar</Button>
              </SpaceBetween>
            }
            header={<Header variant="h2">Ingrese sus credenciales</Header>}
          >

            <SpaceBetween direction="vertical" size="l">
              <Input
                controlId='email'
                type="email"
                onChange={({ detail }) => setForm((prev) => ({ ...prev, email: detail.value }))}
                value={form.email}
                placeholder="Correo electrónico"
              />
              <Input
                controlId='password'
                type="password"
                onChange={({ detail }) => setForm((prev) => ({ ...prev, password: detail.value }))}
                value={form.password}
                placeholder="Contraseña"
              />
              <Checkbox
                controlId='rememberMe'
                onChange={({ detail }) => setForm((prev) => ({ ...prev, rememberMe: detail.checked }))}
                checked={form.rememberMe}
              >
                Recuerdame
              </Checkbox>
            </SpaceBetween>

          </Form></form>


        </Container>
      </div>
    </div>
  );
}

export default StudentForm;
