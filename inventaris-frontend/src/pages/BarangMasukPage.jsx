import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import AddBarangMasukModal from '../components/modals/AddBarangMasukModal';

const BarangMasukPage = () => {
  const [barangMasuk, setBarangMasuk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchBarangMasuk = async () => {
    try {
      const response = await axios.get('/barang-masuk');
      setBarangMasuk(response.data);
      setError(null);
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data barang masuk.');
      console.error(err);
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarangMasuk();
  }, []);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleSaveBarangMasuk = async (data) => {
    const promise = axios.post('/barang-masuk', data);
    
    await toast.promise(promise, {
      loading: 'Menyimpan data...',
      success: 'Data barang masuk berhasil ditambahkan!',
      error: (err) => err.response?.data?.error || 'Gagal menyimpan data.',
    });

    fetchBarangMasuk();
    handleCloseModal();
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
          <h2 className="section-title">Data Barang Masuk</h2>
          <p className="section-subtitle">Histori penerimaan barang dari supplier.</p>
        </div>
        <Button className="btn-accent" onClick={handleShowModal}>
          + Tambah Barang Masuk
        </Button>
      </div>

      {barangMasuk.length === 0 ? (
        <div className="text-center p-5 my-5 border-dashed">
          <h4 className="mb-3">Belum Ada Barang Masuk</h4>
          <p className="text-light-2 mb-4">Data barang masuk masih kosong. Silakan tambahkan data baru.</p>
          <Button className="btn-accent" onClick={handleShowModal}>
            + Tambah Barang Masuk
          </Button>
        </div>
      ) : (
        <Table responsive hover className="table-soft table-responsive-cards">
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
            {barangMasuk.map((bm, index) => (
              <tr key={bm.id}>
                <td data-label="No">{index + 1}</td>
                <td data-label="Nama Barang">{bm.item.nama_barang}</td>
                <td data-label="Supplier">{bm.supplier.nama_supplier}</td>
                <td data-label="Jumlah">{bm.jumlah}</td>
                <td data-label="Tanggal Masuk">{new Date(bm.tanggal_masuk).toLocaleDateString()}</td>
              </tr>
            ))}
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