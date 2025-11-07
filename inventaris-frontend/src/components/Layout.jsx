import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

// Ini adalah "template" utama kita
const Layout = () => {
  return (
    <div className="app-wrapper">
      
      {/* 1. SIDEBAR (diambil dari App.jsx lama) */}
      <nav className="sidebar">
        <div className="sidebar-header">
          Inventory
        </div>
        
        <Nav className="flex-column">
          {/* Kita ganti Nav.Link biasa jadi NavLink dari react-router-dom */}
          {/* Ini akan otomatis menambah class 'active' */}
          
          <Nav.Link as={NavLink} to="/">Dashboard</Nav.Link>
          <Nav.Link as={NavLink} to="/barang">Data Barang</Nav.Link>
          <Nav.Link as={NavLink} to="/supplier">Data Supplier</Nav.Link>
          <Nav.Link as={NavLink} to="/barang-masuk">Barang Masuk</Nav.Link>
          <Nav.Link as={NavLink} to="/buat-pesanan">Buat Pesanan</Nav.Link>
          <Nav.Link as={NavLink} to="/tugas-picking">Tugas Picking</Nav.Link>
          
        </Nav>
      </nav>

      {/* 2. AREA KONTEN (Wrapper Kanan) */}
      <div className="content-wrapper">
        
        {/* Header Gradient Atas */}
        <header className="main-header">
          <Link to="/">Home</Link>
          {/* (Di sini nanti bisa ditambah User Profile, Logout, dll) */}
        </header>

        {/* Konten Halaman (dicontrol oleh Router) */}
        <main className="page-content">
          <Outlet /> {/* <-- Ini adalah "lubang" tempat halaman di-render */}
        </main>
        
      </div>
    </div>
  );
};

export default Layout;