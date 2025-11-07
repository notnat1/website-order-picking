const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mengambil semua data barang masuk
const getAllBarangMasuk = async (req, res) => {
  try {
    const barangMasuk = await prisma.barangMasuk.findMany({
      include: {
        item: true, // Sertakan data dari model Item
        supplier: true, // Sertakan data dari model Supplier
      },
    });
    res.status(200).json(barangMasuk);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Membuat data barang masuk baru
const createBarangMasuk = async (req, res) => {
  const { item_id, supplier_id, jumlah } = req.body;

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Buat record barang masuk baru
      const newBarangMasuk = await prisma.barangMasuk.create({
        data: {
          item_id,
          supplier_id,
          jumlah,
        },
      });

      // 2. Tambah jumlah stok di item yang sesuai
      await prisma.item.update({
        where: { id: item_id },
        data: {
          jumlah_stok: { increment: jumlah },
        },
      });

      return newBarangMasuk;
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getAllBarangMasuk,
  createBarangMasuk,
};