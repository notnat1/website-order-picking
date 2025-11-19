// Lokasi file: src/controllers/orderController.js
// (VERSI LENGKAP + FUNGSI BARU)

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. FUNGSI UNTUK MEMBUAT PESANAN BARU
exports.createOrder = async (req, res) => {
  const { nama_pemesan, items } = req.body;
  if (!nama_pemesan || !items || items.length === 0) {
    return res.status(400).json({ error: "Nama pemesan dan daftar barang tidak boleh kosong." });
  }
  const nomor_pesanan = `SO-${Date.now()}`;
  try {
    const newOrder = await prisma.order.create({
      data: {
        nama_pemesan,
        nomor_pesanan,
        status: "Pending", // Status awal
        orderItems: {
          create: items.map(item => ({
            item_id: parseInt(item.item_id),
            jumlah: parseInt(item.jumlah)
          }))
        }
      },
      include: { orderItems: true }
    });
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("--- GAGAL MEMBUAT ORDER BARU ---", error);
    res.status(500).json({ error: error.message });
  }
};

// 2. FUNGSI UNTUK MELIHAT SEMUA TUGAS PICKING (Order 'Pending')
exports.getPendingOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { status: "Pending" },
      orderBy: { createdAt: 'asc' },
      include: {
        _count: {
          select: { orderItems: true }
        }
      }
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("--- GAGAL MENGAMBIL ORDER PENDING ---", error);
    res.status(500).json({ error: error.message });
  }
};

// 3. FUNGSI UNTUK MELIHAT DETAIL SATU TUGAS PICKING
exports.getOrderDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        orderItems: {
          include: {
            item: true
          }
        },
        picker: true // Include picker data
      }
    });
    if (!order) {
      return res.status(404).json({ error: "Order tidak ditemukan." });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(`--- GAGAL MENGAMBIL DETAIL ORDER ${id} ---`, error);
    res.status(500).json({ error: error.message });
  }
};


// 4. FUNGSI "JANTUNG" (Selesaikan Picking & Kurangi Stok)
exports.completeOrderPicking = async (req, res) => {
  const { id } = req.params;
  const orderId = parseInt(id);
  try {
    const orderToPick = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: { include: { item: true } } }
    });
    if (!orderToPick) {
      return res.status(404).json({ error: "Order tidak ditemukan." });
    }
    if (orderToPick.status !== "Pending") {
      return res.status(400).json({ error: "Order ini sudah diproses." });
    }
    for (const detail of orderToPick.orderItems) {
      if (detail.item.jumlah_stok < detail.jumlah) {
        return res.status(400).json({ 
          error: `Stok tidak cukup untuk ${detail.item.nama_barang}. Sisa stok: ${detail.item.jumlah_stok}, diminta: ${detail.jumlah}`
        });
      }
    }
    const transactionQueries = [];
    for (const detail of orderToPick.orderItems) {
      transactionQueries.push(
        prisma.item.update({
          where: { id: detail.item_id },
          data: { jumlah_stok: { decrement: detail.jumlah } }
        })
      );
    }
    transactionQueries.push(
      prisma.order.update({
        where: { id: orderId },
        data: { status: "Picked" } // Status berubah jadi "Picked"
      })
    );
    await prisma.$transaction(transactionQueries);
    res.status(200).json({ message: "Order picking selesai dan stok telah diupdate." });
  } catch (error) {
    console.error(`--- GAGAL MENYELESAIKAN PICKING (ORDER ID: ${orderId}) ---`, error);
    res.status(500).json({ error: `Gagal memproses order: ${error.message}` });
  }
};

// --- 5. FUNGSI BARU: Mengambil Order (Berdasarkan Filter) ---
exports.getAllOrders = async (req, res) => {
  const { status } = req.query; 

  let whereClause = {};
  let orderByClause = { createdAt: 'desc' };

  if (status === 'archived') {
    whereClause = { status: "Archived" };
  } else {
    whereClause = { 
      NOT: { status: "Archived" } 
    };
    orderByClause = { status: 'asc' }; 
  }

  try {
    const orders = await prisma.order.findMany({
      where: whereClause, 
      orderBy: orderByClause, 
      include: {
        _count: {
          select: { orderItems: true }
        }
      }
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("--- GAGAL MENGAMBIL SEMUA ORDER ---", error);
    res.status(500).json({ error: error.message });
  }
};

// --- 6. FUNGSI BARU: Mengarsipkan Order (Tombol "X") ---
exports.archiveOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({ where: { id: parseInt(id) } });
    if (!order) {
      return res.status(404).json({ error: "Order tidak ditemukan." });
    }
    if (order.status !== "Picked") {
      return res.status(400).json({ error: "Hanya order yang sudah 'Picked' (Selesai) yang bisa diarsipkan." });
    }
    await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status: "Archived" }
    });
    res.status(200).json({ message: "Order berhasil diarsipkan." });
  } catch (error) {
    console.error(`--- GAGAL MENGARSIPKAN ORDER ${id} ---`, error);
    res.status(500).json({ error: error.message });
  }
};

// --- 7. FUNGSI BARU: Mengembalikan Order dari Arsip ---
exports.unarchiveOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!order) {
      return res.status(404).json({ error: "Order tidak ditemukan." });
    }
    
    if (order.status !== "Archived") {
      return res.status(400).json({ error: "Order ini tidak ada di arsip." });
    }

    await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status: "Picked" } 
    });

    res.status(200).json({ message: "Order berhasil dipulihkan." });
  } catch (error) {
    console.error(`--- GAGAL MEMULIHKAN ORDER ${id} ---`, error);
    res.status(500).json({ error: error.message });
  }
};

// --- 8. FUNGSI BARU: Menugaskan Picker ke Order ---
exports.assignPicker = async (req, res) => {
  const { id } = req.params; // orderId
  const { pickerId } = req.body;

  if (!pickerId) {
    return res.status(400).json({ error: 'ID Picker harus disertakan.' });
  }

  try {
    // 1. Validasi picker
    const picker = await prisma.user.findUnique({
      where: { id: parseInt(pickerId, 10) },
    });

    if (!picker || picker.level !== 'gudang' || !picker.isActive) {
      return res.status(404).json({ error: 'User gudang tidak valid atau tidak aktif.' });
    }

    // 2. Validasi order
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order tidak ditemukan.' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ error: 'Hanya order dengan status "Pending" yang bisa ditugaskan.' });
    }

    // 3. Update order
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id, 10) },
      data: {
        picker_id: parseInt(pickerId, 10),
      },
      include: {
        picker: true, // Sertakan data picker di response
      },
    });

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(`--- GAGAL MENUGASKAN PICKER (ORDER ID: ${id}) ---`, error);
    res.status(500).json({ error: 'Gagal menugaskan picker.' });
  }
};

