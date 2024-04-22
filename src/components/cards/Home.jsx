import React, { useState } from 'react';
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import StudentForm from './StudentForm';
import AdminForm from './AdminForm';

const Home = ({ handleLoginSuccess }) => {
  // State para controlar qué vista se muestra
  const [view, setView] = useState(null);

  // Funciones para manejar los clicks que cambian la vista
  const handleStudentForm = () => {
    setView('student');
  };

  const handleAdminForm = () => {
    setView('admin');
  };

  const handleBack = () => {
    setView(null);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {view === 'student' && <StudentForm handleBack={handleBack} handleLoginSuccess={handleLoginSuccess} />}
      {view === 'admin' && <AdminForm handleBack={handleBack} handleLoginSuccess={handleLoginSuccess} />}
      {view === null && (
        <Container header={<Header variant="h2">Seleccione su rol</Header>}>
          <SpaceBetween direction="vertical" size="l">
            <Button onClick={handleStudentForm} variant="primary">Estudiante</Button>
            <Button onClick={handleAdminForm} variant="primary">Personal Administrativo</Button>
          </SpaceBetween>
        </Container>
      )}
    </div>
  );
}

export default Home;
