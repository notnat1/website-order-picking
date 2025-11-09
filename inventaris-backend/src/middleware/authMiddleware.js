// Lokasi: src/middleware/authMiddleware.js
// (VERSI LENGKAP + PERBAIKAN KUNCI)

const jwt = require('jsonwebtoken');

// Middleware untuk mengecek apakah user sudah login
exports.protect = (req, res, next) => {
  let token;
  // Token akan dikirim di header 'Authorization' dengan format 'Bearer <token>'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Verifikasi token
      // --- PERBAIKANNYA DI SINI ---
      // Kita samakan kuncinya dengan yang ada di authController.js
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'RAHASIA_YANG_SANGAT_SULIT_DITEBAK' // <-- SAMAKAN KUNCINYA!
      ); 
      
      // Simpan data user dari token ke 'req' agar bisa dipakai controller
      req.user = decoded; // Ini akan berisi { userId: ..., level: ... }
      next();

    } catch (error) {
      // Ini akan gagal jika kuncinya salah atau tokennya kadaluwarsa
      console.error("--- TOKEN VERIFY GAGAL ---", error.message);
      res.status(401).json({ error: 'Token tidak valid, otorisasi gagal' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Tidak ada token, otorisasi gagal' });
  }
};

// Middleware untuk mengecek LEVEL/ROLE user
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.level)) {
      return res.status(403).json({ // 403 Forbidden
        error: `User dengan level '${req.user.level}' tidak diizinkan mengakses rute ini`
      });
    }
    next();
  };
};