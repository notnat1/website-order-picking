// Lokasi: src/routes/authRoutes.js
// (VERSI LENGKAP + RUTE BARU)

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// Pastikan "Satpam" diimpor dari lokasi yang benar
const { protect, authorize } = require('../middleware/authMiddleware'); 
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);
// URL: POST /api/auth/register
// Hanya 'manajemen' yang bisa mendaftarkan
router.post('/register', authController.register);
//router.post('/register', protect, authorize('manajemen'), authController.register);

// URL: POST /api/auth/login
// Publik, semua boleh akses
router.post('/login', authController.login);

// Hanya 'manajemen' yang bisa melihat daftar user
router.get('/users', protect, authorize('manajemen'), authController.getAllUsers);

// Rute baru untuk update status user
router.patch('/users/:id/status', protect, authorize('manajemen'), authController.updateUserStatus);

// Rute baru untuk mendapatkan user gudang yang aktif
router.get('/warehouse-users', protect, authorize('manajemen'), authController.getWarehouseUsers);

module.exports = router;