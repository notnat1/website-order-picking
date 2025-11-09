import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import './CetakPesananPage.css'; // <-- Impor CSS

const CetakPesananPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        setError('Gagal mengambil detail pesanan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);

  // Tampilan loading atau error
  if (loading) {
    return (
      <div className="print-page-container"> {/* <-- TAMBAH WRAPPER */}
        <div className="nota-wrapper">
          <Spinner animation="border" />
          <p className="ms-2 d-inline">Memuat data pesanan...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="print-page-container"> {/* <-- TAMBAH WRAPPER */}
        <div className="nota-wrapper"><Alert variant="danger">{error}</Alert></div>
      </div>
    );
  }
  if (!order) {
    return (
      <div className="print-page-container"> {/* <-- TAMBAH WRAPPER */}
        <div className="nota-wrapper"><Alert variant="warning">Data order tidak ditemukan.</Alert></div>
      </div>
    );
  }

  // Tampilan Nota (JSX)
  return (
    <div className="print-page-container"> {/* <-- TAMBAH WRAPPER INI test */}
      <div className="nota-wrapper">
        <div className="nota-header">
          <h1>Nota Pesanan</h1>
          <p><strong>No. Pesanan:</strong> {order.nomor_pesanan}</p>
          <p><strong>Nama Pemesan:</strong> {order.nama_pemesan}</p>
          <p><strong>Tanggal Pesan:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        <h5 className="mt-4">Detail Barang:</h5>
        <Table bordered hover size="sm" className="nota-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Barang</th>
              <th>Lokasi Gudang</th>
              <th>Jumlah Ambil</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems?.length > 0 ? (
              order.orderItems.map((detail, index) => (
                <tr key={detail.id}>
                  <td>{index + 1}</td>
                  <td>{detail.item.nama_barang}</td>
                  <td>{detail.item.lokasi || '-'}</td>
                  <td>{detail.jumlah}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">Tidak ada barang di pesanan ini.</td>
              </tr>
            )}
          </tbody>
        </Table>
        
        <div className="nota-footer">
          <p>Dicetak pada: {new Date().toLocaleString()}</p>
          <p>Terima kasih.</p>
        </div>

        <Button 
          variant="primary" 
          className="d-print-none mt-3"
          onClick={() => window.print()}
        >
          Cetak
        </Button>
      </div>
    </div>
  );
};

export default CetakPesananPage;