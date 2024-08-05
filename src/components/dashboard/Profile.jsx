import React, { useContext, useState } from 'react';
import Layout from './components/Layout';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../../../api';
import UserContext from './contexts/UserContext';
import {Icon} from '@cloudscape-design/components';

// Importar los componentes de las vistas específicas
import ManageUsers from './views/admin/ManageUsers';
import CreateRequest from './views/student/CreateRequest';
import MyRequests from './views/student/MyRequests';
import Reports from './views/escuela_upg/Reports';
import Requests from './views/recepDocs/Requests';
import ExpedientReports from './views/recepDocs/ExpedientReports';
import RegisterCyberthesis from './views/uoari/RegisterCyberthesis';
import MyReports from './views/uoari/MyReports';
import Inicio from './views/Inicio';
import Notif from './views/Notif';
import Alumnos from './views/escuela_upg/Alumnos';
import IngresarDoc from './views/escuela_upg/IngresarDoc';

const Profile = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [activeView, setActiveView] = useState(null);

  const getContentHeader = () => {
    switch(activeView) {
      case 'manage-users': return 'Gestión de Usuarios';
      case 'create-request': return 'Crear Solicitud';
      case 'my-requests': return 'Mis Solicitudes';
      case 'reports': return 'Reportes';
      case 'requests': return 'Solicitudes';
      case 'expedient-reports': return 'Reporte de Expedientes';
      case 'register-cyberthesis': return 'Registrar CYBERTESIS';
      case 'my-reports': return 'Mis Reportes';
      case 'notifications': return 'Notificaciones';
      case 'ingreso-docs': return 'Ingresar Documentos';
      case 'alumnos': return 'Estudiantes';
      default: return 'Perfil de Usuario';
    }
  };

  console.log(user);

  const contentHeader = getContentHeader();

  const handleLogoutSuccess = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const onLogoutClick = async () => {
    await handleLogout(handleLogoutSuccess);
  };

  const handleNavigation = (href) => {
    setActiveView(href);
  };

  // Función para generar los elementos de navegación basados en el tipo de usuario
  const getNavigationItems = () => {
    switch (user.current_team_id) {
      case 1: // Admin
        return [
          { type: "link", text: <a onClick={() => setActiveView('manage-users')}>Gestión de Usuarios</a>, href: '#manage-users' }
        ];
      case 2: // Estudiante
        return [
          { type: "link", text: <a onClick={() => setActiveView('create-request')}>Realizar Solicitud</a>, href: '#create-request' },
          { type: "link", text: <a onClick={() => setActiveView('my-requests')}>Mis Solicitudes</a>, href: '#my-requests' }
        ];
      case 3: // Escuela UPG
        return [
          { type: "link", text: <a onClick={() => setActiveView('alumnos')}> <Icon name="group-active" /> Estudiantes</a>, href: '#students' },
          { type: "link", text: <a onClick={() => setActiveView('ingreso-docs')}>  <Icon name="folder-open" /> Ingresar Documentos</a>, href: '#docs' },
          { type: "link", text: <a onClick={() => setActiveView('reports')}> <Icon name="file-open" /> Reportes</a>, href: '#reports' }
        ];
      case 4: // RecepDocs
        return [
          { type: "link", text: <a onClick={() => setActiveView('requests')}>Solicitudes</a>, href: '#requests' },
          { type: "link", text: <a onClick={() => setActiveView('expedient-reports')}>Reporte de Expedientes</a>, href: '#expedient-reports' }
        ];
      case 5: // UOARI
        return [
          { type: "link", text: <a onClick={() => setActiveView('register-cyberthesis')}>Registrar CYBERTESIS</a>, href: '#register-cyberthesis' },
          { type: "link", text: <a onClick={() => setActiveView('my-reports')}>Mis Reportes</a>, href: '#my-reports' }
        ];
      default:
        return [];
    }
  };


  const navigationItems = getNavigationItems();

  const breadcrumbs = [
    { text:<a onClick={() => setActiveView('inicio')}>Inicio</a>, href: '#' },
    { text: contentHeader , href: '#' },
  ]



  const renderView = () => {
    // Verifica que el usuario y su rol estén definidos antes de intentar renderizar una vista específica
    if (!user) return <p>No estás logueado</p>;

    switch (activeView) {
      case 'manage-users':
        if (user.current_team_id === 1) {
          return <ManageUsers />;
        }
        break;
      case 'create-request':
        if (user.current_team_id === 2) {
          return <CreateRequest />;
        }
        break;
      case 'my-requests':
        if (user.current_team_id === 2) {
          return <MyRequests />;
        }
        break;
      case 'reports':
        if (user.current_team_id === 3) {
          return <Reports />;
        }
        break;
      case 'alumnos':
        if (user.current_team_id === 3) {
          return <Alumnos />;
        }
        break;
      case 'ingreso-docs':
        if (user.current_team_id === 3) {
          return <IngresarDoc />;
        }
        break;
      case 'requests':
        if (user.current_team_id === 4) {
          return <Requests />;
        }
        break;
      case 'expedient-reports':
        if (user.current_team_id === 4) {
          return <ExpedientReports />;
        }
        break;
      case 'register-cyberthesis':
        if (user.current_team_id === 5) {
          return <RegisterCyberthesis />;
        }
        break;
      case 'my-reports':
        if (user.current_team_id === 5) {
          return <MyReports />;
        }
        break;
      case 'inicio':
        return <Inicio/>;
      case 'notifications':
          return <Notif/>;
      default:
        // El caso default incluirá cualquier contenido general que siempre es accesible, como el perfil del usuario
        return <Inicio/>;
    }

    // Si intentan acceder a una vista para la cual no tienen permisos
    return <p>No tienes permiso para acceder a esta página.</p>;
  };


  return (
    <Layout breadcrumbs={breadcrumbs} navigationItems={navigationItems} onNavigation={handleNavigation} onLogoutClick={onLogoutClick} contentHeader={contentHeader}>
      {renderView()}
    </Layout>
  );
};

export default Profile;
