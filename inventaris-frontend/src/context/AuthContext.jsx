import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 1. Buat Context
const AuthContext = createContext(null);

// 2. Tentukan Base URL API kita
// Kita set sekali di sini, jadi tidak perlu ketik 'http://localhost:5001' lagi
const API_URL = 'http://localhost:5001/api';
axios.defaults.baseURL = API_URL;

// 3. Buat Provider (Pembungkus Aplikasi)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // 4. useEffect ini berjalan saat aplikasi pertama kali load
  useEffect(() => {
    if (token) {
      // Jika ada token di localStorage, set header default axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Ambil juga data user dari localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [token]);

  // 5. Fungsi untuk LOGIN
  const login = async (username, password) => {
    try {
      const response = await axios.post('/auth/login', { username, password });
      
      if (response.data.token) {
        const { token, user } = response.data;

        // Simpan ke State
        setToken(token);
        setUser(user);

        // Simpan ke LocalStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Atur header default axios untuk semua request berikutnya
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Lempar ke dashboard
        navigate('/');
      }
    } catch (err) {
      console.error('Login gagal:', err);
      // Anda bisa lempar error untuk ditangkap di halaman login
      throw new Error(err.response?.data?.error || 'Login Gagal');
    }
  };

  // 6. Fungsi untuk LOGOUT
  const logout = () => {
    // Hapus dari State
    setUser(null);
    setToken(null);

    // Hapus dari LocalStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Hapus header default axios
    delete axios.defaults.headers.common['Authorization'];
    
    // Lempar ke halaman login
    navigate('/login');
  };

  // 7. Data yang akan dibagikan ke seluruh aplikasi
  const value = {
    user,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 8. Custom Hook (Cara gampang panggil context-nya)
export const useAuth = () => {
  return useContext(AuthContext);
};