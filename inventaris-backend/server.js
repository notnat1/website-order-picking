// Lokasi file: inventaris-backend/server.js
// (VERSI SUDAH DIPERBAIKI)

const express = require("express");
const cors = require("cors");

// Impor "Jalan" (Router) yang sudah kita buat
const itemRoutes = require("./src/routes/itemRoutes");
const supplierRoutes = require('./src/routes/supplierRoutes');
const barangMasukRoutes = require('./src/routes/barangMasukRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const statsRoutes = require('./src/routes/statsRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = 5001; // Backend kita akan jalan di port 5001

// === Middleware ===
app.use(cors());
app.use(express.json());

// Rute dasar untuk mengecek apakah server berjalan
app.get('/', (req, res) => {
  res.send('Selamat datang di API Inventaris!');
});

// === Gunakan Rute ===
app.use("/api/items", itemRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/barang-masuk', barangMasukRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);

// === Jalankan Server ===
app.listen(PORT, () => {
  console.log(`Server API berjalan di http://localhost:${PORT}`);
});