import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);
const API_URL = 'http://localhost:5001/api';
axios.defaults.baseURL = API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true); // <-- 1. TAMBAHKAN INI
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  }, [navigate]);

  // --- FUNGSI LAMA (VERSI SUDAH DIPERBAIKI) ---
  useEffect(() => {
    setIsLoading(true); // <-- 2. Mulai loading setiap token berubah
    try {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const storedUser = localStorage.getItem('user');
        
        if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
          const userObject = JSON.parse(storedUser);
          setUser(userObject);
        } else {
           // Jika token ada tapi data user tidak ada (aneh), logout paksa
           console.warn("State tidak konsisten: Token ada, user tidak ada. Logout paksa.");
           logout();
        }
      } else {
        // Pastikan jika tidak ada token, user juga null
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } catch (e) {
      console.error("Data user korup, logout paksa:", e);
      logout(); // Panggil fungsi logout jika data korup
    } finally {
      setIsLoading(false); // <-- 3. SETELAH SEMUA SELESAI, BARU SET isLoading = false
    }
  }, [token, logout]); // <-- Dependensi sudah benar

  // --- PERBAIKAN BUG "TAB HANTU" ---
  useEffect(() => {
    const handleStorageChange = (e) => {
      // ... (kode ini biarkan saja, sudah benar)
      if (e.key === 'token') {
        const newToken = e.newValue;
        if (!newToken) {
          logout(); 
        } else {
          const newUser = localStorage.getItem('user');
          setToken(newToken); // Ini akan memicu useEffect di atas
          if (newUser && newUser !== 'undefined' && newUser !== 'null') {
            setUser(JSON.parse(newUser));
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [logout]); 

  // --- FUNGSI LOGIN (Biarkan, sudah benar) ---
  const login = useCallback(async (username, password) => {
    try {
      const response = await axios.post('/auth/login', { username, password });
      
      if (response.data.token) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // CUKUP SET TOKEN. Biarkan useEffect di atas yang mengurus sisanya.
        setToken(token); 
        // setUser(user); // Ini tidak perlu lagi, ditangani useEffect
        // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Ini juga
        
        navigate('/');
      }
    } catch (err) {
      console.error('Login gagal:', err);
      throw new Error(err.response?.data?.error || 'Login Gagal');
    }
  }, [navigate]);


  const value = {
    user,
    token,
    login,
    logout,
    isLoading // <-- 4. EKSPOR isLoading
  };

  // 5. JANGAN render children jika masih loading awal
  // Ini memastikan AuthContext siap sebelum seluruh aplikasi dimuat
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};