import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap'; // Hapus Card, Container, Row, Col

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useAuth();
  // const navigate = useNavigate(); // Tidak perlu navigate di sini karena sudah di AuthContext

  // Jika user SUDAH login, lempar langsung ke Dashboard
  // Ini tetap penting agar user tidak bisa akses halaman login jika sudah masuk
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      // Navigasi ke '/' sudah di-handle di dalam AuthContext.jsx
    } catch (err) {
      setError(err.message); // Error dari AuthContext.jsx
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container"> {/* Background utama */}
      <div className="login-card"> {/* Kartu besar pembungkus */}
        
        {/* Panel Kiri: Form Login */}
        <div className="login-panel left">
          <h2>Sign In</h2>
          
          {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
          
          <Form onSubmit={handleSubmit} className="w-100"> {/* Lebar 100% dari panel */}
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan username Anda"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading} // Nonaktifkan input saat loading
              />
            </Form.Group>
            <Form.Group className="mb-4"> {/* Tambah mb-4 untuk jarak ke tombol */}
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Masukkan password Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading} // Nonaktifkan input saat loading
              />
            </Form.Group>
            
            {/* Link "Forget Password" (jika nanti mau diimplementasikan) */}
            {/* <div className="text-end mb-4">
              <a href="#" className="text-light" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>Lupa Password?</a>
            </div> */}

            <Button 
              className="w-100 btn-accent" 
              type="submit" 
              disabled={loading}
              style={{ height: '45px' }} // Sesuaikan tinggi tombol
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'SIGN IN'}
            </Button>
          </Form>
        </div>

        {/* Panel Kanan: Pesan Selamat Datang (Warna Solid) */}
        <div className="login-panel right">
          <h2>Hello, Employee!</h2> {/* Ganti dengan pesan yang lebih profesional */}
          <p className="lead" style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '30px' }}>
            Selamat datang kembali di sistem Inventory & Order Picking perusahaan.
            Silakan login untuk melanjutkan pekerjaan Anda.
          </p>
          {/* Untuk aplikasi internal, kita tidak perlu tombol SIGN UP */}
          {/* Jika ingin ada tombol bantuan, bisa diganti di sini */}
          {/* <Button variant="outline-light" size="lg">Bantuan Login</Button> */}
        </div>

      </div>
    </div>
  );
};

export default LoginPage;