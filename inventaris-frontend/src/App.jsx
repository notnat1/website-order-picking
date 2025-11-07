import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Impor Layout Induk
import Layout from './components/Layout';

// Impor SEMUA Halaman (Pages)
import DashboardPage from './pages/DashboardPage'; // <-- Impor asli
import BarangPage from './pages/BarangPage';
import SupplierPage from './pages/SupplierPage';
import BarangMasukPage from './pages/BarangMasukPage';
import BuatPesananPage from './pages/BuatPesananPage';
import TugasPickingPage from './pages/TugasPickingPage'; // <-- Impor asli
import PickingDetailPage from './pages/PickingDetailPage'; // <-- Impor detail

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Ini adalah Rute Induk (Template) */}
        <Route path="/" element={<Layout />}>
          
          {/* Ini adalah Rute Anak (Halaman) */}
          <Route index element={<DashboardPage />} /> 
          
          <Route path="barang" element={<BarangPage />} />
          <Route path="supplier" element={<SupplierPage />} />
          <Route path="barang-masuk" element={<BarangMasukPage />} />
          <Route path="buat-pesanan" element={<BuatPesananPage />} />
          
          {/* Ini rute daftar tugas */}
          <Route path="tugas-picking" element={<TugasPickingPage />} />
          
          {/* Ini rute detail tugas */}
          <Route path="tugas-picking/:id" element={<PickingDetailPage />} />

        </Route> {/* <-- Penutup Rute Induk */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;