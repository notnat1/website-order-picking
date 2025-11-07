// Lokasi file: src/routes/itemRoutes.js

const express = require("express");
const router = express.Router();

// Impor "Otak"-nya
const itemController = require("../controllers/itemController");

// Daftar "Jalan" atau "Pintu"
// URL: / (maksudnya /api/items/) -> Panggil fungsi getAllItems
router.get("/", itemController.getAllItems);

// URL: / (maksudnya /api/items/) TAPI METODENYA POST -> Panggil fungsi createItem
router.post("/", itemController.createItem);

// URL: /1 (maksudnya /api/items/1) METODE PUT -> Panggil fungsi updateItem
router.put("/:id", itemController.updateItem);

// URL: /1 (maksudnya /api/items/1) METODE DELETE -> Panggil fungsi deleteItem
router.delete("/:id", itemController.deleteItem);

module.exports = router;
