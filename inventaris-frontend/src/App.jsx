import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Impor Halaman
import DashboardPage from './pages/DashboardPage';
import BarangPage from './pages/BarangPage';
import SupplierPage from './pages/SupplierPage';
import BarangMasukPage from './pages/BarangMasukPage';
import BuatPesananPage from './pages/BuatPesananPage';
import TugasPickingPage from './pages/TugasPickingPage';
import PickingDetailPage from './pages/PickingDetailPage';
import LoginPage from './pages/LoginPage';
import ManajemenUserPage from './pages/ManajemenUserPage';
import HistoriPesananPage from './pages/HistoriPesananPage';
import CetakPesananPage from './pages/CetakPesananPage'; // <-- 1. IMPOR HALAMAN CETAK

function App() {
  return (
    <Routes>
      
      {/* RUTE PUBLIK (Login) */}
      <Route path="/login" element={<LoginPage />} />

      {/* RUTE UTAMA (Pake Sidebar/Layout) */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} /> 
        <Route path="barang" element={<BarangPage />} />
        <Route path="supplier" element={<SupplierPage />} />
        <Route path="barang-masuk" element={<BarangMasukPage />} />
        <Route path="buat-pesanan" element={<BuatPesananPage />} />
        <Route path="tugas-picking" element={<TugasPickingPage />} />
        <Route path="tugas-picking/:id" element={<PickingDetailPage />} />
        <Route path="manajemen-user" element={<ManajemenUserPage />} />
        <Route path="histori-pesanan" element={<HistoriPesananPage />} />

        <Route path="*" element={
          <div className="content-card">
            <h2>404 - Halaman Tidak Ditemukan</h2>
          </div>
        } />
      </Route>

      {/* 2. RUTE BARU (Terproteksi, TAPI TANPA Sidebar) */}
      <Route 
        path="/cetak/pesanan/:id" 
        element={
          <ProtectedRoute>
            <CetakPesananPage />
          </ProtectedRoute>
        } 
      />

    </Routes>
  );
}

export default App;