// Lokasi file: src/pages/BarangMasukPage.jsx
// (VERSI ROMBAK TOTAL)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert } from 'react-bootstrap'; // Hapus Container
import AddBarangMasukModal from '../components/modals/AddBarangMasukModal';

const BarangMasukPage = () => {
  const [barangMasuk, setBarangMasuk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // --- SEMUA LOGIKA LAMA KAMU (AMAN) ---
  const fetchBarangMasuk = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/barang-masuk');
      setBarangMasuk(response.data);
      setError(null);
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data barang masuk.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarangMasuk();
  }, []);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleSaveBarangMasuk = async (data) => {
    try {
      await axios.post('http://localhost:5001/api/barang-masuk', data);
      fetchBarangMasuk();
      handleCloseModal();
    } catch (err) {
      const message = err.response?.data?.error || 'Gagal menyimpan barang masuk.';
      setError(message);
      console.error('Gagal menyimpan barang masuk:', err);
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
          <h2 className="section-title">Data Barang Masuk</h2>
          <p className="section-subtitle">Histori penerimaan barang dari supplier.</p>
        </div>
        {/* 3. Gunakan "btn-accent" */}
        <Button className="btn-accent" onClick={handleShowModal}>
          + Tambah Barang Masuk
        </Button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      {!loading && !error && (
        // 4. Gunakan "table-soft"
        <Table responsive hover className="table-soft">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Barang</th>
              <th>Supplier</th>
              <th>Jumlah</th>
              <th>Tanggal Masuk</th>
            </tr>
          </thead>
          <tbody>
            {barangMasuk.length > 0 ? (
              barangMasuk.map((bm, index) => (
                  <tr key={bm.id}>
                    {/* 5. Pastikan key sudah benar */}
                    <td>{index + 1}</td>
                    <td>{bm.item.nama_barang}</td>
                    <td>{bm.supplier.nama_supplier}</td>
                    <td>{bm.jumlah}</td>
                    <td>{new Date(bm.tanggal_masuk).toLocaleDateString()}</td>
                  </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">Data barang masuk masih kosong.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <AddBarangMasukModal 
        show={showModal} 
        handleClose={handleCloseModal} 
        handleSave={handleSaveBarangMasuk}
      />
    </div>
  );
};

export default BarangMasukPage;