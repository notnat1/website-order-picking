import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';

const AddBarangModal = ({ show, handleClose, handleSave }) => {
  const [nama_barang, setNamaBarang] = useState('');
  const [jumlah_stok, setJumlahStok] = useState('');
  const [kondisi, setKondisi] = useState('');
  const [spesifikasi, setSpesifikasi] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [sumber_dana, setSumberDana] = useState('');
  const [rak, setRak] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fungsi untuk mereset form
  const resetForm = () => {
    setNamaBarang('');
    setJumlahStok('');
    setKondisi('');
    setSpesifikasi('');
    setLokasi('');
    setSumberDana('');
    setRak('');
    setIsSaving(false);
  };

  // Saat modal ditutup, reset form
  useEffect(() => {
    if (!show) {
      setTimeout(resetForm, 300);
    }
  }, [show]);

  const onSave = async () => {
    // Validasi Frontend dulu
    if (!nama_barang || jumlah_stok === '' || !kondisi) {
      toast.error('Nama Barang, Stok, dan Kondisi tidak boleh kosong.');
      return;
    }

    const stokInt = parseInt(jumlah_stok, 10);
    if (isNaN(stokInt) || stokInt < 0) {
      toast.error('Jumlah stok harus angka positif.');
      return;
    }
    
    setIsSaving(true);

    try {
      await handleSave({
        nama_barang,
        jumlah_stok: stokInt,
        kondisi,
        spesifikasi,
        lokasi,
        sumber_dana,
        rak
      });
    } catch (error) {
      // Error already handled by toast.promise in parent, but we stop the saving state.
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Tambah Barang Baru</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
              disabled={isSaving}
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
              min="0"
              required
              disabled={isSaving}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBarangKondisi">
            <Form.Label>Kondisi <span className="text-danger">*</span></Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Contoh: Baru, Bekas, Rusak Ringan" 
              value={kondisi}
              onChange={(e) => setKondisi(e.target.value)}
              required
              disabled={isSaving}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBarangSpesifikasi">
            <Form.Label>Spesifikasi</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Contoh: Kayu Jati, Plastik" 
              value={spesifikasi}
              onChange={(e) => setSpesifikasi(e.target.value)}
              disabled={isSaving}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBarangLokasi">
            <Form.Label>Lokasi</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Contoh: Gudang A, Ruang Kelas X" 
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              disabled={isSaving}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBarangRak">
            <Form.Label>Rak</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Contoh: A1, B2" 
              value={rak}
              onChange={(e) => setRak(e.target.value)}
              disabled={isSaving}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBarangSumberDana">
            <Form.Label>Sumber Dana</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Contoh: BOS, Komite" 
              value={sumber_dana}
              onChange={(e) => setSumberDana(e.target.value)}
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
          {isSaving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddBarangModal;