// Lokasi: src/controllers/authController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs'); //
const jwt = require('jsonwebtoken'); //

// --- FUNGSI UNTUK DAFTAR USER BARU ---
exports.register = async (req, res) => {
  const { nama, username, password, level } = req.body;

  // 1. Validasi input dasar
  if (!username || !password || !nama) {
    return res.status(400).json({ error: 'Nama, Username, dan Password tidak boleh kosong.' });
  }

  try {
    // 2. Cek apakah username sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { username: username }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username sudah digunakan.' });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Buat user baru (menggunakan kolom dari schema.prisma)
    const newUser = await prisma.user.create({
      data: {
        nama: nama,
        username: username,
        password: hashedPassword,
        level: level || 'manajemen' // Default ke 'manajemen' jika tidak dispesifikasi
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

  // 1. Validasi input
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan Password tidak boleh kosong.' });
  }

  try {
    // 2. Cari user di database
    const user = await prisma.user.findUnique({
      where: { username: username }
    });

    if (!user) {
      return res.status(401).json({ error: 'Username atau Password salah.' }); // 401 Unauthorized
    }

    // 3. Bandingkan password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Username atau Password salah.' });
    }

    // 4. Buat Token (JWT)
    const payload = {
      userId: user.id,
      level: user.level // Ambil 'level' dari database
    };

    // !! PENTING !!
    // 'RAHASIA_JWT' ini HARUS Anda ganti dan simpan di file .env
    // Jangan pernah hardcode di sini untuk produksi
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'RAHASIA_YANG_SANGAT_SULIT_DITEBAK', 
      { expiresIn: '8h' } // Token berlaku 8 jam
    );

    // 5. Kirim balasan ke frontend
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