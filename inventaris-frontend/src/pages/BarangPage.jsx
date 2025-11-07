import React, { useState, useEffect } from 'react';
import axios from 'axios'; // <-- Tetap impor axios
import { Table, Button, Alert } from 'react-bootstrap';
import AddBarangModal from '../components/AddBarangModal';
import EditBarangModal from '../components/EditBarangModal';

const BarangPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // --- SEMUA LOGIKA LAMA KAMU (AMAN) ---
  const fetchItems = async () => {
    try {
      setLoading(true);
      
      // LAMA: const response = await axios.get('http://localhost:5001/api/items');
      // BARU: (baseURL dan Token sudah di-handle oleh AuthContext)
      const response = await axios.get('/items'); // <-- DIUBAH
      
      setItems(response.data);
      setError(null);
    } catch (err) {
      // Jika token expired atau tidak valid (401 Unauthorized), AuthContext
      // idealnya akan me-redirect ke login. Tapi kita juga bisa tangani error di sini.
      const message = err.response?.data?.error || 'Terjadi kesalahan saat mengambil data barang.';
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedItem(null);
  };

  const handleShowEditModal = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleSaveBarang = async (newItem) => {
    try {
      // LAMA: await axios.post('http://localhost:5001/api/items', newItem);
      // BARU:
      await axios.post('/items', newItem); // <-- DIUBAH
      
      handleCloseAddModal();
      fetchItems(); // Refresh data
    } catch (err) {
      const message = err.response?.data?.error || 'Gagal menyimpan data barang baru.';
      setError(message);
      console.error(err);
    }
  };

  const handleUpdateBarang = async (updatedItem) => {
    try {
      // LAMA: await axios.put(`http://localhost:5001/api/items/${updatedItem.id}`, updatedItem);
      // BARU:
      await axios.put(`/items/${updatedItem.id}`, updatedItem); // <-- DIUBAH
      
      handleCloseEditModal();
      fetchItems(); // Refresh data
    } catch (err) {
      const message = err.response?.data?.error || 'Gagal memperbarui data barang.';
      setError(message);
      console.error(err);
    }
  };

  const handleDeleteBarang = async (itemId) => {
    if (window.confirm('Apakah Anda yakin ingin menonaktifkan barang ini?')) {
      try {
        // LAMA: await axios.delete(`http://localhost:5001/api/items/${itemId}`);
        // BARU:
        await axios.delete(`/items/${itemId}`); // <-- DIUBAH
        
        fetchItems(); // Refresh data
      } catch (err) {
        const message = err.response?.data?.error || 'Gagal menonaktifkan data barang.';
        setError(message);
        console.error(err);
      }
    }
  };
  // --- AKHIR DARI LOGIKA LAMA ---


  // --- BAGIAN JSX (TIDAK ADA PERUBAHAN) ---
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
      
      {loading && <p>Loading...</p>}
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      
      {!loading && !error && (
        <Table responsive hover className="table-soft">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Barang</th>
              <th>Kondisi</th>
              <th>Lokasi</th>
              <th>Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.nama_barang}</td>
                  <td>{item.kondisi}</td>
                  <td>{item.lokasi}</td>
                  <td>{item.jumlah_stok}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowEditModal(item)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteBarang(item.id)}>Hapus</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">Data barang masih kosong.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <AddBarangModal 
        show={showAddModal}
        handleClose={handleCloseAddModal}
        handleSave={handleSaveBarang}
      />

      {selectedItem && (
        <EditBarangModal 
          show={showEditModal}
          handleClose={handleCloseEditModal}
          handleSave={handleUpdateBarang}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default BarangPage;