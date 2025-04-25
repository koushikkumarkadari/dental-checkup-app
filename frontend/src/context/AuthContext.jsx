import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state synchronously from localStorage
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  const [user, setUser] = useState(initialUser);
  const [isDoctor, setIsDoctor] = useState(initialUser?.role === 'dentist');
  const [token, setToken] = useState(storedToken);

  // Log state updates for debugging
  useEffect(() => {
    console.log('AuthContext state updated - user:', user, 'token:', token);
  }, [user, token]);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setToken(data.token); // Fix: Use data.token
      setUser(data);
      setIsDoctor(data.role === 'dentist');
    } catch (err) {
      console.error('Login failed:', err.response?.data?.message || err.message);
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/register', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setToken(data.token);
      setUser(data);
      setIsDoctor(data.role === 'dentist');
    } catch (err) {
      console.error('Registration failed:', err.response?.data?.message || err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsDoctor(false);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, isDoctor, login, register, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);