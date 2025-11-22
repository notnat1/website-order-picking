import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Badge, Spinner, ButtonGroup, ToggleButton } from 'react-bootstrap';
import toast from 'react-hot-toast';

const HistoriPesananPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('active');

  const fetchOrders = async (currentMode, isManualRefresh = false) => {
    if (!loading) setLoading(true);
    try {
      const params = { status: currentMode === 'archived' ? 'archived' : 'active' };
      const response = await axios.get('/orders', { params }); 
      setOrders(response.data);
      setError(null);
      if (isManualRefresh) toast.success('Histori pesanan berhasil diperbarui!');
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil histori pesanan.');
      toast.error('Gagal memuat histori pesanan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(viewMode); 
  }, [viewMode]);

  const handleArchive = async (orderId) => {
    if (window.confirm('Apakah Anda yakin ingin mengarsipkan pesanan ini?')) {
      const promise = axios.post(`/orders/${orderId}/archive`);
      await toast.promise(promise, {
        loading: 'Mengarsipkan pesanan...',
        success: 'Pesanan berhasil diarsipkan.',
        error: (err) => err.response?.data?.error || 'Gagal mengarsipkan pesanan.',
      });
      fetchOrders(viewMode);
    }
  };
  
  const handleUnarchive = async (orderId) => {
    if (window.confirm('Pulihkan pesanan ini ke daftar Selesai?')) {
      const promise = axios.post(`/orders/${orderId}/unarchive`);
      await toast.promise(promise, {
        loading: 'Memulihkan pesanan...',
        success: 'Pesanan berhasil dipulihkan.',
        error: (err) => err.response?.data?.error || 'Gagal memulihkan pesanan.',
      });
      fetchOrders(viewMode);
    }
  };

  const handlePrint = (orderId) => {
    window.open(`/cetak/pesanan/${orderId}`, '_blank');
  };

  if (loading && orders.length === 0) {
    return (
      <div className="content-card d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error && orders.length === 0) {
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
          <h2 className="section-title">Histori Pesanan</h2>
          <p className="section-subtitle">Monitor semua pesanan yang masuk dan selesai.</p>
        </div>
        <Button className="btn-accent" onClick={() => fetchOrders(viewMode, true)} disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Refresh'}
        </Button>
      </div>

      <ButtonGroup className="mb-3">
        <ToggleButton
          type="radio"
          variant={viewMode === 'active' ? 'info' : 'outline-secondary'}
          name="radio"
          value="active"
          checked={viewMode === 'active'}
          onClick={() => setViewMode('active')}
        >
          Pesanan Aktif
        </ToggleButton>
        <ToggleButton
          type="radio"
          variant={viewMode === 'archived' ? 'info' : 'outline-secondary'}
          name="radio"
          value="archived"
          checked={viewMode === 'archived'}
          onClick={() => setViewMode('archived')}
        >
          Lihat Arsip
        </ToggleButton>
      </ButtonGroup>

      {error && <Alert variant="danger">{error}</Alert>}
      
      {!loading && orders.length === 0 ? (
        <div className="text-center p-5 my-5 border-dashed">
          <h4 className="mb-3">{viewMode === 'active' ? 'Tidak Ada Pesanan Aktif' : 'Arsip Kosong'}</h4>
          <p className="text-light-2 mb-4">
            {viewMode === 'active' ? 'Semua pesanan sudah selesai atau diarsipkan.' : 'Tidak ada pesanan yang diarsipkan.'}
          </p>
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
                <td data-label="Status">
                  {order.status === 'Pending' && <Badge bg="warning">Pending</Badge>}
                  {order.status === 'Picked' && <Badge bg="success">Selesai</Badge>}
                  {order.status === 'Archived' && <Badge bg="secondary">Diarsip</Badge>}
                </td>
                <td data-label="Jumlah Item">{order._count.orderItems} Jenis Barang</td> 
                <td data-label="Aksi">
                  {order.status === 'Pending' && (
                    <Badge bg="secondary">Menunggu diproses</Badge>
                  )}
                  {order.status === 'Picked' && (
                    <div className="action-buttons-row">
                      <Button variant="info" size="sm" onClick={() => handlePrint(order.id)}>
                        🖨️ Cetak Nota
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleArchive(order.id)}>
                        🗑️ Arsipkan
                      </Button>
                    </div>
                  )}
                  {order.status === 'Archived' && (
                    <div className="action-buttons-row">
                      <Button variant="warning" size="sm" onClick={() => handleUnarchive(order.id)}>
                        ↩️ Pulihkan
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default HistoriPesananPage;