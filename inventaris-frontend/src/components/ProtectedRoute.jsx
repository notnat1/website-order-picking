import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const ProtectedRoute = ({ children }) => {
  // 1. Ambil 'token' DAN 'isLoading'
  const { token, isLoading } = useAuth();
  const location = useLocation();

  // 2. Tampilkan Spinner jika Context masih memvalidasi
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: 'var(--bg-dark-1)'
      }}>
        <Spinner animation="border" style={{ color: 'var(--accent-blue)' }} />
        <p className="ms-3 text-light">Memvalidasi sesi...</p>
      </div>
    );
  }

  // 3. JIKA sudah TIDAK loading DAN TIDAK ada token, lempar ke login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 4. JIKA sudah TIDAK loading DAN ADA token, izinkan masuk
  return children;
};

export default ProtectedRoute;