const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const username = 'admin';
  const password = 'admin1234'; // Password sesuai permintaan user
  const hashedPassword = await bcrypt.hash(password, 10);

  const adminUser = await prisma.user.upsert({
    where: { username: username },
    update: {},
    create: {
      nama: 'Administrator',
      username: username,
      password: hashedPassword,
      level: 'manajemen',
      isActive: true,
    },
  });

  console.log(`Created or found admin user: ${adminUser.username}`);
  console.log(`Login with username '${username}' and password '${password}'`);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
