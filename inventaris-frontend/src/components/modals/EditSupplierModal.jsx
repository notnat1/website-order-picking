import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';

const EditSupplierModal = ({ show, handleClose, handleUpdate, supplier }) => {
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.nama_supplier,
        address: supplier.alamat || '',
        phone: supplier.telepon || ''
      });
    }
    if (!show) {
      setIsSaving(false);
    }
  }, [supplier, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: onlyNums }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const onSave = async () => {
    if (!formData.name) {
        toast.error('Nama Supplier tidak boleh kosong.');
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
      await handleUpdate(dataUntukBackend);
    } catch (error) {
      // Error is handled by toast.promise in parent
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Supplier</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
              disabled={isSaving}
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
              disabled={isSaving}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Telepon</Form.Label>
            <Form.Control 
              type="tel"
              name="phone" 
              value={formData.phone} 
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
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSupplierModal;