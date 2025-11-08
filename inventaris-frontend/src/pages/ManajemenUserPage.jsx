import React, { useState, useEffect } from 'react'; // <-- Tambah useEffect
import axios from 'axios';
import { Form, Button, Row, Col, Alert, Spinner, Table } from 'react-bootstrap'; // <-- Tambah Table

const ManajemenUserPage = () => {
  // State untuk Form
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState('gudang');
  
  const [loadingForm, setLoadingForm] = useState(false);
  const [errorForm, setErrorForm] = useState(null);
  const [successForm, setSuccessForm] = useState(null);

  // --- STATE BARU UNTUK TABEL ---
  const [users, setUsers] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [errorTable, setErrorTable] = useState(null);

  // --- FUNGSI BARU: Mengambil daftar user ---
  const fetchUsers = async () => {
    setLoadingTable(true);
    setErrorTable(null);
    try {
      const response = await axios.get('/auth/users');
      setUsers(response.data);
    } catch (err) {
      setErrorTable('Gagal memuat daftar user.');
    } finally {
      setLoadingTable(false);
    }
  };

  // Ambil data saat halaman pertama kali dibuka
  useEffect(() => {
    fetchUsers();
  }, []); // <-- [] artinya hanya jalan sekali

  // Fungsi untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    setErrorForm(null);
    setSuccessForm(null);

    const payload = { nama, username, password, level };

    try {
      const response = await axios.post('/auth/register', payload);
      setSuccessForm(`User '${response.data.userId}' (username: ${username}) berhasil dibuat!`);
      // Reset form
      setNama('');
      setUsername('');
      setPassword('');
      setLevel('gudang');
      
      // -- PENTING: Muat ulang tabel setelah sukses --
      fetchUsers(); 
      
    } catch (err) {
      setErrorForm(err.response?.data?.error || 'Gagal membuat user baru.');
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">Manajemen User</h2>
          <p className="section-subtitle">Mendaftarkan dan melihat akun karyawan.</p>
        </div>
      </div>

      <Row>
        {/* --- KOLOM KIRI: FORM --- */}
        <Col md={5}>
          <div className="sub-card">
            <h5>Buat Akun Baru</h5>
            {errorForm && <Alert variant="danger" onClose={() => setErrorForm(null)} dismissible>{errorForm}</Alert>}
            {successForm && <Alert variant="success" onClose={() => setSuccessForm(null)} dismissible>{successForm}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nama Lengkap Karyawan</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Cth: Budi Gudang"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Username (untuk login)</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Cth: budi.gudang"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password Sementara</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Level Akun</Form.Label>
                <Form.Select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option value="gudang">Gudang (Picker)</option>
                  <option value="manajemen">Manajemen (Admin)</option>
                </Form.Select>
              </Form.Group>
              
              <Button className="btn-accent w-100" type="submit" disabled={loadingForm}>
                {loadingForm ? <Spinner animation="border" size="sm" /> : "Daftarkan User"}
              </Button>
            </Form>
          </div>
        </Col>

        {/* --- KOLOM KANAN: TABEL USER --- */}
        <Col md={7}>
          <div className="sub-card">
            <h5>Daftar User Aktif</h5>
            {errorTable && <Alert variant="danger">{errorTable}</Alert>}
            
            {loadingTable ? (
              <p>Memuat daftar user...</p>
            ) : (
              <Table responsive hover className="table-soft">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Username</th>
                    <th>Level</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.nama}</td>
                        <td>{user.username}</td>
                        <td>{user.level}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">Belum ada user terdaftar.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ManajemenUserPage;