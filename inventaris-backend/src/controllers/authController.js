// Lokasi file: src/controllers/authController.js
// (VERSI BENAR)

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- FUNGSI UNTUK DAFTAR USER BARU ---
exports.register = async (req, res) => {
  const { nama, username, password, level } = req.body;

  if (!username || !password || !nama) {
    return res.status(400).json({ error: 'Nama, Username, dan Password tidak boleh kosong.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username: username }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username sudah digunakan.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        nama: nama,
        username: username,
        password: hashedPassword,
        level: level || 'manajemen'
      }
    });

    res.status(201).json({
      message: 'User berhasil dibuat!',
      userId: newUser.id
    });

  } catch (error) {
    console.error("--- GAGAL REGISTER USER ---", error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};


// --- FUNGSI UNTUK LOGIN USER ---
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan Password tidak boleh kosong.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username: username }
    });

    if (!user) {
      return res.status(401).json({ error: 'Username atau Password salah.' });
    }

    // Cek apakah user aktif
    if (!user.isActive) {
      return res.status(403).json({ error: 'Akun Anda telah dinonaktifkan.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Username atau Password salah.' });
    }

    const payload = {
      userId: user.id,
      level: user.level
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'RAHASIA_YANG_SANGAT_SULIT_DITEBAK', // <-- INI KUNCI 1
      { expiresIn: '8h' }
    );

    res.status(200).json({
      message: 'Login berhasil!',
      token: token,
      user: {
        id: user.id,
        nama: user.nama,
        username: user.username,
        level: user.level
      }
    });

  } catch (error) {
    console.error("--- GAGAL LOGIN ---", error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

// --- FUNGSI BARU UNTUK MENGAMBIL SEMUA USER ---
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nama: true,
        username: true,
        level: true,
        isActive: true,
        deactivatedAt: true,
      },
      orderBy: {
        id: 'asc'
      }
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("--- GAGAL MENGAMBIL DAFTAR USER ---", error);
    res.status(500).json({ error: 'Gagal mengambil data user.' });
  }
};

// --- FUNGSI BARU UNTUK UPDATE STATUS USER ---
exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    return res.status(400).json({ error: 'Status "isActive" harus berupa boolean.' });
  }

  try {
    const userToUpdate = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!userToUpdate) {
      return res.status(404).json({ error: 'User tidak ditemukan.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data: {
        isActive: isActive,
        deactivatedAt: isActive ? null : new Date(),
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("--- GAGAL UPDATE STATUS USER ---", error);
    res.status(500).json({ error: 'Gagal memperbarui status user.' });
  }
};

// --- FUNGSI BARU UNTUK MENGAMBIL USER GUDANG AKTIF ---
exports.getWarehouseUsers = async (req, res) => {
  try {
    const warehouseUsers = await prisma.user.findMany({
      where: {
        level: 'gudang',
        isActive: true,
      },
      select: {
        id: true,
        nama: true,
      },
      orderBy: {
        nama: 'asc',
      },
    });
    res.status(200).json(warehouseUsers);
  } catch (error) {
    console.error("--- GAGAL MENGAMBIL USER GUDANG ---", error);
    res.status(500).json({ error: 'Gagal mengambil data user gudang.' });
  }
};


// --- PASTIKAN EKSPORNYA LENGKAP ---
module.exports = {
  register: exports.register,
  login: exports.login,
  getAllUsers: exports.getAllUsers,
  updateUserStatus: exports.updateUserStatus,
  getWarehouseUsers: exports.getWarehouseUsers
};