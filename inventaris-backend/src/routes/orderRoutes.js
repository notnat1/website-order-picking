// Lokasi file: src/routes/orderRoutes.js
// (VERSI LENGKAP + RUTE BARU)

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
// Impor "Satpam" kita
const { protect, authorize } = require('../middleware/authMiddleware');

// GET /api/orders (Ini sekarang menerima query ?status=)
// Untuk Admin (Histori Pesanan)
router.get('/', protect, authorize('manajemen'), orderController.getAllOrders);

// URL: POST /api/orders
// Fungsi: Membuat order baru
router.post('/', protect, authorize('manajemen'), orderController.createOrder); 

// URL: GET /api/orders/pending
// Fungsi: Melihat semua order yang statusnya "Pending" (Daftar Tugas Gudang)
router.get('/pending', protect, authorize('manajemen', 'gudang'), orderController.getPendingOrders);

// URL: GET /api/orders/1
// Fungsi: Melihat detail satu order
router.get('/:id', protect, authorize('manajemen', 'gudang'), orderController.getOrderDetail);

// URL: POST /api/orders/1/complete
// Fungsi: Menyelesaikan picking & mengurangi stok (oleh gudang)
router.post('/:id/complete', protect, authorize('manajemen', 'gudang'), orderController.completeOrderPicking);

// URL: POST /api/orders/:id/archive (Arsipkan)
// Untuk Admin (Tombol "X")
router.post('/:id/archive', protect, authorize('manajemen'), orderController.archiveOrder);

// --- RUTE BARU DI SINI ---
// URL: POST /api/orders/:id/unarchive (Pulihkan)
router.post('/:id/unarchive', protect, authorize('manajemen'), orderController.unarchiveOrder);

module.exports = router;