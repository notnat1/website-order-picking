// Lokasi file: src/pages/BuatPesananPage.jsx
// (VERSI ROMBAK TOTAL)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Form, 
  Button, 
  Row, 
  Col, 
  Table, 
  Alert 
} from 'react-bootstrap'; // Hapus Container

const BuatPesananPage = () => {
  // --- SEMUA LOGIKA LAMA KAMU (AMAN) ---
  const [nama_pemesan, setNamaPemesan] = useState('');
  const [cart, setCart] = useState([]); 
  const [listBarang, setListBarang] = useState([]); 
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedItemJumlah, setSelectedItemJumlah] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/items');
        setListBarang(response.data); 
      } catch (err) {
        setError('Gagal memuat daftar barang.');
      }
    };
    fetchItems();
  }, []);

  const handleAddItemToCart = () => {
    if (!selectedItemId || selectedItemJumlah <= 0) {
      alert("Pilih barang dan masukkan jumlah yang valid.");
      return;
    }
    const itemToAdd = listBarang.find(item => item.id === parseInt(selectedItemId));
    if (!itemToAdd) return;
    if (itemToAdd.jumlah_stok < selectedItemJumlah) {
      alert(`Stok ${itemToAdd.nama_barang} tidak cukup. Sisa stok: ${itemToAdd.jumlah_stok}`);
      return;
    }
    const itemInCart = cart.find(item => item.item_id === itemToAdd.id);
    if (itemInCart) {
      setCart(cart.map(item => 
        item.item_id === itemToAdd.id 
          ? { ...item, jumlah: item.jumlah + parseInt(selectedItemJumlah) } 
          : item
      ));
    } else {
      setCart([
        ...cart,
        {
          item_id: itemToAdd.id,
          nama_barang: itemToAdd.nama_barang,
          jumlah: parseInt(selectedItemJumlah)
        }
      ]);
    }
    setSelectedItemId('');
    setSelectedItemJumlah(1);
T };

  const handleRemoveFromCart = (item_id) => {
    setCart(cart.filter(item => item.item_id !== item_id));
  };

  const handleSubmitOrder = async () => {
    if (!nama_pemesan) {
      setError("Nama pemesan tidak boleh kosong.");
      return;
    }
    if (cart.length === 0) {
      setError("Keranjang pesanan tidak boleh kosong.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    const payload = {
      nama_pemesan: nama_pemesan,
      items: cart.map(item => ({
        item_id: item.item_id,
        jumlah: item.jumlah
      }))
    };
    try {
      const response = await axios.post('http://localhost:5001/api/orders', payload);
      setSuccess(`Pesanan ${response.data.nomor_pesanan} berhasil dibuat!`);
      setNamaPemesan('');
      setCart([]);
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal membuat pesanan.');
    } finally {
      setLoading(false);
    }
  };
  // --- AKHIR DARI LOGIKA LAMA ---


  // --- INI BAGIAN JSX YANG DIROMBAK ---
  return (
    // 1. Ganti <Container> dengan <div className="content-card">
    <div className="content-card">
      
      {/* 2. Gunakan "section-header" standar */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Buat Pesanan Baru</h2>
          <p className="section-subtitle">Buat pesanan baru untuk diteruskan ke tim gudang.</p>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      {/* 3. Gunakan Row & Col untuk layout, tapi bungkus dengan "sub-card" */}
      <Row>
        <Col md={5}>
          {/* 4. Gunakan "sub-card" untuk membungkus form */}
          <div className="sub-card">
            <h5>Detail Pemesan</h5>
            <Form.Group className="mb-3">
              <Form.Label>Nama Pemesan</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Masukkan nama pemesan (cth: Sales Budi)"
                value={nama_pemesan}
                onChange={(e) => setNamaPemesan(e.target.value)}
              />
            </Form.Group>
            
            <hr />
            
            <h5>Tambah Barang ke Pesanan</h5>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Barang</Form.Label>
              <Form.Select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
              >
                <option value="">Pilih Barang...</option>
                {listBarang.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.nama_barang} (Stok: {item.jumlah_stok})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Jumlah</Form.Label>
              <Form.Control 
                type="number" 
                value={selectedItemJumlah}
                onChange={(e) => setSelectedItemJumlah(e.target.value)}
                min="1"
              />
            </Form.Group>
            
            {/* 5. Gunakan "btn-accent" */}
            <Button className="btn-accent w-100" onClick={handleAddItemToCart}>
              + Tambah ke Keranjang
            </Button>
          </div>
        </Col>

        <Col md={7}>
          <div className="sub-card">
            <h5>Keranjang Pesanan</h5>
            {/* 6. Gunakan "table-soft" */}
            <Table responsive hover className="table-soft">
              <thead>
                <tr>
                  <th>Nama Barang</th>
                  <th>Jumlah</th>
                  <th>Aksi</th>
              _ </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center">Keranjang masih kosong.</td>
                  </tr>
                ) : (
                  cart.map((item, index) => (
                    <tr key={index}>
                      <td>{item.nama_barang}</td>
                      <td>{item.jumlah}</td>
                      <td>
                        <Button 
              _               variant="danger" 
                          size="sm"
                          onClick={() => handleRemoveFromCart(item.item_id)}
                        >
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
            <hr />
            <Button 
              variant="primary" 
              className="w-100 btn-accent"
              onClick={handleSubmitOrder}
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Pesanan"}
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default BuatPesananPage;