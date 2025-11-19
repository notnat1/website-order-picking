import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';

const EditBarangModal = ({ show, handleClose, handleSave, item }) => {
  const [nama_barang, setNamaBarang] = useState('');
  const [jumlah_stok, setJumlahStok] = useState('');
  const [kondisi, setKondisi] = useState('');
  const [spesifikasi, setSpesifikasi] = useState('');
  const [lokasi, setLokasi] = useState('');
    const [sumber_dana, setSumberDana] = useState('');
    const [rak, setRak] = useState('');
    const [isSaving, setIsSaving] = useState(false);
  
  // useEffect ini PENTING untuk mengisi form
  useEffect(() => {
    if (item) {
      setNamaBarang(item.nama_barang);
      setJumlahStok(item.jumlah_stok);
      setKondisi(item.kondisi);
      setSpesifikasi(item.spesifikasi || '');
      setLokasi(item.lokasi || '');
      setSumberDana(item.sumber_dana || '');
      setRak(item.rak || '');
    }
    
    if (!show) {
        setIsSaving(false);
    }
  }, [item, show]);

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
        id: item.id, // <-- PENTING: Sertakan ID untuk update
        nama_barang,
        jumlah_stok: stokInt,
        kondisi,
        spesifikasi,
        lokasi,
        sumber_dana,
        rak
      });
    } catch (error) {
      // Error already handled by toast.promise in parent
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Barang</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="editBarangName">
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
          <Form.Group className="mb-3" controlId="editBarangStock">
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
          <Form.Group className="mb-3" controlId="editBarangKondisi">
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
          <Form.Group className="mb-3" controlId="editBarangSpesifikasi">
            <Form.Label>Spesifikasi</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Contoh: Kayu Jati, Plastik" 
              value={spesifikasi}
              onChange={(e) => setSpesifikasi(e.target.value)}
              disabled={isSaving}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="editBarangLokasi">
            <Form.Label>Lokasi</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Contoh: Gudang A, Ruang Kelas X" 
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              disabled={isSaving}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="editBarangRak">
            <Form.Label>Rak</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Contoh: A1, B2" 
              value={rak}
              onChange={(e) => setRak(e.target.value)}
              disabled={isSaving}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="editBarangSumberDana">
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
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditBarangModal;