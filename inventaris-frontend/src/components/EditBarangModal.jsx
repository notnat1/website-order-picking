import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap'; // <-- Tambah Alert

const EditBarangModal = ({ show, handleClose, handleSave, item }) => {
  const [nama_barang, setNamaBarang] = useState('');
  const [jumlah_stok, setJumlahStok] = useState('');
  const [kondisi, setKondisi] = useState('');
  const [spesifikasi, setSpesifikasi] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [sumber_dana, setSumberDana] = useState('');

  // --- PERBAIKAN DI SINI ---
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState(null);
  
  // useEffect ini PENTING untuk mengisi form
  useEffect(() => {
    if (item) {
      setNamaBarang(item.nama_barang);
      setJumlahStok(item.jumlah_stok);
      setKondisi(item.kondisi);
      setSpesifikasi(item.spesifikasi || '');
      setLokasi(item.lokasi || '');
      setSumberDana(item.sumber_dana || '');
    }
    
    // Saat modal berganti item (atau ditutup lalu dibuka), reset error
    if (show) {
        setModalError(null);
        setIsSaving(false);
    }
  }, [item, show]); // "Pantau" prop 'item' dan 'show'

  const onSave = async () => { // <-- Buat jadi async
    // Validasi Frontend dulu
    if (!nama_barang || jumlah_stok === '' || !kondisi) {
      setModalError('Nama Barang, Stok, dan Kondisi tidak boleh kosong.');
      return;
    }

    const stokInt = parseInt(jumlah_stok, 10);
    if (stokInt < 0) {
      setModalError('Jumlah stok tidak boleh negatif.');
      return;
    }
    
    setIsSaving(true);
    setModalError(null);

    try {
      // Kirim object
      await handleSave({
        id: item.id, // <-- PENTING: Sertakan ID untuk update
        nama_barang: nama_barang,
        jumlah_stok: stokInt,
        kondisi: kondisi,
        spesifikasi: spesifikasi,
        lokasi: lokasi,
        sumber_dana: sumber_dana
      });
      
      // Jika handleSave SUKSES, Parent (BarangPage) akan menutup modal.
      
    } catch (error) {
      // Jika handleSave GAGAL (throw error), tangkap di sini
      setModalError(error.message);
      // JANGAN RESET FORM
    } finally {
      setIsSaving(false);
    }
    // --- AKHIR PERBAIKAN ---
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Barang</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        {/* Tampilkan error di DALAM modal */}
        {modalError && <Alert variant="danger">{modalError}</Alert>}

        <Form>
          {/* ... (Semua Form.Group SAMA PERSIS dengan AddBarangModal) ... */}
          <Form.Group className="mb-3" controlId="editBarangName">
            <Form.Label>Nama Barang <span className="text-danger">*</span></Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Masukkan nama barang" 
              value={nama_barang}
              onChange={(e) => setNamaBarang(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="editBarangStock">
            <Form.Label>Stok <span className="text-danger">*</span></Form.Label>
            <Form.Control 
              type="number" 
              placeholder="Masukkan jumlah stok" 
              value={jumlah_stok}
              onChange={(e) => setJumlahStok(e.target.value)}
              min="0" // <-- Ini juga penting
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="editBarangKondisi">
            <Form.Label>Kondisi <span className="text-danger">*</span></Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Contoh: Baru, Bekas, Rusak Ringan" 
              value={kondisi}
              onChange={(e) => setKondisi(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="editBarangSpesifikasi">
            <Form.Label>Spesifikasi</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Contoh: Kayu Jati, Plastik" 
              value={spesifikasi}
              onChange={(e) => setSpesifikasi(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="editBarangLokasi">
            <Form.Label>Lokasi</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Contoh: Gudang A, Ruang Kelas X" 
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="editBarangSumberDana">
            <Form.Label>Sumber Dana</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Contoh: BOS, Komite" 
              value={sumber_dana}
              onChange={(e) => setSumberDana(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Batal
        </Button>
        <Button variant="primary" onClick={onSave} disabled={isSaving}>
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditBarangModal;