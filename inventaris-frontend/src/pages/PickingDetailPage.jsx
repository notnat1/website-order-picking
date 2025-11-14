import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Button, Alert, Spinner, Badge, Form } from 'react-bootstrap'; // <-- Tambah Form

const PickingDetailPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [order, setOrder] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingSelesai, setLoadingSelesai] = useState(false);
  
  // State baru untuk menyimpan kuantitas yang benar-benar diambil
  const [itemsTaken, setItemsTaken] = useState({});

  // 1. useEffect untuk mengambil data order detail
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        // Path sudah diperbaiki
        const response = await axios.get(`/orders/${id}`); 
        setOrder(response.data);
        
        // Inisialisasi itemsTaken dengan kuantitas yang diminta
        const initialItemsTaken = {};
        response.data.orderItems.forEach(detail => {
          initialItemsTaken[detail.item_id] = detail.jumlah;
        });
        setItemsTaken(initialItemsTaken);
        
      } catch (err) {
        setError('Gagal mengambil detail pesanan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Handler perubahan kuantitas input
  const handleQuantityChange = (itemId, maxStock, value) => {
    const numValue = parseInt(value);
    
    if (numValue < 0) return; // Tidak boleh negatif
    if (numValue > maxStock) return; // Tidak boleh melebihi stok tersedia

    setItemsTaken(prev => ({
      ...prev,
      [itemId]: numValue
    }));
  };
  
  // 2. FUNGSI JANTUNG: Saat tombol "Selesai Picking" diklik
  const handleCompletePicking = async () => {
    // Buat array items_taken untuk payload
    const items_taken_payload = Object.keys(itemsTaken).map(itemId => ({
      item_id: parseInt(itemId),
      jumlah_ambil: itemsTaken[itemId]
    })).filter(item => item.jumlah_ambil > 0); // Hanya kirim yang diambil > 0

    if (items_taken_payload.length === 0) {
      setError('Anda harus mengambil minimal 1 item untuk menyelesaikan pesanan.');
      return;
    }
    
    if (!window.confirm('Apakah Anda yakin sudah mengambil semua barang? Stok akan dikurangi.')) {
      return;
    }
    
    setLoadingSelesai(true);
    setError(null);

    try {
      // Panggil API backend 'completeOrderPicking' dengan payload kuantitas yang diambil
      await axios.post(`/orders/${id}/complete`, { items_taken: items_taken_payload });
      
      alert('Picking selesai! Stok telah diupdate.');
      navigate('/tugas-picking'); // <-- Kembali ke daftar tugas

    } catch (err) {
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

  // Cek apakah ada masalah stok yang terdeteksi di form
  const hasLowStockIssue = order.orderItems.some(detail => 
    itemsTaken[detail.item_id] > detail.item.jumlah_stok
  );

  // 3. Tampilan Halaman (JSX)
  return (
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">Detail Picking: {order.nomor_pesanan}</h2>
          <p className="section-subtitle">
            Untuk: {order.nama_pemesan} | Ditugaskan ke: **{order.picker?.nama || 'Belum ditugaskan'}**
          </p>
        </div>
        <Button 
          className="btn-accent" 
          onClick={handleCompletePicking}
          disabled={loadingSelesai || order.status !== 'Pending' || hasLowStockIssue} // <-- Disabled jika stok kurang
        >
          {loadingSelesai ? 'Memproses...' : '✅ Selesai Picking'}
        </Button>
      </div>

      {hasLowStockIssue && (
          <Alert variant="danger" className="mb-3">
              Kuantitas Ambil melebihi Stok yang Tersedia! Mohon periksa input Anda.
          </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      <h5 className="mt-4">Daftar Barang untuk Diambil:</h5>
      <Table responsive hover className="table-soft">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Barang</th>
            <th>Lokasi Gudang</th>
            <th>Diminta</th>
            <th>Stok Tersedia</th>
            <th>Kuantitas Ambil</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems?.length > 0 ? (
            order.orderItems.map((detail, index) => (
              <tr key={detail.id}>
                <td>{index + 1}</td>
                <td>{detail.item.nama_barang}</td>
                <td>{detail.item.lokasi || '-'}</td>
                <td>{detail.jumlah}</td>
                {/* Tandai stok tersedia merah jika lebih kecil dari yang diminta */}
                <td style={detail.item.jumlah_stok < detail.jumlah ? { color: '#dc3545', fontWeight: 'bold' } : {}}>
                    {detail.item.jumlah_stok}
                </td>
                <td>
                    <Form.Control
                        type="number"
                        size="sm"
                        value={itemsTaken[detail.item_id]}
                        onChange={(e) => 
                            handleQuantityChange(
                                detail.item_id, 
                                detail.item.jumlah_stok, // max stock
                                e.target.value
                            )
                        }
                        min="0"
                        max={detail.item.jumlah_stok} // Maksimal stok yang ada
                        style={{ width: '100px' }}
                    />
                    {itemsTaken[detail.item_id] > detail.item.jumlah_stok && (
                        <small className="text-danger">Maks {detail.item.jumlah_stok}</small>
                    )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">Tidak ada barang di pesanan ini.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default PickingDetailPage;