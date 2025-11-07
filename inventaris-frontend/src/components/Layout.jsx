import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Nav, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

// Ini adalah "template" utama kita
const Layout = () => {
  const { user, logout } = useAuth();
  // const navigate = useNavigate(); // <-- BARIS INI ERROR (LINE 9)

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      logout();
    }
  };
  return (
    <div className="app-wrapper">
      
      {/* 1. SIDEBAR */}
      <nav className="sidebar">
        <div className="sidebar-header">
          Inventory
        </div>
        
        {/* Tampilkan nama user jika ada */}
        {user && (
          <div style={{
            padding: '10px 16px', 
            marginBottom: '20px', 
            backgroundColor: 'var(--bg-dark-3)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ color: 'white', fontWeight: '500' }}>{user.nama}</div>
            <div style={{ color: 'var(--text-light-2)', fontSize: '0.8rem' }}>
              Level: {user.level}
            </div>
          </div>
        )}

        <Nav className="flex-column">
          <Nav.Link as={NavLink} to="/">Dashboard</Nav.Link>
          
          {/* --- MULAI LOGIKA LEVEL USER --- */}
          
          {/* 1. Menu untuk 'manajemen' */}
          {user && user.level === 'manajemen' && (
            <>
              <Nav.Link as={NavLink} to="/barang">Data Barang</Nav.Link>
              <Nav.Link as={NavLink} to="/supplier">Data Supplier</Nav.Link>
              <Nav.Link as={NavLink} to="/barang-masuk">Barang Masuk</Nav.Link>
              <Nav.Link as={NavLink} to="/buat-pesanan">Buat Pesanan</Nav.Link>
            </>
          )}
          
          {/* 2. Menu untuk 'gudang' (asumsi) atau 'manajemen' */}
          {user && (user.level === 'manajemen' || user.level === 'gudang') && (
            <Nav.Link as={NavLink} to="/tugas-picking">Tugas Picking</Nav.Link>
          )}

          {/* --- SELESAI LOGIKA LEVEL USER --- */}
        </Nav>
      </nav>

      {/* 2. AREA KONTEN (Wrapper Kanan) */}
      <div className="content-wrapper">
        
        {/* Header Gradient Atas */}
        <header className="main-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Link to="/">Home</Link>
          
          {/* Tombol Logout */}
          <Button 
            variant="danger" 
            size="sm" 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </header>

        {/* Konten Halaman (dicontrol oleh Router) */}
        <main className="page-content">
          <Outlet /> 
        </main>
        
      </div>
    </div>
  );
};

export default Layout;