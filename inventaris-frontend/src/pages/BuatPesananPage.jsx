import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Form, 
  Button, 
  Row, 
  Col, 
  Table, 
  Alert,
  Spinner
} from 'react-bootstrap';
import toast from 'react-hot-toast';

const BuatPesananPage = () => {
  const [nama_pemesan, setNamaPemesan] = useState('');
  const [cart, setCart] = useState([]); 
  const [listBarang, setListBarang] = useState([]); 
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedItemJumlah, setSelectedItemJumlah] = useState(1);
  const [loadingItems, setLoadingItems] = useState(true); // Loading state for initial item fetch
  const [errorItems, setErrorItems] = useState(null); // Error state for initial item fetch
  const [submittingOrder, setSubmittingOrder] = useState(false); // Loading state for order submission

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/items'); // Use relative path
        setListBarang(response.data); 
        setErrorItems(null);
      } catch (err) {
        setErrorItems('Gagal memuat daftar barang.');
        console.error(err);
      } finally {
        setLoadingItems(false);
      }
    };
    fetchItems();
  }, []);

  const handleAddItemToCart = () => {
    if (!selectedItemId) {
      toast.error("Pilih barang yang ingin ditambahkan.");
      return;
    }
    if (selectedItemJumlah <= 0) {
      toast.error("Jumlah barang harus lebih dari 0.");
      return;
    }

    const itemToAdd = listBarang.find(item => item.id === parseInt(selectedItemId));
    if (!itemToAdd) {
      toast.error("Barang tidak ditemukan.");
      return;
    }
    if (itemToAdd.jumlah_stok < selectedItemJumlah) {
      toast.error(`Stok ${itemToAdd.nama_barang} tidak cukup. Sisa stok: ${itemToAdd.jumlah_stok}`);
      return;
    }

    const itemInCart = cart.find(item => item.item_id === itemToAdd.id);
    if (itemInCart) {
      const newJumlah = itemInCart.jumlah + parseInt(selectedItemJumlah);
      if (itemToAdd.jumlah_stok < newJumlah) {
        toast.error(`Penambahan melebihi stok. Sisa stok: ${itemToAdd.jumlah_stok}`);
        return;
      }
      setCart(cart.map(item => 
        item.item_id === itemToAdd.id 
          ? { ...item, jumlah: newJumlah } 
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
    toast.success(`${itemToAdd.nama_barang} ditambahkan ke keranjang.`);
 };

  const handleRemoveFromCart = (item_id) => {
    setCart(cart.filter(item => item.item_id !== item_id));
    toast.success("Barang dihapus dari keranjang.");
  };

  const handleSubmitOrder = async () => {
    if (!nama_pemesan) {
      toast.error("Nama pemesan tidak boleh kosong.");
      return;
    }
    if (cart.length === 0) {
      toast.error("Keranjang pesanan tidak boleh kosong.");
      return;
    }
    setSubmittingOrder(true);
    const payload = {
      nama_pemesan: nama_pemesan,
      items: cart.map(item => ({
        item_id: item.item_id,
        jumlah: item.jumlah
      }))
    };

    const promise = axios.post('/orders', payload); // Use relative path

    await toast.promise(promise, {
      loading: 'Membuat pesanan...',
      success: (res) => {
        setNamaPemesan('');
        setCart([]);
        return `Pesanan ${res.data.nomor_pesanan} berhasil dibuat!`;
      },
      error: (err) => err.response?.data?.error || 'Gagal membuat pesanan.',
    });
    setSubmittingOrder(false);
  };

  if (loadingItems) {
    return (
      <div className="content-card d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (errorItems) {
    return (
      <div className="content-card">
        <Alert variant="danger">{errorItems}</Alert>
      </div>
    );
  }

  return (
    <div className="content-card">
      
      <div className="section-header">
        <div>
          <h2 className="section-title">Buat Pesanan Baru</h2>
          <p className="section-subtitle">Buat pesanan baru untuk diteruskan ke tim gudang.</p>
        </div>
      </div>

      <Row>
        <Col md={5}>
          <div className="sub-card">
            <h5>Detail Pemesan</h5>
            <Form.Group className="mb-3">
              <Form.Label>Nama Pemesan</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Masukkan nama pemesan (cth: Sales Budi)"
                value={nama_pemesan}
                onChange={(e) => setNamaPemesan(e.target.value)}
                disabled={submittingOrder}
              />
            </Form.Group>
            
            <hr />
            
            <h5>Tambah Barang ke Pesanan</h5>
            {listBarang.length === 0 ? (
              <Alert variant="info">Tidak ada barang tersedia untuk dipesan.</Alert>
            ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Pilih Barang</Form.Label>
                  <Form.Select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    disabled={submittingOrder}
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
                    disabled={submittingOrder}
                  />
                </Form.Group>
                
                <Button className="btn-accent w-100" onClick={handleAddItemToCart} disabled={submittingOrder}>
                  + Tambah ke Keranjang
                </Button>
              </>
            )}
          </div>
        </Col>

        <Col md={7}>
          <div className="sub-card">
            <h5>Keranjang Pesanan</h5>
            {cart.length === 0 ? (
              <div className="text-center p-5 my-5 border-dashed">
                <h4 className="mb-3">Keranjang Kosong</h4>
                <p className="text-light-2 mb-4">Silakan tambahkan barang dari daftar di samping.</p>
              </div>
            ) : (
              <Table responsive hover className="table-soft table-responsive-cards">
                <thead>
                  <tr>
                    <th>Nama Barang</th>
                    <th>Jumlah</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={index}>
                      <td data-label="Nama Barang">{item.nama_barang}</td>
                      <td data-label="Jumlah">{item.jumlah}</td>
                      <td data-label="Aksi">
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleRemoveFromCart(item.item_id)}
                          disabled={submittingOrder}
                        >
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            <hr />
            <Button 
              variant="primary" 
              className="w-100 btn-accent"
              onClick={handleSubmitOrder}
              disabled={submittingOrder || cart.length === 0}
            >
              {submittingOrder ? "Menyimpan..." : "Simpan Pesanan"}
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default BuatPesananPage;