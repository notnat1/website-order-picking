// Lokasi: src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware untuk mengecek apakah user sudah login (membawa token valid)
exports.protect = (req, res, next) => {
  let token;
  // Token akan dikirim di header 'Authorization' dengan format 'Bearer <token>'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Verifikasi token
      const decoded = jwt.verify(token, 'RAHASIA_ANDA_SENDIRI'); // Pakai secret key Anda
      
      // Simpan data user dari token ke 'req' agar bisa dipakai controller
      req.user = decoded; // Ini akan berisi { userId: ..., level: ... }
      next();

    } catch (error) {
      res.status(401).json({ error: 'Token tidak valid, otorisasi gagal' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Tidak ada token, otorisasi gagal' });
  }
};

// Middleware untuk mengecek LEVEL/ROLE user
// '...roles' adalah daftar level yang diizinkan (e.g., 'admin', 'manajemen')
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