// Lokasi: src/controllers/statsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Hitung order yang masih pending
    const pendingOrders = prisma.order.count({
      where: { status: 'Pending' }
    });

    // 2. Hitung jumlah item yang aktif
    const totalItems = prisma.item.count({
      where: { status: 'Aktif' }
    });

    // 3. Hitung total supplier yang aktif
    const totalSuppliers = prisma.supplier.count({
      where: { status: 'Aktif' }
    });

    // 4. Hitung total nilai stok (jika diperlukan)
    // Ini menjumlahkan semua 'jumlah_stok' dari item aktif
    const totalStock = prisma.item.aggregate({
      _sum: { jumlah_stok: true },
      where: { status: 'Aktif' }
    });

    // Jalankan semua query sekaligus
    const [pendingCount, itemCount, supplierCount, stockSum] = await Promise.all([
      pendingOrders,
      totalItems,
      totalSuppliers,
      totalStock
    ]);

    res.status(200).json({
      pendingOrders: pendingCount,
      totalItems: itemCount,
      totalSuppliers: supplierCount,
      totalStock: stockSum._sum.jumlah_stok || 0
    });

  } catch (error) {
    console.error("--- GAGAL MENGAMBIL STATS ---", error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};