import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert } from 'react-bootstrap';
import AddSupplierModal from '../components/modals/AddSupplierModal';
import EditSupplierModal from '../components/modals/EditSupplierModal';

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Ini error halaman
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/suppliers'); // Path sudah benar
      setSuppliers(response.data);
      setError(null);
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data supplier.');
      console.error(err);
    } finally {
      setLoading(false);
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

  // --- PERBAIKAN DI SINI ---
  const handleSaveSupplier = async (newSupplier) => {
    try {
      await axios.post('/suppliers', newSupplier);
      fetchSuppliers();
      handleCloseAddModal();
    } catch (err) {
      // Lempar error agar bisa ditangkap oleh Modal
      throw new Error(err.response?.data?.error || 'Gagal menyimpan supplier baru.');
    }
  };

  // --- PERBAIKAN DI SINI ---
  const handleUpdateSupplier = async (updatedSupplier) => {
    try {
      await axios.put(`/suppliers/${updatedSupplier.id}`, updatedSupplier);
      fetchSuppliers();
      handleCloseEditModal();
    } catch (err) {
      // Lempar error agar bisa ditangkap oleh Modal
      throw new Error(err.response?.data?.error || 'Gagal mengupdate supplier.');
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menonaktifkan supplier ini?')) {
      try {
        await axios.delete(`/suppliers/${id}`);
        fetchSuppliers();
      } catch (err) {
        setError('Gagal menonaktifkan supplier.');
        console.error("Gagal menghapus supplier:", err);
      }
    }
  };
  // --- AKHIR PERBAIKAN ---

  // ... (JSX return tidak berubah)
  return (
    <div className="content-card">
      
      <div className="section-header">
        <div>
          <div className="section-title">Data Supplier</div>
          <div className="section-subtitle">Daftar mitra penyedia barang</div>
        </div>
        <Button className="btn-accent" onClick={handleShowAddModal}>
          + Tambah Supplier
        </Button>
      </div>
      
      {loading && <p>Loading...</p>}
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      
      {!loading && !error && (
        <Table responsive hover className="table-soft">
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
            {suppliers.length > 0 ? (
              suppliers.map((supplier, index) => (
                <tr key={supplier.id}>
                  <td>{index + 1}</td>
                  <td>{supplier.nama_supplier}</td>
                  <td>{supplier.alamat}</td>
                  <td>{supplier.telepon}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowEditModal(supplier)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteSupplier(supplier.id)}>Hapus</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">Data supplier masih kosong.</td>
              </tr>
            )}
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