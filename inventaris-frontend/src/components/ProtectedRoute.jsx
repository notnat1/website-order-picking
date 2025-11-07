import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const ProtectedRoute = ({ children }) => {
  const { user, token } = useAuth();
  const location = useLocation();

  // Kita cek 'token' (bukan 'user') karena 'user' mungkin belum ter-load
  // tapi token sudah ada
  if (!token) {
    // Lempar ke login, tapi ingat halaman yang tadi mau dibuka
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika ada token, tapi data user-nya belum ada (masih loading)
  // Tampilkan spinner
  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: 'var(--bg-dark-1)'
      }}>
        <Spinner animation="border" variant="primary" />
        <p className="ms-2 text-light">Memuat data user...</p>
      </div>
    );
  }

  // Jika token ada dan user ada, izinkan masuk
  return children;
};

export default ProtectedRoute;