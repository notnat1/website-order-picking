import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap'; // <-- Tambah Alert

const EditSupplierModal = ({ show, handleClose, handleUpdate, supplier }) => {
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });

  // --- PERBAIKAN DI SINI ---
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState(null);

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.nama_supplier,
        address: supplier.alamat || '',
        phone: supplier.telepon || ''
      });
    }
    // Reset error saat modal dibuka
    if (show) {
      setModalError(null);
      setIsSaving(false);
    }
  }, [supplier, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validasi input telepon (hanya angka)
    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: onlyNums }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const onSave = async () => { // <-- Buat jadi async
    setModalError(null);
    
    // Validasi Frontend
    if (!formData.name) {
        setModalError('Nama Supplier tidak boleh kosong.');
        return;
    }

    setIsSaving(true);
    
    const dataUntukBackend = {
      id: supplier.id,
      nama_supplier: formData.name,
      alamat: formData.address,
      telepon: formData.phone
    };

    try {
      // Panggil handleUpdate dan tunggu
      await handleUpdate(dataUntukBackend);
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
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Edit Supplier</Modal.Title>
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
              value={formData.name} 
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
              value={formData.address} 
              onChange={handleChange} 
              placeholder="Masukkan alamat"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Telepon</Form.Label>
            <Form.Control 
              type="tel" // <-- Ganti jadi "tel"
              name="phone" 
              value={formData.phone} 
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
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSupplierModal;