import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Button, Alert, Spinner, Badge } from 'react-bootstrap';

const PickingDetailPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [order, setOrder] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingSelesai, setLoadingSelesai] = useState(false);

  // 1. useEffect untuk mengambil data order detail
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5001/api/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        setError('Gagal mengambil detail pesanan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  
  // 2. FUNGSI JANTUNG: Saat tombol "Selesai Picking" diklik
  const handleCompletePicking = async () => {
    if (!window.confirm('Apakah Anda yakin sudah mengambil semua barang ini? Stok akan dikurangi.')) {
      return;
    }
    
    setLoadingSelesai(true);
    setError(null);

    try {
      // Panggil API backend 'completeOrderPicking'
      await axios.post(`http://localhost:5001/api/orders/${id}/complete`);
      
      // Jika sukses, lempar user kembali ke halaman "Tugas Picking"
      alert('Picking selesai! Stok telah diupdate.');
      navigate('/tugas-picking'); // <-- Kembali ke daftar tugas

    } catch (err) {
      // Tampilkan error dari backend (misal: "Stok tidak cukup")
      const message = err.response?.data?.error || 'Gagal memproses. Coba lagi.';
      setError(message);
      console.error(err);
    } finally {
      setLoadingSelesai(false);
    }
  };


  // Tampilan loading awal
  if (loading) {
    return (
      <div className="content-card">
        <Spinner animation="border" />
        <p className="ms-2 d-inline">Memuat detail pesanan...</p>
      </div>
    );
  }

  // Tampilan jika error
  if (error) {
     return <div className="content-card"><Alert variant="danger">{error}</Alert></div>
  }

  // Tampilan jika order tidak ditemukan
  if (!order) {
    return <div className="content-card"><Alert variant="warning">Order tidak ditemukan.</Alert></div>
  }

  // 3. Tampilan Halaman (JSX)
  return (
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">Detail Picking: {order.nomor_pesanan}</h2>
          <p className="section-subtitle">Untuk: {order.nama_pemesan}</p>
        </div>
        <Button 
          className="btn-accent" 
          onClick={handleCompletePicking}
          disabled={loadingSelesai || order.status !== 'Pending'}
        >
          {loadingSelesai ? 'Memproses...' : '✅ Selesai Picking'}
        </Button>
      </div>

      <p>Status Saat Ini: <Badge bg={order.status === 'Pending' ? 'warning' : 'success'}>{order.status}</Badge></p>

      <h5 className="mt-4">Daftar Barang untuk Diambil:</h5>
      <Table responsive hover className="table-soft">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Barang</th>
            <th>Lokasi Gudang</th>
            <th>Sisa Stok Saat Ini</th>
            <th>Jumlah Ambil</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems?.length > 0 ? (
            order.orderItems.map((detail, index) => (
              <tr key={detail.id}>
                <td>{index + 1}</td>
                <td>{detail.item.nama_barang}</td>
                <td>{detail.item.lokasi || '-'}</td>
                <td>{detail.item.jumlah_stok}</td>
                {/* Tandai merah jika stok kurang */}
                <td style={detail.item.jumlah_stok < detail.jumlah ? { color: 'red', fontWeight: 'bold' } : {}}>
                  {detail.jumlah}
                  {detail.item.jumlah_stok < detail.jumlah && ' (Stok Kurang!)'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">Tidak ada barang di pesanan ini.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default PickingDetailPage;