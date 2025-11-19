import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { List as HamburgerIcon, X as CloseIcon } from 'react-bootstrap-icons';
import { useAuth } from '../context/AuthContext';
import AnimatedLogoutButton from './AnimatedLogoutButton.jsx';

const Layout = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when a NavLink is clicked on mobile
  const handleNavLinkClick = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isSidebarOpen]);

  return (
    <div className={`app-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-overlay" onClick={toggleSidebar}></div>

      {/* 1. SIDEBAR */}
      <nav className="sidebar">
        <div>
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <img src="/icon-website.png" alt="Company Logo" />
            </div>
            <button className="sidebar-close-btn" onClick={toggleSidebar}>
              <CloseIcon size={24} />
            </button>
          </div>

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
            <Nav.Link as={NavLink} to="/" onClick={handleNavLinkClick}>Dashboard</Nav.Link>
            
            {user && user.level === 'manajemen' && (
              <>
                <Nav.Link as={NavLink} to="/barang" onClick={handleNavLinkClick}>Data Barang</Nav.Link>
                <Nav.Link as={NavLink} to="/supplier" onClick={handleNavLinkClick}>Data Supplier</Nav.Link>
                <Nav.Link as={NavLink} to="/barang-masuk" onClick={handleNavLinkClick}>Barang Masuk</Nav.Link>
                <Nav.Link as={NavLink} to="/buat-pesanan" onClick={handleNavLinkClick}>Buat Pesanan</Nav.Link>
              </>
            )}
            
            {user && (user.level === 'manajemen' || user.level === 'gudang') && (
              <Nav.Link as={NavLink} to="/tugas-picking" onClick={handleNavLinkClick}>Tugas Picking</Nav.Link>
            )}

            {user && user.level === 'manajemen' && (
              <>
                <Nav.Link as={NavLink} to="/histori-pesanan" onClick={handleNavLinkClick}>Histori Pesanan</Nav.Link>
                <Nav.Link as={NavLink} to="/manajemen-user" onClick={handleNavLinkClick}>Manajemen User</Nav.Link> 
              </>
            )}
          </Nav>
        </div>

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

      {/* 2. AREA KONTEN */}
      <div className="content-wrapper">
        <header className="main-header">
          <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
            <HamburgerIcon size={28} />
          </button>
          <h1 className="header-title">Dashboard</h1>
          <Link to="/" className="desktop-home-link">Home</Link>
        </header>
        <main className="page-content">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default Layout;