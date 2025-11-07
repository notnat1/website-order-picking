import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
      const response = await axios.get('http://localhost:5001/api/items');
      setItems(response.data);
      setError(null);
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data barang.');
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
      await axios.post('http://localhost:5001/api/items', newItem);
      handleCloseAddModal();
      fetchItems(); // Refresh data
    } catch (err) {
      setError('Gagal menyimpan data barang baru.');
      console.error(err);
    }
  };

  const handleUpdateBarang = async (updatedItem) => {
    try {
      await axios.put(`http://localhost:5001/api/items/${updatedItem.id}`, updatedItem);
      handleCloseEditModal();
      fetchItems(); // Refresh data
    } catch (err) {
      setError('Gagal memperbarui data barang.');
      console.error(err);
    }
  };

  const handleDeleteBarang = async (itemId) => {
    if (window.confirm('Apakah Anda yakin ingin menonaktifkan barang ini?')) {
      try {
        await axios.delete(`http://localhost:5001/api/items/${itemId}`);
        fetchItems(); // Refresh data
      } catch (err) {
        setError('Gagal menonaktifkan data barang.');
        console.error(err);
      }
    }
  };
  // --- AKHIR DARI LOGIKA LAMA ---


  // --- INI BAGIAN JSX YANG DIROMBAK ---
  return (
    // 1. Ganti <Container> dengan <div className="content-card">
    <div className="content-card"> 
      
      {/* 2. Gunakan "section-header" standar */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Data Barang</h2>
          <p className="section-subtitle">Daftar semua barang aktif di gudang.</p>
        </div>
        {/* 3. Gunakan "btn-accent" */}
        <Button className="btn-accent" onClick={handleShowAddModal}>
          + Tambah Barang
        </Button>
      </div>
      
      {loading && <p>Loading...</p>}
      {/* 4. Buat Alert bisa ditutup */}
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      
      {!loading && !error && (
        // 5. Gunakan "table-soft"
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
                  {/* 6. Pastikan key sudah benar */}
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

      {/* 7. Modal tetap di luar tabel */}
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