import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Iniciando migração de senhas para formato bcrypt...');

  const users = await prisma.user.findMany();

  for (const user of users) {
    // Ignora se a senha já estiver em formato bcrypt (começa com $2a$ ou $2b$)
    if (user.passwordHash.startsWith('$2')) {
      console.log(`Usuário ${user.email} já possui senha segura.`);
      continue;
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(user.passwordHash, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash }
    });

    console.log(`Senha do usuário ${user.email} migrada com sucesso!`);
  }

  console.log('Migração de senhas concluída!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
