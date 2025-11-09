import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HistoriPesananPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const navigate = useNavigate(); // Kita tidak pakai navigate untuk ini

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/orders');
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil histori pesanan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleArchive = async (orderId) => {
    if (window.confirm('Apakah Anda yakin ingin mengarsipkan pesanan ini?')) {
      try {
        await axios.post(`/orders/${orderId}/archive`);
        alert('Pesanan diarsipkan.');
        fetchAllOrders();
      } catch (err) {
        setError(err.response?.data?.error || 'Gagal mengarsipkan pesanan.');
      }
    }
  };

  // --- PERBAIKAN DI SINI ---
  // Fungsi untuk tombol "Cetak Nota"
  const handlePrint = (orderId) => {
    // Buka halaman cetak di tab baru
    window.open(`/cetak/pesanan/${orderId}`, '_blank');
  };
  // --- AKHIR PERBAIKAN ---

  return (
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">Histori Pesanan</h2>
          <p className="section-subtitle">Monitor semua pesanan yang masuk dan selesai.</p>
        </div>
        <Button className="btn-accent" onClick={fetchAllOrders} disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Refresh'}
        </Button>
      </div>

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
                  </td>
                  <td>{order._count.orderItems} Jenis Barang</td> 
                  <td>
                    {order.status === 'Pending' && (
                      <Badge bg="secondary">Menunggu diproses</Badge>
                    )}
                    {order.status === 'Picked' && (
                      <>
                        <Button 
                            variant="info" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handlePrint(order.id)} // <-- Panggil fungsi baru
                          >
                            Cetak
                          </Button>
                        <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleArchive(order.id)}
                          >
                            X
                          </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">Belum ada pesanan.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default HistoriPesananPage;