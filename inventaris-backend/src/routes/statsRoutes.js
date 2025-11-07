// Lokasi: src/routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// URL: GET /api/stats/dashboard
router.get('/dashboard', statsController.getDashboardStats);

module.exports = router;