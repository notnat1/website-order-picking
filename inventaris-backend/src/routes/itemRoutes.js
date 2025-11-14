const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const { protect, authorize } = require('../middleware/authMiddleware');

// Daftar "Jalan" atau "Pintu"

// GET /api/items/ -> Boleh dilihat semua user yang login
router.get("/", protect, itemController.getAllItems);

// POST /api/items/ -> HANYA 'manajemen'
router.post("/", protect, authorize('manajemen'), itemController.createItem);

// PUT /api/items/:id -> HANYA 'manajemen'
router.put("/:id", protect, authorize('manajemen'), itemController.updateItem);

// DELETE /api/items/:id -> HANYA 'manajemen'
router.delete("/:id", protect, authorize('manajemen'), itemController.deleteItem);

module.exports = router;