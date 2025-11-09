// Lokasi file: src/routes/orderRoutes.js
// (VERSI LENGKAP + RUTE BARU)

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
// Impor "Satpam" kita
const { protect, authorize } = require('../middleware/authMiddleware');

// --- RUTE BARU: GET /api/orders ---
// Untuk Admin (Histori Pesanan)
// (Kita tempatkan di atas /:id agar tidak bentrok)
router.get('/', protect, authorize('manajemen'), orderController.getAllOrders);

// URL: POST /api/orders
// Fungsi: Membuat order baru
router.post('/', protect, authorize('manajemen'), orderController.createOrder); // Kita proteksi juga

// URL: GET /api/orders/pending
// Fungsi: Melihat semua order yang statusnya "Pending" (Daftar Tugas Gudang)
router.get('/pending', protect, authorize('manajemen', 'gudang'), orderController.getPendingOrders); // Boleh diakses gudang

// URL: GET /api/orders/1
// Fungsi: Melihat detail satu order
router.get('/:id', protect, authorize('manajemen', 'gudang'), orderController.getOrderDetail); // Boleh diakses gudang

// URL: POST /api/orders/1/complete
// Fungsi: Menyelesaikan picking & mengurangi stok (oleh gudang)
router.post('/:id/complete', protect, authorize('manajemen', 'gudang'), orderController.completeOrderPicking); // Boleh diakses gudang

// --- RUTE BARU: POST /api/orders/1/archive ---
// Untuk Admin (Tombol "X")
router.post('/:id/archive', protect, authorize('manajemen'), orderController.archiveOrder);

module.exports = router;