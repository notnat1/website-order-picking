// import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
// Impor Layout Induk
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Impor SEMUA Halaman (Pages)
import DashboardPage from './pages/DashboardPage'; // <-- Impor asli
import BarangPage from './pages/BarangPage';
import SupplierPage from './pages/SupplierPage';
import BarangMasukPage from './pages/BarangMasukPage';
import BuatPesananPage from './pages/BuatPesananPage';
import TugasPickingPage from './pages/TugasPickingPage'; // <-- Impor asli
import PickingDetailPage from './pages/PickingDetailPage'; // <-- Impor detail
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      
      {/* RUTE GRUP 1: HALAMAN PUBLIK (TANPA LAYOUT/SIDEBAR)
        Siapapun bisa mengakses ini.
      */}
      <Route path="/login" element={<LoginPage />} />


      {/* RUTE GRUP 2: HALAMAN PRIBADI (WAJIB LOGIN & PAKAI LAYOUT)
        Dibungkus oleh "Satpam" ProtectedRoute.
      */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute> {/* <-- SATPAM JAGA DI SINI */}
            <Layout />     {/* <-- Jika lolos, tampilkan Layout (Sidebar, Header, dll) */}
          </ProtectedRoute>
        }
      >
        {/* Semua rute di bawah ini adalah "Anak" dari Layout.
          Mereka akan di-render di dalam <Outlet /> di Layout.jsx 
        */}
        <Route index element={<DashboardPage />} /> 
        
        <Route path="barang" element={<BarangPage />} />
        <Route path="supplier" element={<SupplierPage />} />
        <Route path="barang-masuk" element={<BarangMasukPage />} />
        <Route path="buat-pesanan" element={<BuatPesananPage />} />
        
        <Route path="tugas-picking" element={<TugasPickingPage />} />
        <Route path="tugas-picking/:id" element={<PickingDetailPage />} />

        {/* Rute "Not Found" di dalam aplikasi */}
        <Route path="*" element={
          <div className="content-card">
            <h2>404 - Halaman Tidak Ditemukan</h2>
          </div>
        } />
        
      </Route> {/* <-- Penutup Rute Grup 2 */}

    </Routes>
  );
}

export default App;