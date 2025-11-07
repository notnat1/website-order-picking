// Lokasi file: components/AddBarangModal.jsx
// (VERSI SUDAH DIPERBAIKI)

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddBarangModal = ({ show, handleClose, handleSave }) => {
  // --- LANGKAH 1: Sesuaikan nama state agar mirip database ---
  const [nama_barang, setNamaBarang] = useState('');
  const [jumlah_stok, setJumlahStok] = useState('');
  
  // --- LANGKAH 2: Tambahkan state untuk data yang HILANG ---
  const [kondisi, setKondisi] = useState(''); // <-- Ini WAJIB diisi
  const [spesifikasi, setSpesifikasi] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [sumber_dana, setSumberDana] = useState('');

  const onSave = () => {
    // Cek data wajib
    if (!nama_barang || !jumlah_stok || !kondisi) {
      alert('Nama Barang, Stok, dan Kondisi tidak boleh kosong.');
      return;
    }

    // --- LANGKAH 3: Kirim object dengan key YANG BENAR ---
    handleSave({
      nama_barang: nama_barang,
      jumlah_stok: parseInt(jumlah_stok, 10), // Backend sudah parseInt, tapi ini bagus
      kondisi: kondisi,
      spesifikasi: spesifikasi,
      lokasi: lokasi,
      sumber_dana: sumber_dana
    });

    // Reset form
    setNamaBarang('');
    setJumlahStok('');
    setKondisi('');
    setSpesifikasi('');
    setLokasi('');
    setSumberDana('');
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
            />
          </Form.Group>

          {/* --- FIELD KONDISI (WAJIB) --- */}
          <Form.Group className="mb-3" controlId="formBarangKondisi">
            <Form.Label>Kondisi <span className="text-danger">*</span></Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Contoh: Baru, Bekas, Rusak Ringan" 
              value={kondisi}
              onChange={(e) => setKondisi(e.target.value)}
            />
          </Form.Group>

          {/* --- FIELD OPSIONAL --- */}
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
        <Button variant="primary" onClick={onSave}>
          Simpan
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddBarangModal;