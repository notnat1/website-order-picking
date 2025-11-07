// Lokasi file: src/controllers/itemController.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 1. Logika untuk MENGAMBIL SEMUA data barang
// exports.getAllItems = async (req, res) => {
//   try {
//     const items = await prisma.item.findMany();
//     res.status(200).json(items);
//   } catch (error) {
//     // --- TAMBAHAN DEBUG ---
//     console.error("Gagal mengambil items:", error);
//     // ---------------------
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getAllItems = async (req, res) => {
  try {
    // TAMBAHKAN FILTER 'where'
    const items = await prisma.item.findMany({
      where: { status: "Aktif" }
    });
    res.status(200).json(items);
  } catch (error) {
    // ...
  }
};

// 2. Logika untuk MEMBUAT data barang BARU (SUDAH DIPERBAIKI)
exports.createItem = async (req, res) => {
  try {
    const {
      nama_barang,
      spesifikasi,
      lokasi,
      kondisi,
      jumlah_stok,
      sumber_dana,
    } = req.body;

    // --- PERBAIKAN TIPE DATA ---
    // Kita ubah string "40" menjadi angka 40.
    // Jika string-nya kosong "", dia akan jadi 0.
    const stokAsInt = parseInt(jumlah_stok) || 0;
    // ---------------------------

    const newItem = await prisma.item.create({
      data: {
        nama_barang,
        spesifikasi,
        lokasi,
        kondisi,
        jumlah_stok: stokAsInt, // <- Gunakan yang sudah jadi angka
        sumber_dana,
      },
    });
    res.status(201).json(newItem);
  } catch (error) {
    // --- TAMBAHAN DEBUG ---
    console.error("--- GAGAL MEMBUAT ITEM BARU ---");
    console.error("Data yang diterima:", req.body);
    console.error("Error lengkap:", error);
    // ---------------------
    res.status(500).json({ error: `Failed to create item: ${error.message}` });
  }
};

// 3. Logika untuk MENGUPDATE data barang (SUDAH DIPERBAIKI)
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
    } = req.body;

    // --- PERBAIKAN TIPE DATA ---
    const stokAsInt = parseInt(jumlah_stok) || 0;
    // ---------------------------

    const updatedItem = await prisma.item.update({
      where: { id: parseInt(id) },
      data: {
        nama_barang,
        spesifikasi,
        lokasi,
        kondisi,
        jumlah_stok: stokAsInt, // <- Gunakan yang sudah jadi angka
        sumber_dana,
      },
    });
    res.status(200).json(updatedItem);
  } catch (error) {
    // --- TAMBAHAN DEBUG ---
    console.error(`--- GAGAL MENGUPDATE ITEM (ID: ${req.params.id}) ---`);
    console.error("Data yang diterima:", req.body);
    console.error("Error lengkap:", error);
    // ---------------------
    res.status(500).json({ error: error.message });
  }
};

// 4. Logika untuk MENGHAPUS data barang
// exports.deleteItem = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await prisma.item.delete({
//       where: { id: parseInt(id) },
//     });
//     res.status(200).json({ message: "Barang berhasil dihapus" });
//   } catch (error) {
//     // --- TAMBAHAN DEBUG ---
//     console.error(`--- GAGAL MENGHAPUS ITEM (ID: ${req.params.id}) ---`);
//     console.error("Error lengkap:", error);
//     // ---------------------
//     res.status(500).json({ error: error.message });
//   }
// };

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // UBAH JADI UPDATE, BUKAN DELETE
    await prisma.item.update({
      where: { id: parseInt(id) },
      data: { status: "Non-Aktif" } // <-- UBAH STATUSNYA
    });

    res.status(200).json({ message: "Barang berhasil dinonaktifkan" });
  } catch (error) {
    // --- TAMBAHAN DEBUG ---
    console.error(`--- GAGAL MENONAKTIFKAN ITEM (ID: ${req.params.id}) ---`);
    console.error("Error lengkap:", error);
    // ---------------------
    res.status(500).json({ error: error.message });
  }
};