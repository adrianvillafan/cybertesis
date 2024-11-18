//src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/cards/Home';
import { UserProvider } from './components/dashboard/contexts/UserContext.jsx';
import AppRoutes from './components/dashboard/AppRoutes';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

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
                <AppRoutes onLogoutClick={() => setIsLoggedIn(false)} />
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
