import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';

const AddSupplierModal = ({ show, handleClose, handleSave }) => {
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    address: '',
    phone: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setNewSupplier(prev => ({ ...prev, [name]: onlyNums }));
    } else {
      setNewSupplier(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setNewSupplier({ name: '', address: '', phone: '' });
    setIsSaving(false);
  };
  
  useEffect(() => {
    if (!show) {
      setTimeout(resetForm, 300);
    }
  }, [show]);

  const onSave = async () => {
      if (!newSupplier.name) {
          toast.error('Nama Supplier tidak boleh kosong.');
          return;
      }
      
      setIsSaving(true);
      
      const dataUntukBackend = {
        nama_supplier: newSupplier.name,
        alamat: newSupplier.address,
        telepon: newSupplier.phone
      };

      try {
        await handleSave(dataUntukBackend); 
      } catch (error) {
        // Error is handled by toast.promise in parent
      } finally {
        setIsSaving(false);
      }
    };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Tambah Supplier Baru</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
              disabled={isSaving}
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
              disabled={isSaving}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Telepon</Form.Label>
            <Form.Control 
              type="tel"
              name="phone" 
              value={newSupplier.phone} 
              onChange={handleChange} 
              placeholder="Masukkan nomor telepon"
              maxLength="15"
              disabled={isSaving}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isSaving}>
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