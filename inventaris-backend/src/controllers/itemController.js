// Lokasi file: src/controllers/itemController.js
// (VERSI FINAL - DITAMBAH VALIDASI)

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 1. Logika untuk MENGAMBIL SEMUA data barang
exports.getAllItems = async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      where: { status: "Aktif" }
    });
    res.status(200).json(items);
  } catch (error) {
    console.error("Gagal mengambil items:", error);
    res.status(500).json({ error: error.message });
  }
};

// 2. Logika untuk MEMBUAT data barang BARU
exports.createItem = async (req, res) => {
  try {
    const {
      nama_barang,
      spesifikasi,
      lokasi,
      kondisi,
      jumlah_stok,
      sumber_dana,
      rak,
    } = req.body;

    const stokAsInt = parseInt(jumlah_stok) || 0;

    // --- VALIDASI BACKEND (PERBAIKAN) ---
    if (!nama_barang || !kondisi) {
        return res.status(400).json({ error: "Nama Barang dan Kondisi wajib diisi." });
    }
    if (stokAsInt < 0) {
      return res.status(400).json({ error: "Jumlah stok tidak boleh negatif." });
    }
    // --- AKHIR VALIDASI ---

    const newItem = await prisma.item.create({
      data: {
        nama_barang,
        spesifikasi,
        lokasi,
        kondisi,
        jumlah_stok: stokAsInt, // <- Gunakan yang sudah jadi angka
        sumber_dana,
        rak,
      },
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error("--- GAGAL MEMBUAT ITEM BARU ---");
    console.error("Data yang diterima:", req.body);
    console.error("Error lengkap:", error);
    res.status(500).json({ error: `Failed to create item: ${error.message}` });
  }
};

// 3. Logika untuk MENGUPDATE data barang
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nama_barang,
      spesifikasi,
      lokasi,
      kondisi,
      jumlah_stok,
      sumber_dana,
      rak,
    } = req.body;

    const stokAsInt = parseInt(jumlah_stok) || 0;

    // --- VALIDASI BACKEND (PERBAIKAN) ---
    if (!nama_barang || !kondisi) {
        return res.status(400).json({ error: "Nama Barang dan Kondisi wajib diisi." });
    }
    if (stokAsInt < 0) {
      return res.status(400).json({ error: "Jumlah stok tidak boleh negatif." });
    }
    // --- AKHIR VALIDASI ---

    const updatedItem = await prisma.item.update({
      where: { id: parseInt(id) },
      data: {
        nama_barang,
        spesifikasi,
        lokasi,
        kondisi,
        jumlah_stok: stokAsInt, // <- Gunakan yang sudah jadi angka
        sumber_dana,
        rak,
      },
    });
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error(`--- GAGAL MENGUPDATE ITEM (ID: ${req.params.id}) ---`);
    console.error("Data yang diterima:", req.body);
    console.error("Error lengkap:", error);
    res.status(500).json({ error: error.message });
  }
};

// 4. Logika untuk MENGHAPUS data barang (SOFT DELETE)
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.item.update({
      where: { id: parseInt(id) },
      data: { status: "Non-Aktif" } // <-- UBAH STATUSNYA
    });

    res.status(200).json({ message: "Barang berhasil dinonaktifkan" });
  } catch (error) {
    console.error(`--- GAGAL MENONAKTIFKAN ITEM (ID: ${req.params.id}) ---`);
    console.error("Error lengkap:", error);
    res.status(500).json({ error: error.message });
  }
};