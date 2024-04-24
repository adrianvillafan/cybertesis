// src/contexts/UserContext.js
import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simular la recuperación del usuario desde localStorage o llamada al API
    const userInfo = localStorage.getItem('userData');
    if (userInfo) {
      console.log(JSON.parse(userInfo));
      setUser(JSON.parse(userInfo));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
