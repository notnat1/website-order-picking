require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const password = 'admin1234'; // Ini akan menjadi password baru

  console.log(`Membuat atau memperbarui user: ${username}...`);
  
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log('Hash password berhasil dibuat.');

  const user = await prisma.user.upsert({
    where: { username: username },
    update: {
      password: hashedPassword,
      level: 'admin', // Pastikan levelnya admin saat diupdate
    },
    create: {
      username: username,
      password: hashedPassword,
      nama: 'Administrator', // Nama default saat dibuat
      level: 'admin',
      status: 'Aktif',
    },
  });

  console.log(`\nBERHASIL! User '${user.username}' telah dibuat/diperbarui.`);
  console.log(`Anda sekarang bisa login dengan username '${username}' dan password '${password}'.`);
  console.log('PENTING: Jangan lupa hapus file ini (resetAdminPassword.js) setelah selesai!');
}

main()
  .catch((e) => {
    console.error('Terjadi error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

