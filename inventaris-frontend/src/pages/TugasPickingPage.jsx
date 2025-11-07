import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // <-- Impor hook untuk pindah halaman

const TugasPickingPage = () => {
  const [orders, setOrders] = useState([]); // State untuk menyimpan daftar order
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 1. Fungsi untuk mengambil data order yang 'Pending'
  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/orders/pending');
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil daftar tugas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Ambil data saat halaman pertama kali dibuka
  useEffect(() => {
    fetchPendingOrders();
  }, []);

  // 3. Fungsi untuk pindah ke halaman detail saat tombol diklik
  const handleViewDetail = (orderId) => {
    // Ini akan pindah halaman ke /tugas-picking/1 (contohnya)
    navigate(`/tugas-picking/${orderId}`);
  };

  return (
    // 4. Gunakan "baju" (CSS) yang sudah seragam
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">Daftar Tugas Picking</h2>
          <p className="section-subtitle">Daftar pesanan yang siap untuk diambil (Status: Pending).</p>
        </div>
        {/* Tombol refresh manual */}
        <Button className="btn-accent" onClick={fetchPendingOrders} disabled={loading}>
          {loading ? 'Memuat...' : 'Refresh'}
        </Button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      
      {!loading && !error && (
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
                  <td><Badge bg="warning">{order.status}</Badge></td>
                  {/* Kita ambil dari '_count' yang dikirim backend */}
                  <td>{order._count.orderItems} Jenis Barang</td> 
                  <td>
                    <Button 
                        variant="warning" 
                        size="sm" 
                        onClick={() => handleViewDetail(order.id)}
                      >
                        Mulai Picking
                      </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">Belum ada tugas picking baru.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default TugasPickingPage;