// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/cards/Home';
import { UserProvider } from './components/dashboard/contexts/UserContext.jsx';
import AppRoutes from './components/dashboard/AppRoutes';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verificar si hay un token en el almacenamiento local para determinar si el usuario está logueado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Limpiar el token del almacenamiento local y otros datos
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
  };

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/profile" />
              ) : (
                <Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              )
            }
          />
          <Route
            path="/*"
            element={
              isLoggedIn ? (
                <AppRoutes onLogoutClick={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
