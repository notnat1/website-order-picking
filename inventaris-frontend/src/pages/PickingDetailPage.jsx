import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Button, Alert, Spinner, Badge, Form, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const PickingDetailPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuth(); // Get current user info

  const [order, setOrder] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingSelesai, setLoadingSelesai] = useState(false);
  
  const [itemsTaken, setItemsTaken] = useState({});

  // State for assignment feature
  const [pickers, setPickers] = useState([]);
  const [loadingPickers, setLoadingPickers] = useState(false);
  const [selectedPickerId, setSelectedPickerId] = useState('');

  const fetchOrderDetail = useCallback(async () => {
    try {
      // No need to check for loading, just set it.
      setLoading(true);
      const response = await axios.get(`/orders/${id}`); 
      setOrder(response.data);
      
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
  }, [id]); // <-- Dependency array cleaned up

  useEffect(() => {
    fetchOrderDetail();

    // Fetch pickers only if user is admin
    if (user?.level === 'manajemen') {
      const fetchPickers = async () => {
        setLoadingPickers(true);
        try {
          const response = await axios.get('/auth/warehouse-users');
          setPickers(response.data);
        } catch (err) {
          toast.error('Gagal memuat daftar picker.');
          console.error(err);
        } finally {
          setLoadingPickers(false);
        }
      };
      fetchPickers();
    }
  }, [id, user?.level, fetchOrderDetail]);

  const handleQuantityChange = (itemId, maxStock, value) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0) return;
    if (numValue > maxStock) return;

    setItemsTaken(prev => ({ ...prev, [itemId]: numValue }));
  };
  
  const handleCompletePicking = async () => {
    const items_taken_payload = Object.keys(itemsTaken).map(itemId => ({
      item_id: parseInt(itemId),
      jumlah_ambil: itemsTaken[itemId]
    })).filter(item => item.jumlah_ambil > 0);

    if (items_taken_payload.length === 0) {
      toast.error('Anda harus mengambil minimal 1 item untuk menyelesaikan pesanan.');
      return;
    }
    
    if (!window.confirm('Apakah Anda yakin sudah mengambil semua barang? Stok akan dikurangi.')) {
      return;
    }
    
    setLoadingSelesai(true);
    const promise = axios.post(`/orders/${id}/complete`, { items_taken: items_taken_payload });

    await toast.promise(promise, {
      loading: 'Menyelesaikan picking...',
      success: () => {
        navigate('/tugas-picking');
        return 'Picking selesai! Stok telah diupdate.';
      },
      error: (err) => err.response?.data?.error || 'Gagal memproses. Coba lagi.',
    });
    setLoadingSelesai(false);
  };

  const handleAssignPicker = async () => {
    if (!selectedPickerId) {
      toast.error('Pilih seorang picker untuk ditugaskan.');
      return;
    }
    const promise = axios.post(`/orders/${id}/assign`, { pickerId: selectedPickerId });

    await toast.promise(promise, {
      loading: 'Menugaskan picker...',
      success: () => {
        fetchOrderDetail(); // Refresh order details on success
        return 'Picker berhasil ditugaskan!';
      },
      error: (err) => err.response?.data?.error || 'Gagal menugaskan picker.',
    });
  };

  if (loading) {
    return (
      <div className="content-card d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
     return <div className="content-card"><Alert variant="danger">{error}</Alert></div>
  }

  if (!order) {
    return <div className="content-card"><Alert variant="warning">Order tidak ditemukan.</Alert></div>
  }

  const hasLowStockIssue = order.orderItems.some(detail => 
    itemsTaken[detail.item_id] > detail.item.jumlah_stok
  );

  const renderAssignmentSection = () => {
    if (order.picker) {
      return (
        <span>
          Ditugaskan ke: <strong>{order.picker.nama}</strong>
        </span>
      );
    }
    if (user?.level === 'manajemen') {
      return (
        <Row className="align-items-center mt-2">
          <Col xs="auto">
            <Form.Label htmlFor="picker-select" className="mb-0">Tugaskan ke:</Form.Label>
          </Col>
          <Col>
            <Form.Select
              id="picker-select"
              size="sm"
              value={selectedPickerId}
              onChange={(e) => setSelectedPickerId(e.target.value)}
              disabled={loadingPickers}
            >
              <option value="">{loadingPickers ? 'Memuat...' : 'Pilih Picker'}</option>
              {pickers.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
            </Form.Select>
          </Col>
          <Col xs="auto">
            <Button size="sm" onClick={handleAssignPicker}>Tugaskan</Button>
          </Col>
        </Row>
      );
    }
    return (
      <span>
        Ditugaskan ke: <strong>Belum ditugaskan</strong>
      </span>
    );
  };

  return (
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">Detail Picking: {order.nomor_pesanan}</h2>
          <p className="section-subtitle">
            Untuk: {order.nama_pemesan}
          </p>
          <div className="section-subtitle">
            {renderAssignmentSection()}
          </div>
        </div>
        <Button 
          className="btn-accent" 
          onClick={handleCompletePicking}
          disabled={loadingSelesai || order.status !== 'Pending' || hasLowStockIssue}
        >
          {loadingSelesai ? 'Memproses...' : '✅ Selesai Picking'}
        </Button>
      </div>

      {hasLowStockIssue && (
          <Alert variant="danger" className="mb-3">
              Kuantitas Ambil melebihi Stok yang Tersedia! Mohon periksa input Anda.
          </Alert>
      )}

      <h5 className="mt-4">Daftar Barang untuk Diambil:</h5>
      <Table responsive hover className="table-soft table-responsive-cards">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Barang</th>
            <th>Lokasi Gudang</th>
            <th>Rak</th>
            <th>Diminta</th>
            <th>Stok Tersedia</th>
            <th>Kuantitas Ambil</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems?.length > 0 ? (
            order.orderItems.map((detail, index) => (
              <tr key={detail.id}>
                <td data-label="No">{index + 1}</td>
                <td data-label="Nama Barang">{detail.item.nama_barang}</td>
                <td data-label="Lokasi">{detail.item.lokasi || '-'}</td>
                <td data-label="Rak">{detail.item.rak || '-'}</td>
                <td data-label="Diminta">{detail.jumlah}</td>
                <td data-label="Stok Tersedia" style={detail.item.jumlah_stok < detail.jumlah ? { color: '#dc3545', fontWeight: 'bold' } : {}}>
                    {detail.item.jumlah_stok}
                </td>
                <td data-label="Kuantitas Ambil">
                    <Form.Control
                        type="number"
                        size="sm"
                        value={itemsTaken[detail.item_id] ?? ''}
                        onChange={(e) => 
                            handleQuantityChange(
                                detail.item_id, 
                                detail.item.jumlah_stok,
                                e.target.value
                            )
                        }
                        min="0"
                        max={detail.item.jumlah_stok}
                        style={{ width: '100px', display: 'inline-block' }}
                    />
                    {itemsTaken[detail.item_id] > detail.item.jumlah_stok && (
                        <small className="text-danger d-block mt-1">Maks {detail.item.jumlah_stok}</small>
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