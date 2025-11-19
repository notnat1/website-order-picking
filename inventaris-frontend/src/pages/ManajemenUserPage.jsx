import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, Alert, Spinner, Table } from 'react-bootstrap';
import toast from 'react-hot-toast';

const ManajemenUserPage = () => {
  // State untuk Form
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState('gudang');
  
  const [loadingForm, setLoadingForm] = useState(false);

  // State untuk Tabel
  const [users, setUsers] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [errorTable, setErrorTable] = useState(null);

  const fetchUsers = async () => {
    if (!loadingTable) setLoadingTable(true);
    try {
      const response = await axios.get('/auth/users');
      setUsers(response.data);
      setErrorTable(null);
    } catch (err) {
      setErrorTable('Gagal memuat daftar user.');
      toast.error('Gagal memuat daftar user.');
      console.error(err);
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    const payload = { nama, username, password, level };
    const promise = axios.post('/auth/register', payload);

    await toast.promise(promise, {
      loading: 'Mendaftarkan user...',
      success: () => {
        setNama('');
        setUsername('');
        setPassword('');
        setLevel('gudang');
        fetchUsers(); 
        return "Akun berhasil dibuat!";
      },
      error: (err) => err.response?.data?.error || 'Gagal membuat user baru.',
    });
    setLoadingForm(false);
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    const actionText = newStatus ? 'aktifkan' : 'nonaktifkan';

    const promise = axios.patch(`/auth/users/${userId}/status`, { isActive: newStatus });

    await toast.promise(promise, {
      loading: `Sedang ${actionText} user...`,
      success: () => {
        fetchUsers();
        return `User berhasil di${actionText}!`;
      },
      error: (err) => err.response?.data?.error || `Gagal ${actionText} user.`,
    });
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
        <Col md={5}>
          <div className="sub-card mb-4">
            <h5>Buat Akun Baru</h5>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nama Lengkap Karyawan</Form.Label>
                <Form.Control type="text" placeholder="Cth: Budi Gudang" value={nama} onChange={(e) => setNama(e.target.value)} required disabled={loadingForm} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Username (untuk login)</Form.Label>
                <Form.Control type="text" placeholder="Cth: budi.gudang" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={loadingForm} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password Sementara</Form.Label>
                <Form.Control type="password" placeholder="Minimal 6 karakter" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loadingForm} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Level Akun</Form.Label>
                <Form.Select value={level} onChange={(e) => setLevel(e.target.value)} disabled={loadingForm}>
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

        <Col md={7}>
          <div className="sub-card">
            <h5>Daftar User</h5>
            {errorTable && <Alert variant="danger">{errorTable}</Alert>}
            
            {loadingTable ? (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                <Spinner animation="border" role="status" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center p-4 my-3 border-dashed">
                <h5 className="mb-3">Belum Ada User Terdaftar</h5>
                <p className="text-light-2">Silakan daftarkan user baru menggunakan form di samping.</p>
              </div>
            ) : (
              <Table responsive hover className="table-soft table-responsive-cards">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Username</th>
                    <th>Level</th>
                    <th>Status Akun</th>
                    <th>Tgl Dinonaktifkan</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td data-label="Nama">{user.nama}</td>
                      <td data-label="Username">{user.username}</td>
                      <td data-label="Level">{user.level}</td>
                      <td data-label="Status Akun">
                        <Form.Check 
                          type="switch"
                          id={`user-switch-${user.id}`}
                          checked={user.isActive}
                          onChange={() => handleToggleUserStatus(user.id, user.isActive)}
                          label={user.isActive ? 'Aktif' : 'Non-Aktif'}
                        />
                      </td>
                      <td data-label="Tgl Dinonaktifkan">
                        {user.deactivatedAt ? new Date(user.deactivatedAt).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
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