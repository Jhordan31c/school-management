import React, { createContext, useState, useContext, useEffect } from 'react';
import loginServicio from '@/services/loginServicio';

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const updateUser = async (user_id, role) => {
    try {
      const response = await loginServicio.getData(user_id, role);
      let userData = response.data;

      if (role === 'ROLE_ALUMNO') {
        try {
          const extraDataResponse = await loginServicio.getAlumnoExtraData(user_id);
          const extraData = extraDataResponse.data;
          userData = {
            ...userData,
            ...extraData,
          };
        } catch (error) {
          if (error.response && error.response.status === 404) {
            throw new Error('El usuario no está matriculado, comuníquese con el director');
          } else {
            throw error;
          }
        }
      }

      const updatedUser = {
        ...userData,
        roles: [role],
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  const handleSetUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser: handleSetUser, updateUser, logout: handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
