// src/components/dashboard/AppRoutes.jsx

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from './contexts/UserContext';
import Layout from './components/Layout';
import { navigationItems, contentHeader } from './Navigation.jsx'; // Importamos `contentHeader`

// Lazy loading de componentes para mejorar la carga inicial
const ManageUsers = lazy(() => import('./views/admin/ManageUsers'));
const MyRequests = lazy(() => import('./views/student/MyRequests'));
const Reports = lazy(() => import('./views/escuela_upg/Reports'));
const Solicitudes = lazy(() => import('./views/escuela_upg/Solicitudes'));
const IngresarDoc = lazy(() => import('./views/escuela_upg/IngresarDoc'));
const Expedientes = lazy(() => import('./views/recepDocs/Expedientes'));
const ExpedientReports = lazy(() => import('./views/recepDocs/ExpedientReports'));
const ResultReports = lazy(() => import('./views/recepDocs/ResultReports'));
const RegisterCyberthesis = lazy(() => import('./views/uoari/RegisterCyberthesis'));
const MyReports = lazy(() => import('./views/uoari/MyReports'));
const Inicio = lazy(() => import('./views/Inicio'));
const Notif = lazy(() => import('./views/Notif'));
const Profile = lazy(() => import('./Profile'));

const AppRoutes = ({ onLogoutClick }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/" />;
  }

  const getUserRoutes = () => {
    switch (user.current_team_id) {
      case 1: // Admin
        return <Route path="/manage-users" element={<ManageUsers />} />;
      case 2: // Estudiante
        return <Route path="/my-requests" element={<MyRequests />} />;
      case 3: // Escuela UPG
        return (
          <>
            <Route path="/ingreso-docs" element={<IngresarDoc />} />
            <Route path="/solicitudes" element={<Solicitudes />} />
            <Route path="/reports" element={<Reports />} />
          </>
        );
      case 4: // RecepDocs
        return (
          <>
            <Route path="/expedientes" element={<Expedientes />} />
            <Route path="/expedient-reports" element={<ExpedientReports />} />
            <Route path="/result-reports" element={<ResultReports />} />
          </>
        );
      case 5: // UOARI
        return (
          <>
            <Route path="/register-cyberthesis" element={<RegisterCyberthesis />} />
            <Route path="/my-reports" element={<MyReports />} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Layout
      navigationItems={navigationItems(user, () => {})} // Uso correcto de navigationItems
      contentHeader={contentHeader(user.current_team_id)} // Uso de contentHeader basado en el ID del equipo
      onNavigation={(view) => console.log('Navigate:', view)}
      onLogoutClick={onLogoutClick}
    >
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/notifications" element={<Notif />} />
          <Route path="/profile" element={<Profile />} />
          {getUserRoutes()}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default AppRoutes;
