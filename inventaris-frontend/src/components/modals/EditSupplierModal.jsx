// Lokasi file: src/components/modals/EditSupplierModal.jsx
// (VERSI LENGKAP DAN SUDAH DIPERBAIKI)

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

// 'supplier' adalah prop yang berisi data supplier yang diklik
const EditSupplierModal = ({ show, handleClose, handleUpdate, supplier }) => {
  
  // State untuk form (pakai bahasa frontend: name, address, phone)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });

  // --- INI BAGIAN PENTING (MENGISI FORM) ---
  // useEffect ini akan berjalan setiap kali 'supplier' (datanya) berubah
  useEffect(() => {
    if (supplier) {
      // "Terjemahkan" dari bahasa backend (nama_supplier)
      // ke bahasa frontend (name) saat form di-load
      setFormData({
        name: supplier.nama_supplier,
        address: supplier.alamat || '', // || '' untuk jaga-jaga kalau datanya null
        phone: supplier.telepon || ''
      });
    }
  }, [supplier]); // "Pantau" prop 'supplier'

  // Fungsi untuk update state saat ngetik
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- INI BAGIAN PENTING (MENYIMPAN) ---
  const onSave = () => {
    // "Terjemahkan" kembali dari bahasa frontend (name)
    // ke bahasa backend (nama_supplier) sebelum dikirim
    const dataUntukBackend = {
      id: supplier.id, // <-- JANGAN LUPA ID-nya
      nama_supplier: formData.name,
      alamat: formData.address,
      telepon: formData.phone
    };

    // Panggil fungsi 'handleUpdateSupplier' yang ada di SupplierPage
    handleUpdate(dataUntukBackend);
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Edit Supplier</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Form ini SAMA PERSIS dengan AddSupplierModal */}
          <Form.Group className="mb-3">
            <Form.Label>Nama Supplier</Form.Label>
            <Form.Control 
              type="text" 
              name="name" // <-- pakai bahasa frontend
              value={formData.name} // <-- pakai bahasa frontend
              onChange={handleChange} 
              placeholder="Masukkan nama supplier"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Alamat</Form.Label>
            <Form.Control 
              type="text" 
              name="address" // <-- pakai bahasa frontend
              value={formData.address} // <-- pakai bahasa frontend
              onChange={handleChange} 
              placeholder="Masukkan alamat"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Telepon</Form.Label>
            <Form.Control 
              type="text" 
              name="phone" // <-- pakai bahasa frontend
              value={formData.phone} // <-- pakai bahasa frontend
              onChange={handleChange} 
              placeholder="Masukkan nomor telepon"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Batal
        </Button>
        <Button variant="primary" onClick={onSave}>
          Simpan Perubahan
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSupplierModal;