import React, { useContext, useState } from 'react';
import Layout from './components/Layout';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../../../api';
import UserContext from './contexts/UserContext';

// Importar los componentes de las vistas específicas
import ManageUsers from './views/admin/ManageUsers';
import CreateRequest from './views/student/CreateRequest';
import MyRequests from './views/student/MyRequests';
import Reports from './views/escuela_upg/Reports';
import Requests from './views/recepDocs/Requests';
import ExpedientReports from './views/recepDocs/ExpedientReports';
import RegisterCyberthesis from './views/uoari/RegisterCyberthesis';
import MyReports from './views/uoari/MyReports';

const Profile = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [activeView, setActiveView] = useState(null);

  const handleLogoutSuccess = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const onLogoutClick = async () => {
    await handleLogout(handleLogoutSuccess);
  };

  const handleNavigation = (href) => {
    setActiveView(href);  // Actualizar la vista activa basada en href
  };

  // Función para generar los elementos de navegación basados en el tipo de usuario
  const getNavigationItems = () => {
    switch (user.current_team_id) {
      case 1: // Admin
        return [
          { type: "link", text: 'Gestión de Usuarios', href: '#manage-users' }
        ];
      case 2: // Estudiante
        return [
          { type: "link", text: 'Realizar Solicitud', href: '/create-request' },
          { type: "link", text: 'Mis Solicitudes', href: '/my-requests' }
        ];
      case 3: // Escuela UPG
        return [
          { type: "link", text: 'Reportes', href: '/reports' }
        ];
      case 4: // RecepDocs
        return [
          { type: "link", text: 'Solicitudes', href: '/requests' },
          { type: "link", text: 'Reporte de Expedientes', href: '/expedient-reports' }
        ];
      case 5: // UOARI
        return [
          { type: "link", text: 'Registrar CYBERTESIS', href: '/register-cyberthesis' },
          { type: "link", text: 'Mis Reportes', href: '/my-reports' }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const breadcrumbs =[
    { text: 'Home', href: '#' },
    { text: 'Service', href: '#' },
  ]

  const renderView = () => {
    // Verifica que el usuario y su rol estén definidos antes de intentar renderizar una vista específica
    if (!user) return <p>No estás logueado</p>;
  
    switch(activeView) {
      case '#manage-users':
        if (user.current_team_id === 1) {
          return <ManageUsers />;
        }
        break;
      case '/create-request':
        if (user.current_team_id === 2) {
          return <CreateRequest />;
        }
        break;
      case '/my-requests':
        if (user.current_team_id === 2) {
          return <MyRequests />;
        }
        break;
      case '/reports':
        if (user.current_team_id === 3) {
          return <Reports />;
        }
        break;
      case '/requests':
        if (user.current_team_id === 4) {
          return <Requests />;
        }
        break;
      case '/expedient-reports':
        if (user.current_team_id === 4) {
          return <ExpedientReports />;
        }
        break;
      case '/register-cyberthesis':
        if (user.current_team_id === 5) {
          return <RegisterCyberthesis />;
        }
        break;
      case '/my-reports':
        if (user.current_team_id === 5) {
          return <MyReports />;
        }
        break;
      default:
        // El caso default incluirá cualquier contenido general que siempre es accesible, como el perfil del usuario
        return (
          <div>
            <h1>Perfil de usuario</h1>
            <p>Nombre: {user.nombre_usuario}</p>
            <p>Correo electrónico: {user.email}</p>
            <a href='#manage-users'>Hola</a>
            <button onClick={onLogoutClick}>Cerrar sesión</button>
          </div>
        );
    }
  
    // Si intentan acceder a una vista para la cual no tienen permisos
    return <p>No tienes permiso para acceder a esta página.</p>;
  };
  

  return (
    <Layout breadcrumbs={breadcrumbs} navigationItems={navigationItems} onNavigation={handleNavigation}>
      {renderView()}
    </Layout>
  );
};

export default Profile;
