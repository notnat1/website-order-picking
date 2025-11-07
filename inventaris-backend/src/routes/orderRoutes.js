// Lokasi file: src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// URL: POST /api/orders
// Fungsi: Membuat order baru
router.post('/', orderController.createOrder);

// URL: GET /api/orders/pending
// Fungsi: Melihat semua order yang statusnya "Pending" (Daftar Tugas)
router.get('/pending', orderController.getPendingOrders);

// URL: GET /api/orders/1
// Fungsi: Melihat detail satu order
router.get('/:id', orderController.getOrderDetail);

// URL: POST /api/orders/1/complete
// Fungsi: Menyelesaikan picking & mengurangi stok
router.post('/:id/complete', orderController.completeOrderPicking);

module.exports = router;