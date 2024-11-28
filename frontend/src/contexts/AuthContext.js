import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recoveredUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (recoveredUser && token) {
      setUser(JSON.parse(recoveredUser));
      api.defaults.headers.Authorization = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  async function signIn(email, password) {
    try {
      const response = await api.post('/login', { email, password });

      const { user, authorization } = response.data;
      const token = authorization.token;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  }

  function signOut() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    api.defaults.headers.Authorization = null;
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      signed: !!user,
      user,
      signIn,
      signOut,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}