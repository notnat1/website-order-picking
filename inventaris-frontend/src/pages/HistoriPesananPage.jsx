// Lokasi: src/pages/HistoriPesananPage.jsx
// (VERSI PERBAIKAN AKHIR - MENGHAPUS USECALLBACK)

import React, { useState, useEffect, useCallback } from 'react'; // <-- Hapus useCallback dari sini
import axios from 'axios';
import { Table, Button, Alert, Badge, Spinner, ButtonGroup, ToggleButton } from 'react-bootstrap';

const HistoriPesananPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('active'); // 'active' atau 'archived'

  // --- FUNGSI MENGAMBIL DATA (DIBUAT DENGAN CARA LAMA TAPI BENAR) ---
  // Fungsi ini tidak lagi dibungkus useCallback
  const fetchOrders = async (currentMode) => { // <-- 1. Fungsi menerima parameter
    try {
      setLoading(true);
      
      // 2. Tentukan params berdasarkan parameter yang diterima
      const params = {};
      if (currentMode === 'archived') {
        params.status = 'archived';
      } else {
        params.status = 'active'; 
      }
      
      const response = await axios.get('/orders', { params }); 
      setOrders(response.data);
      setError(null);
      
      console.log('view mode berakhir di:', currentMode, 'dengan data:', response.data.length); 

    } catch (err) {
      setError('Terjadi kesalahan saat mengambil histori pesanan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. useEffect memanggil fungsi dengan viewMode terbaru
  useEffect(() => {
    // LOG DEBUG
    console.log('fetchOrders dipanggil karena viewMode berubah');
    // Panggil dengan state viewMode saat ini
    fetchOrders(viewMode); 
  }, [viewMode]); // <-- HANYA bergantung pada viewMode (ini yang akan memicu fetch)

  // --- LOGIKA AKSI (PERLU SEDIKIT PENYESUAIAN) ---
  
  const handleArchive = async (orderId) => {
    if (window.confirm('Apakah Anda yakin ingin mengarsipkan pesanan ini?')) {
      try {
        await axios.post(`/orders/${orderId}/archive`);
        alert('Pesanan diarsipkan.');
        fetchOrders(viewMode); // <-- Panggil dengan mode saat ini
      } catch (err) {
        setError(err.response?.data?.error || 'Gagal mengarsipkan pesanan.');
      }
    }
  };
  
  const handleUnarchive = async (orderId) => {
    if (window.confirm('Pulihkan pesanan ini ke daftar Selesai?')) {
      try {
        await axios.post(`/orders/${orderId}/unarchive`);
        alert('Pesanan dipulihkan.');
        fetchOrders(viewMode); // <-- Panggil dengan mode saat ini
      } catch (err) {
        setError(err.response?.data?.error || 'Gagal memulihkan pesanan.');
      }
    }
  };

  const handlePrint = (orderId) => {
    window.open(`/cetak/pesanan/${orderId}`, '_blank');
  };

  const handleToggle = (newMode) => {
    // Set state dulu
    setViewMode(newMode);
    // fetchOrders akan otomatis dipanggil oleh useEffect
  }

  // --- TAMPILAN (JSX) ---

  return (
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">Histori Pesanan</h2>
          <p className="section-subtitle">Monitor semua pesanan yang masuk dan selesai.</p>
        </div>
        {/* Tombol Refresh sekarang memanggil 'fetchOrders' secara eksplisit */}
        <Button className="btn-accent" onClick={() => fetchOrders(viewMode)} disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Refresh'}
        </Button>
      </div>

      {/* --- TOMBOL FILTER BARU --- */}
      <ButtonGroup className="mb-3">
        <ToggleButton
          type="radio"
          variant={viewMode === 'active' ? 'info' : 'outline-secondary'}
          name="radio"
          value="active"
          checked={viewMode === 'active'}
          onClick={() => handleToggle('active')}
        >
          Pesanan Aktif
        </ToggleButton>
        <ToggleButton
          type="radio"
          variant={viewMode === 'archived' ? 'info' : 'outline-secondary'}
          name="radio"
          value="archived"
          checked={viewMode === 'archived'}
          onClick={() => handleToggle('archived')}
        >
          Lihat Arsip
        </ToggleButton>
      </ButtonGroup>
      {/* --- AKHIR TOMBOL FILTER --- */}


      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      
      {!loading && (
        <Table responsive hover className="table-soft">
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
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.nomor_pesanan}</td>
                  <td>{order.nama_pemesan}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    {order.status === 'Pending' && <Badge bg="warning">Pending</Badge>}
                    {order.status === 'Picked' && <Badge bg="success">Selesai</Badge>}
                    {order.status === 'Archived' && <Badge bg="secondary">Diarsip</Badge>}
                  </td>
                  <td>{order._count.orderItems} Jenis Barang</td> 
                  <td>
                    {/* --- LOGIKA AKSI BERDASARKAN STATUS --- */}
                    {order.status === 'Pending' && (
                      <Badge bg="secondary">Menunggu diproses</Badge>
                    )}
                    {order.status === 'Picked' && (
                      <>
                        <Button variant="info" size="sm" className="me-2" onClick={() => handlePrint(order.id)}>
                          Cetak
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleArchive(order.id)}>
                          X
                        </Button>
                      </>
                    )}
                    {order.status === 'Archived' && (
                      <Button variant="warning" size="sm" onClick={() => handleUnarchive(order.id)}>
                        Pulihkan
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  {viewMode === 'active' ? 'Belum ada pesanan aktif.' : 'Arsip kosong.'}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default HistoriPesananPage;