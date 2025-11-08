// Lokasi file: src/controllers/supplierController.js
// (VERSI FINAL - DITAMBAH VALIDASI)

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all suppliers (HANYA YANG AKTIF)
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      where: { status: "Aktif" } 
    });
    res.json(suppliers);
  } catch (error) {
    console.error("--- GAGAL MENGAMBIL SUPPLIER ---", error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
};

// Get supplier by ID
const getSupplierById = async (req, res) => {
  const { id } = req.params;
  try {
    const supplier = await prisma.supplier.findUnique({ where: { id: parseInt(id) } });
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error) {
    console.error(`--- GAGAL MENGAMBIL SUPPLIER ID: ${id} ---`, error);
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
};

// Create new supplier
exports.createSupplier = async (req, res) => {
  const { nama_supplier, alamat, telepon } = req.body; 

  // --- VALIDASI BACKEND (PERBAIKAN) ---
  if (!nama_supplier || nama_supplier.trim() === '') {
    return res.status(400).json({ error: "Nama Supplier wajib diisi." });
  }
  
  // Regex: 
  // ^[0-9]*$ = Memeriksa apakah string HANYA berisi angka (0-9)
  //            Atau string kosong (jika telepon tidak diisi)
  const phoneRegex = /^[0-9]*$/;
  if (telepon && !phoneRegex.test(telepon)) {
    return res.status(400).json({ error: "Nomor telepon hanya boleh berisi angka." });
  }
  // --- AKHIR VALIDASI ---

  try {
    const newSupplier = await prisma.supplier.create({
      data: {
        nama_supplier,
        alamat,
        telepon,
      },
    });
    res.status(201).json(newSupplier);
  } catch (error) {
    console.error("--- GAGAL MEMBUAT SUPPLIER BARU ---");
    console.error("Data yang diterima:", req.body); 
    console.error("Error lengkap:", error);
    res.status(500).json({ error: `Failed to create supplier: ${error.message}` });
  }
};

// Update supplier
exports.updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { nama_supplier, alamat, telepon } = req.body;

  // --- VALIDASI BACKEND (PERBAIKAN) ---
  if (!nama_supplier || nama_supplier.trim() === '') {
    return res.status(400).json({ error: "Nama Supplier wajib diisi." });
  }
  const phoneRegex = /^[0-9]*$/; 
  if (telepon && !phoneRegex.test(telepon)) {
    return res.status(400).json({ error: "Nomor telepon hanya boleh berisi angka." });
  }
  // --- AKHIR VALIDASI ---

  try {
    const updatedSupplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: {
        nama_supplier,
        alamat,
        telepon,
      },
    });
    res.json(updatedSupplier);
  } catch (error) {
    console.error(`--- GAGAL MENGUPDATE SUPPLIER (ID: ${id}) ---`, error);
    console.error("Data yang diterima:", req.body);
    console.error("Error lengkap:", error);
    res.status(500).json({ error: `Failed to update supplier: ${error.message}` });
  }
};

// Delete supplier (SOFT DELETE)
exports.deleteSupplier = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.supplier.update({ 
      where: { id: parseInt(id) },
      data: { status: "Non-Aktif" } 
    });
    res.status(200).json({ message: "Supplier berhasil dinonaktifkan" });
  } catch (error) {
    console.error(`--- GAGAL MENONAKTIFKAN SUPPLIER (ID: ${id}) ---`, error); 
    res.status(500).json({ error: `Failed to delete supplier: ${error.message}` });
  }
};

// Pastikan ekspornya benar
module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier: exports.createSupplier,
  updateSupplier: exports.updateSupplier,
  deleteSupplier: exports.deleteSupplier,
};