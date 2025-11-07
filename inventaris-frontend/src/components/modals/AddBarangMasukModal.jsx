// Lokasi file: components/modals/AddBarangMasukModal.jsx
// (VERSI LENGKAP DAN SUDAH DIPERBAIKI)

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const AddBarangMasukModal = ({ show, handleClose, handleSave }) => {
  // --- State untuk form input ---
  const [item_id, setItemId] = useState('');
  const [supplier_id, setSupplierId] = useState('');
  const [jumlah, setJumlah] = useState('');

  // --- State untuk data dropdown ---
  const [listBarang, setListBarang] = useState([]);
  const [listSupplier, setListSupplier] = useState([]);

  // --- State untuk loading & error ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ini akan berjalan SETIAP KALI modal dibuka (prop 'show' berubah jadi true)
  useEffect(() => {
    if (show) {
      // Panggil fungsi untuk mengambil data dropdown
      fetchDropdownData();
    }
  }, [show]); // "Pantau" prop 'show'

  // Fungsi untuk mengambil data dari backend
  const fetchDropdownData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Kita panggil 2 API sekaligus
      const [barangRes, supplierRes] = await Promise.all([
        axios.get('http://localhost:5001/api/items'),
        axios.get('http://localhost:5001/api/suppliers')
      ]);
      
      setListBarang(barangRes.data);
      setListSupplier(supplierRes.data);

    } catch (err) {
      setError("Gagal memuat data barang/supplier. Coba tutup dan buka lagi modal.");
      console.error("Error fetchDropdownData:", err);
    } finally {
      setLoading(false);
    }
  };

  const onSave = () => {
    // Validasi
    if (!item_id || !supplier_id || !jumlah || parseInt(jumlah) <= 0) {
      alert('Lengkapi semua field dan jumlah harus lebih dari 0.');
      return;
    }

    // Kirim data dengan KEY yang BENAR (sesuai schema.prisma)
    handleSave({
      item_id: parseInt(item_id),
      supplier_id: parseInt(supplier_id),
      jumlah: parseInt(jumlah)
    });

    // Reset form
    setItemId('');
    setSupplierId('');
    setJumlah('');
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Tambah Barang Masuk</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Tampilkan error jika gagal load dropdown */}
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form>
          {/* --- Dropdown Barang --- */}
          <Form.Group className="mb-3">
            <Form.Label>Barang</Form.Label>
            <Form.Select 
              value={item_id} 
              onChange={(e) => setItemId(e.target.value)}
              disabled={loading}
            >
              <option value="">{loading ? 'Memuat...' : 'Pilih Barang'}</option>
              
              {/* LOOPING data dari state 'listBarang' */}
              {listBarang.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama_barang} (Stok: {item.jumlah_stok})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* --- Dropdown Supplier --- */}
          <Form.Group className="mb-3">
            <Form.Label>Supplier</Form.Label>
            <Form.Select 
              value={supplier_id} 
              onChange={(e) => setSupplierId(e.target.value)}
              disabled={loading}
            >
              <option value="">{loading ? 'Memuat...' : 'Pilih Supplier'}</option>
              
              {/* LOOPING data dari state 'listSupplier' */}
              {listSupplier.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.nama_supplier}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* --- Input Jumlah --- */}
          <Form.Group className="mb-3">
            <Form.Label>Jumlah</Form.Label>
            <Form.Control 
              type="number" 
              placeholder="Masukkan jumlah barang masuk" 
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
              min="1"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Batal</Button>
        <Button variant="primary" onClick={onSave} disabled={loading}>
          Simpan
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddBarangMasukModal;