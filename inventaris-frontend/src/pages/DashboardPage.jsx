import React from 'react';

const DashboardPage = () => {
  return (
    // Kita pakai "baju" standar kita
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">Dashboard</h2>
          <p className="section-subtitle">Selamat datang di sistem Order Picking.</p>
        </div>
      </div>
      
      {/* Nanti kamu bisa isi ini dengan statistik (misal: jumlah barang, jumlah order pending) */}
      <p>Halaman dashboard sedang dalam pengembangan.</p>
      
    </div>
  );
};

export default DashboardPage;