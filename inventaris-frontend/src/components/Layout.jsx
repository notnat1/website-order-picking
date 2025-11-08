import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap'; 
import { useAuth } from '../context/AuthContext';
import AnimatedLogoutButton from './AnimatedLogoutButton.jsx'; // Sesuaikan path jika perlu

// Ini adalah "template" utama kita
const Layout = () => {
  const { user, logout } = useAuth(); 

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="app-wrapper">
      
      {/* 1. SIDEBAR */}
      <nav className="sidebar">
        
        {/* ---- GRUP KONTEN ATAS ---- */}
        <div> 
          <div className="sidebar-header">
            Inventory
          </div>
          
          {/* Info User */}
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

          {/* Link Navigasi */}
          <Nav className="flex-column">
            <Nav.Link as={NavLink} to="/">Dashboard</Nav.Link>
            
            {/* --- MULAI LOGIKA LEVEL USER (URUTAN BARU) --- */}
            
            {/* 1. Menu utama untuk 'manajemen' */}
            {user && user.level === 'manajemen' && (
              <>
                <Nav.Link as={NavLink} to="/barang">Data Barang</Nav.Link>
                <Nav.Link as={NavLink} to="/supplier">Data Supplier</Nav.Link>
                <Nav.Link as={NavLink} to="/barang-masuk">Barang Masuk</Nav.Link>
                <Nav.Link as={NavLink} to="/buat-pesanan">Buat Pesanan</Nav.Link>
              </>
            )}
            
            {/* 2. Menu 'Tugas Picking' (muncul di sini) */}
            {user && (user.level === 'manajemen' || user.level === 'gudang') && (
              <Nav.Link as={NavLink} to="/tugas-picking">Tugas Picking</Nav.Link>
            )}

            {/* 3. Menu 'Manajemen User' (pindah ke bawah) */}
            {user && user.level === 'manajemen' && (
              <Nav.Link as={NavLink} to="/manajemen-user">Manajemen User</Nav.Link> 
            )}
            
            {/* --- SELESAI LOGIKA LEVEL USER --- */}
          </Nav>
        </div>
        {/* ---- AKHIR GRUP KONTEN ATAS ---- */}


        {/* ---- GRUP KONTEN BAWAH (LOGOUT) ---- */}
        <div style={{ 
          marginTop: 'auto', 
          paddingTop: '20px', 
          borderTop: '1px solid var(--bg-dark-3)',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <AnimatedLogoutButton onClick={handleLogout} />
        </div>
        
      </nav>

      {/* 2. AREA KONTEN (Wrapper Kanan) */}
      <div className="content-wrapper">
        
        <header className="main-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>
            Home
          </Link>
        </header>

        <main className="page-content">
          <Outlet /> 
        </main>
        
      </div>
    </div>
  );
};

export default Layout;