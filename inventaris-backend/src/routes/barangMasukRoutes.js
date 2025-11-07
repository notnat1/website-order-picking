const express = require('express');
const router = express.Router();
const { getAllBarangMasuk, createBarangMasuk } = require('../controllers/barangMasukController');

// Rute untuk mendapatkan semua barang masuk
router.get('/', getAllBarangMasuk);

// Rute untuk membuat barang masuk baru
router.post('/', createBarangMasuk);

module.exports = router;