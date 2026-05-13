import { prisma } from '../src/lib/prisma';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function main() {
  const email = 'admin@flowfit.com';
  
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log('Admin user already exists!');
    return;
  }

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador Flowfit',
      email: email,
      passwordHash: 'admin123', // In a real app, this should be hashed with bcrypt
      role: 'ADMIN',
    },
  });

  console.log(`Admin created successfully!`);
  console.log(`Email: ${admin.email}`);
  console.log(`Senha: admin123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
