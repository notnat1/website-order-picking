// Lokasi file: inventaris-backend/server.js
// (VERSI SUDAH DIPERBAIKI)

const express = require("express");
const cors = require("cors");

// Import all routes
const itemRoutes = require("./src/routes/itemRoutes");
const supplierRoutes = require('./src/routes/supplierRoutes');
const barangMasukRoutes = require('./src/routes/barangMasukRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const statsRoutes = require('./src/routes/statsRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();  // ✅ Define app FIRST
const PORT = 5001;

// === Middleware ===
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
  res.send('Selamat datang di API Inventaris!');
});

// === Mount Routes ===
app.use("/api/items", itemRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/barang-masuk', barangMasukRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);  // ✅ Now app exists

// === Start Server ===
app.listen(PORT, () => {
  console.log(`Server API berjalan di http://localhost:${PORT}`);
});