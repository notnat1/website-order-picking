import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import AddSupplierModal from '../components/modals/AddSupplierModal';
import EditSupplierModal from '../components/modals/EditSupplierModal';

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('/suppliers');
      setSuppliers(response.data);
      setError(null);
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data supplier.');
      console.error(err);
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedSupplier(null);
  };

  const handleShowEditModal = (supplier) => {
    setSelectedSupplier(supplier);
    setShowEditModal(true);
  };

  const handleSaveSupplier = async (newSupplier) => {
    const promise = axios.post('/suppliers', newSupplier);
    await toast.promise(promise, {
      loading: 'Menyimpan supplier...',
      success: 'Supplier berhasil ditambahkan!',
      error: (err) => err.response?.data?.error || 'Gagal menyimpan supplier.',
    });
    fetchSuppliers();
    handleCloseAddModal();
  };

  const handleUpdateSupplier = async (updatedSupplier) => {
    const promise = axios.put(`/suppliers/${updatedSupplier.id}`, updatedSupplier);
    await toast.promise(promise, {
      loading: 'Memperbarui supplier...',
      success: 'Supplier berhasil diperbarui!',
      error: (err) => err.response?.data?.error || 'Gagal mengupdate supplier.',
    });
    fetchSuppliers();
    handleCloseEditModal();
  };

  const handleDeleteSupplier = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menonaktifkan supplier ini?')) {
      const promise = axios.delete(`/suppliers/${id}`);
      await toast.promise(promise, {
        loading: 'Menonaktifkan supplier...',
        success: 'Supplier berhasil dinonaktifkan.',
        error: (err) => err.response?.data?.error || 'Gagal menonaktifkan supplier.',
      });
      fetchSuppliers();
    }
  };

  if (loading) {
    return (
      <div className="content-card d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-card">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">Data Supplier</h2>
          <p className="section-subtitle">Daftar mitra penyedia barang</p>
        </div>
        <Button className="btn-accent" onClick={handleShowAddModal}>
          + Tambah Supplier
        </Button>
      </div>
      
      {suppliers.length === 0 ? (
        <div className="text-center p-5 my-5 border-dashed">
          <h4 className="mb-3">Belum Ada Supplier</h4>
          <p className="text-light-2 mb-4">Data supplier masih kosong. Silakan tambahkan supplier baru.</p>
          <Button className="btn-accent" onClick={handleShowAddModal}>
            + Tambah Supplier
          </Button>
        </div>
      ) : (
        <Table responsive hover className="table-soft table-responsive-cards">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Supplier</th>
              <th>Alamat</th>
              <th>Telepon</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <tr key={supplier.id}>
                <td data-label="No">{index + 1}</td>
                <td data-label="Nama Supplier">{supplier.nama_supplier}</td>
                <td data-label="Alamat">{supplier.alamat}</td>
                <td data-label="Telepon">{supplier.telepon}</td>
                <td data-label="Aksi">
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowEditModal(supplier)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteSupplier(supplier.id)}>Hapus</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <AddSupplierModal 
        show={showAddModal}
        handleClose={handleCloseAddModal}
        handleSave={handleSaveSupplier}
      />

      {selectedSupplier && (
        <EditSupplierModal
          show={showEditModal}
          handleClose={handleCloseEditModal}
          handleUpdate={handleUpdateSupplier}
          supplier={selectedSupplier}
        />
      )}
    </div>
  );
};

export default SupplierPage;