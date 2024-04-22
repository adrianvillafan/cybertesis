import React from 'react';
import Layout from './components/Layout';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../../../api';


const Profile = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogoutSuccess = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const onLogoutClick = async () => {
    await handleLogout(handleLogoutSuccess);
  };

  const navigationItems = [
    { type: "link",text: 'Perfil', href: '/profile' },
    { type: "link",text: 'Configuración', href: '/settings' },
    { type: "link",text: 'Historial', href: '/history' }
  ];

  return (
    <Layout navigationItems={navigationItems} > {/* Aquí estás utilizando el componente de layout */}
      <div>
        <h1>Perfil de usuario</h1>
        <p>Nombre: John Doe</p>
        <p>Correo electrónico: johndoe@example.com</p>
        {/* Otros detalles del perfil */}
        <button onClick={onLogoutClick}>Cerrar sesión</button>
      </div>
    </Layout>
  );
};

export default Profile;
