import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddSupplierModal = ({ show, handleClose, handleSave }) => {
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    address: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier(prev => ({ ...prev, [name]: value }));
  };

  // const onSave = () => {
  //   handleSave(newSupplier);
  //   setNewSupplier({ name: '', address: '', phone: '' }); // Reset form
  // };

  const onSave = () => {
      // 1. Buat object baru untuk "diterjemahkan"
      const dataUntukBackend = {
        nama_supplier: newSupplier.name,   // <-- Terjemahkan 'name'
        alamat: newSupplier.address,       // <-- Terjemahkan 'address'
        telepon: newSupplier.phone         // <-- Terjemahkan 'phone'
      };

      // 2. Kirim data yang sudah "diterjemahkan"
      handleSave(dataUntukBackend); 

      // 3. Reset form
      setNewSupplier({ name: '', address: '', phone: '' }); 
    };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tambah Supplier Baru</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nama Supplier</Form.Label>
            <Form.Control 
              type="text" 
              name="name" 
              value={newSupplier.name} 
              onChange={handleChange} 
              placeholder="Masukkan nama supplier"
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
              type="text" 
              name="phone" 
              value={newSupplier.phone} 
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
          Simpan
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSupplierModal;