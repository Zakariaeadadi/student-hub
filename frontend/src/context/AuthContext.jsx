import { createContext, useState, useContext } from 'react';
import { login as loginApi, register as registerApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = async (credentials) => {
    const response = await loginApi(credentials);
    const { userId, token, email, fullName, phone } = response.data;

    setToken(token);
    setUser({ userId, email, fullName, phone });

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ userId, email, fullName, phone }));
  };

  const register = async (data) => {
    const response = await registerApi(data);
    const { userId, token, email, fullName, phone } = response.data;

    setToken(token);
    setUser({ userId, email, fullName, phone });

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ userId, email, fullName, phone }));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = { user, token, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}