import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import AddBarangModal from '../components/AddBarangModal';
import EditBarangModal from '../components/EditBarangModal';

const BarangPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/items');
      setItems(response.data);
      setError(null);
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data barang.');
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseEditModal = () => { setShowEditModal(false); setSelectedItem(null); };
  const handleShowEditModal = (item) => { setSelectedItem(item); setShowEditModal(true); };

  const handleSaveBarang = async (newItem) => {
    const promise = axios.post('/items', newItem);
    await toast.promise(promise, {
      loading: 'Menyimpan barang...',
      success: 'Barang berhasil ditambahkan!',
      error: (err) => err.response?.data?.error || 'Gagal menyimpan data.',
    });
    handleCloseAddModal();
    fetchItems();
  };

  const handleUpdateBarang = async (updatedItem) => {
    const promise = axios.put(`/items/${updatedItem.id}`, updatedItem);
    await toast.promise(promise, {
      loading: 'Memperbarui barang...',
      success: 'Barang berhasil diperbarui!',
      error: (err) => err.response?.data?.error || 'Gagal memperbarui data.',
    });
    handleCloseEditModal();
    fetchItems();
  };

  const handleDeleteBarang = async (itemId) => {
    if (window.confirm('Apakah Anda yakin ingin menonaktifkan barang ini?')) {
      const promise = axios.delete(`/items/${itemId}`);
      await toast.promise(promise, {
        loading: 'Menonaktifkan barang...',
        success: 'Barang berhasil dinonaktifkan!',
        error: (err) => err.response?.data?.error || 'Gagal menonaktifkan data.',
      });
      fetchItems();
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
    return <div className="content-card"><Alert variant="danger">{error}</Alert></div>;
  }

  return (
    <div className="content-card"> 
      <div className="section-header">
        <div>
          <h2 className="section-title">Data Barang</h2>
          <p className="section-subtitle">Daftar semua barang aktif di gudang.</p>
        </div>
        <Button className="btn-accent" onClick={handleShowAddModal}>
          + Tambah Barang
        </Button>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center p-5 my-5 border-dashed">
          <h4 className="mb-3">Belum Ada Barang</h4>
          <p className="text-light-2 mb-4">Data barang masih kosong.</p>
          <Button className="btn-accent" onClick={handleShowAddModal}>+ Tambah Barang</Button>
        </div>
      ) : (
        <Table responsive hover className="table-soft table-responsive-cards">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Barang</th>
              <th>Kondisi</th>
              <th>Lokasi</th>
              <th>Rak</th>
              <th>Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td data-label="No">{index + 1}</td>
                <td data-label="Nama Barang">{item.nama_barang}</td>
                <td data-label="Kondisi">{item.kondisi}</td>
                <td data-label="Lokasi">{item.lokasi}</td>
                <td data-label="Rak">{item.rak}</td>
                <td data-label="Stok">{item.jumlah_stok}</td>
                <td data-label="Aksi">
                  <div className="action-buttons-row">
                    <Button variant="warning" size="sm" onClick={() => handleShowEditModal(item)}>
                      ✏️ Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteBarang(item.id)}>
                      🗑️ Hapus
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <AddBarangModal show={showAddModal} handleClose={handleCloseAddModal} handleSave={handleSaveBarang} />
      {selectedItem && (
        <EditBarangModal show={showEditModal} handleClose={handleCloseEditModal} handleSave={handleUpdateBarang} item={selectedItem} />
      )}
    </div>
  );
};

export default BarangPage;