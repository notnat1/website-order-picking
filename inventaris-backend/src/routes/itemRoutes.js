const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const { protect, authorize } = require('../middleware/authMiddleware');
// Daftar "Jalan" atau "Pintu"
// URL: / (maksudnya /api/items/) -> Panggil fungsi getAllItems
router.get("/", itemController.getAllItems);

// URL: / (maksudnya /api/items/) TAPI METODENYA POST -> Panggil fungsi createItem
router.post("/", itemController.createItem);

// URL: /1 (maksudnya /api/items/1) METODE PUT -> Panggil fungsi updateItem
router.put("/:id", itemController.updateItem);

// URL: /1 (maksudnya /api/items/1) METODE DELETE -> Panggil fungsi deleteItem
router.delete("/:id", itemController.deleteItem);

// GET /api/items/ -> Boleh dilihat semua user yang login
router.get("/", protect, itemController.getAllItems);

// POST /api/items/ -> HANYA 'manajemen'
router.post("/", protect, authorize('manajemen'), itemController.createItem);

// PUT /api/items/:id -> HANYA 'manajemen'
router.put("/:id", protect, authorize('manajemen'), itemController.updateItem);

// DELETE /api/items/:id -> HANYA 'manajemen'
router.delete("/:id", protect, authorize('manajemen'), itemController.deleteItem);

module.exports = router;
