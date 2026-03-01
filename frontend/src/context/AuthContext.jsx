import { createContext, useState, useContext, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    if (token) {
      // Verify token is still valid
      API.get('/admin/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => {
          // Token is valid
          setAdmin({ token });
        })
        .catch(() => {
          // Token invalid
          localStorage.removeItem('adminToken');
          setToken(null);
          setAdmin(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await API.post('/admin/login', { email, password });
      const { token, admin: adminData } = response.data;
      
      localStorage.setItem('adminToken', token);
      setToken(token);
      setAdmin({ ...adminData, token });
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setAdmin(null);
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};