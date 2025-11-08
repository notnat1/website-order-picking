import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap'; // <-- Tambah Alert & useEffect

const AddSupplierModal = ({ show, handleClose, handleSave }) => {
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    address: '',
    phone: ''
  });

  // --- PERBAIKAN DI SINI ---
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validasi input telepon (hanya angka)
    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setNewSupplier(prev => ({ ...prev, [name]: onlyNums }));
    } else {
      setNewSupplier(prev => ({ ...prev, [name]: value }));
    }
  };

  // Fungsi reset
  const resetForm = () => {
    setNewSupplier({ name: '', address: '', phone: '' });
    setModalError(null);
    setIsSaving(false);
  };
  
  // Reset form saat modal ditutup
  useEffect(() => {
    if (!show) {
      setTimeout(resetForm, 300);
    }
  }, [show]);

  const onSave = async () => { // <-- Buat jadi async
      setModalError(null);
      
      // Validasi Frontend
      if (!newSupplier.name) {
          setModalError('Nama Supplier tidak boleh kosong.');
          return;
      }
      
      setIsSaving(true);
      
      const dataUntukBackend = {
        nama_supplier: newSupplier.name,
        alamat: newSupplier.address,
        telepon: newSupplier.phone
      };

      try {
        // Panggil handleSave dan tunggu
        await handleSave(dataUntukBackend); 
        // Jika sukses, parent akan menutup modal
      } catch (error) {
        // Jika gagal, tangkap error dan tampilkan
        setModalError(error.message);
      } finally {
        setIsSaving(false);
      }
    };
  // --- AKHIR PERBAIKAN ---

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tambah Supplier Baru</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      
        {/* Tampilkan error di DALAM modal */}
        {modalError && <Alert variant="danger">{modalError}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nama Supplier <span className="text-danger">*</span></Form.Label>
            <Form.Control 
              type="text" 
              name="name" 
              value={newSupplier.name} 
              onChange={handleChange} 
              placeholder="Masukkan nama supplier"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Alamat</Form.Label>
            <Form.Control 
              type="text" 
              name="address" 
              value={newSupplier.address} 
              onChange={handleChange} 
              placeholder="Masukkan alamat"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Telepon</Form.Label>
            <Form.Control 
              type="tel" // <-- Ganti jadi "tel"
              name="phone" 
              value={newSupplier.phone} 
              onChange={handleChange} 
              placeholder="Masukkan nomor telepon"
              maxLength="15"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Batal
        </Button>
        <Button variant="primary" onClick={onSave} disabled={isSaving}>
          {isSaving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSupplierModal;