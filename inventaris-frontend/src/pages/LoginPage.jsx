import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

// 1. GANTI IKON: dari EyeFill -> Eye (outline)
import { Eye, EyeSlash } from 'react-bootstrap-icons';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);

  const { login, user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        <div className="login-panel left">
          <h2>Sign In</h2>
          
          {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
          
          <Form onSubmit={handleSubmit} className="w-100">
            
            <Form.Floating className="mb-3">
              <Form.Control
                id="floatingUsername"
                type="text"
                placeholder="Masukkan username Anda"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
              <label htmlFor="floatingUsername">Username</label>
            </Form.Floating>

            <Form.Floating className="mb-4">
              <Form.Control
                id="floatingPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <label htmlFor="floatingPassword">Password</label>
              
              {/* 2. GANTI IKON DI SINI */}
              <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeSlash /> : <Eye />}
              </span>
            </Form.Floating>
            
            <Button 
              className="w-100 btn-accent" 
              type="submit" 
              disabled={loading}
              style={{ height: '45px' }}
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'SIGN IN'}
            </Button>
          </Form>
        </div>

        <div className="login-panel right">
          <h2>Hello, Employee!</h2>
          <p className="lead" style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '30px' }}>
            Selamat datang kembali di sistem Inventory & Order Picking perusahaan.
            Silakan login untuk melanjutkan pekerjaan Anda.
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;