import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap'; // <-- Tambah Alert

const AddBarangModal = ({ show, handleClose, handleSave }) => {
  const [nama_barang, setNamaBarang] = useState('');
  const [jumlah_stok, setJumlahStok] = useState('');
  const [kondisi, setKondisi] = useState('');
  const [spesifikasi, setSpesifikasi] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [sumber_dana, setSumberDana] = useState('');

  // --- PERBAIKAN DI SINI ---
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Fungsi untuk mereset form
  const resetForm = () => {
    setNamaBarang('');
    setJumlahStok('');
    setKondisi('');
    setSpesifikasi('');
    setLokasi('');
    setSumberDana('');
    setModalError(null);
    setIsSaving(false);
  };

  // Saat modal ditutup, reset form
  useEffect(() => {
    if (!show) {
      // Beri sedikit jeda agar user tidak lihat form-nya reset sebelum animasi tutup
      setTimeout(resetForm, 300);
    }
  }, [show]);

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
        nama_barang: nama_barang,
        jumlah_stok: stokInt,
        kondisi: kondisi,
        spesifikasi: spesifikasi,
        lokasi: lokasi,
        sumber_dana: sumber_dana
      });
      
      // Jika handleSave SUKSES, dia tidak akan throw error.
      // Parent (BarangPage) akan menutup modal.
      // Kita tidak perlu reset form di sini, karena sudah di-handle useEffect [show]
      
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
        <Modal.Title>Tambah Barang Baru</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
        {/* Tampilkan error di DALAM modal */}
        {modalError && <Alert variant="danger">{modalError}</Alert>}

        <Form>
          {/* --- FIELD NAMA BARANG (WAJIB) --- */}
          <Form.Group className="mb-3" controlId="formBarangName">
            <Form.Label>Nama Barang <span className="text-danger">*</span></Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Masukkan nama barang" 
              value={nama_barang}
              onChange={(e) => setNamaBarang(e.target.value)}
              required
            />
          </Form.Group>

          {/* --- FIELD STOK (WAJIB) --- */}
          <Form.Group className="mb-3" controlId="formBarangStock">
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

          {/* ... (Form group lainnya tidak berubah) ... */}
          <Form.Group className="mb-3" controlId="formBarangKondisi">
            <Form.Label>Kondisi <span className="text-danger">*</span></Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Contoh: Baru, Bekas, Rusak Ringan" 
              value={kondisi}
              onChange={(e) => setKondisi(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBarangSpesifikasi">
            <Form.Label>Spesifikasi</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Contoh: Kayu Jati, Plastik" 
              value={spesifikasi}
              onChange={(e) => setSpesifikasi(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBarangLokasi">
            <Form.Label>Lokasi</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Contoh: Gudang A, Ruang Kelas X" 
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBarangSumberDana">
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
          {isSaving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddBarangModal;