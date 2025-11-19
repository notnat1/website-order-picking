import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TugasPickingPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPendingOrders = async (options = { isManualRefresh: false }) => {
    // For initial load, don't set loading to true again if it's already true
    if (!loading) setLoading(true);
    
    try {
      const response = await axios.get('/orders/pending');
      setOrders(response.data);
      setError(null);
      if (options.isManualRefresh) {
        toast.success('Daftar tugas berhasil diperbarui!');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil daftar tugas.');
      // Only show error toast on manual refresh to avoid spam on initial load fail
      if (options.isManualRefresh) {
        toast.error('Gagal memuat daftar tugas.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch, not a manual refresh
    fetchPendingOrders({ isManualRefresh: false });
  }, []);

  const handleViewDetail = (orderId) => {
    navigate(`/tugas-picking/${orderId}`);
  };

  const handleRefresh = () => {
    fetchPendingOrders({ isManualRefresh: true });
  };

  if (loading && orders.length === 0) { // Show full page spinner only on initial load
    return (
      <div className="content-card d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error && orders.length === 0) { // Show full page error only if there's no data to show
    return (
      <div className="content-card">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">Daftar Tugas Picking</h2>
          <p className="section-subtitle">Daftar pesanan yang siap untuk diambil (Status: Pending).</p>
        </div>
        <Button className="btn-accent" onClick={handleRefresh} disabled={loading}>
          {loading ? 'Memuat...' : 'Refresh'}
        </Button>
      </div>

      {/* Show error inline if data is already present */}
      {error && <Alert variant="danger">{error}</Alert>}

      {orders.length === 0 && !loading ? (
        <div className="text-center p-5 my-5 border-dashed">
          <h4 className="mb-3">Belum Ada Tugas Picking</h4>
          <p className="text-light-2 mb-4">Tidak ada pesanan dengan status 'Pending' saat ini.</p>
          <Button className="btn-accent" onClick={handleRefresh} disabled={loading}>
            {loading ? 'Memuat...' : 'Refresh Daftar'}
          </Button>
        </div>
      ) : (
        <Table responsive hover className="table-soft table-responsive-cards">
          <thead>
            <tr>
              <th>No. Pesanan</th>
              <th>Nama Pemesan</th>
              <th>Tgl Pesan</th>
              <th>Status</th>
              <th>Jumlah Item</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td data-label="No. Pesanan">{order.nomor_pesanan}</td>
                <td data-label="Nama Pemesan">{order.nama_pemesan}</td>
                <td data-label="Tgl Pesan">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td data-label="Status"><Badge bg="warning">{order.status}</Badge></td>
                <td data-label="Jumlah Item">{order._count.orderItems} Jenis Barang</td>
                <td data-label="Aksi">
                  <Button 
                      variant="warning" 
                      size="sm" 
                      onClick={() => handleViewDetail(order.id)}
                    >
                      Mulai Picking
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default TugasPickingPage;