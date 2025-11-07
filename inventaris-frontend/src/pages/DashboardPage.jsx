// Lokasi: src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Alert, Spinner } from 'react-bootstrap';

// Buat komponen kecil untuk kartu statistik
const StatCard = ({ title, value, unit }) => (
  <div className="sub-card text-center">
    <h5 className="section-subtitle" style={{ marginBottom: 0 }}>{title}</h5>
    <h2 className="section-title" style={{ fontSize: '2.5rem', color: 'var(--accent-blue)' }}>
      {value}
    </h2>
    {unit && <p className="text-light-2" style={{ marginTop: '-8px' }}>{unit}</p>}
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Panggil API yang baru kita buat
        const response = await axios.get('http://localhost:5001/api/stats/dashboard');
        setStats(response.data);
        setError(null);
      } catch (err) {
        setError('Gagal memuat data statistik.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">Dashboard</h2>
          <p className="section-subtitle">Selamat datang di sistem Order Picking.</p>
        </div>
      </div>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
          <p className="ms-2 d-inline">Memuat statistik...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && stats && (
        <Row>
          <Col md={3}>
            <StatCard title="Tugas Picking Pending" value={stats.pendingOrders} unit="Pesanan" />
          </Col>
          <Col md={3}>
            <StatCard title="Total Jenis Barang" value={stats.totalItems} unit="SKU Aktif" />
          </Col>
          <Col md={3}>
            <StatCard title="Total Stok Gudang" value={stats.totalStock} unit="Unit" />
          </Col>
          <Col md={3}>
            <StatCard title="Supplier Aktif" value={stats.totalSuppliers} unit="Mitra" />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default DashboardPage;