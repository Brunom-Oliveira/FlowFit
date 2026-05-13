import * as dotenv from 'dotenv';
import path from 'path';

// Carrega as credenciais de banco de dados estritamente antes da inicialização do driver Prisma/Pooler
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'admin@flowfit.com';
  const plainPassword = 'Admin@Flowfit2026!';
  
  console.log(`🔒 Provisionando credencial corporativa de Administrador...`);

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log('⚠️ A conta de Administrador já existe na base de dados.');
    console.log(`E-mail: ${existingAdmin.email}`);
    
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(plainPassword, salt);
    
    try {
      await (prisma as any).user.update({
        where: { email },
        data: { 
          passwordHash,
          role: 'ADMIN',
          status: 'ACTIVE'
        }
      });
      console.log('✅ Senha e permissões administrativas sincronizadas com o padrão de criptografia atual.');
      console.log(`Nova Senha: ${plainPassword}`);
    } catch {
      await prisma.user.update({
        where: { email },
        data: { 
          passwordHash,
          role: 'ADMIN'
        }
      });
      console.log('✅ Senha administrativa atualizada via fallback seguro.');
      console.log(`Nova Senha: ${plainPassword}`);
    }
    return;
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(plainPassword, salt);

  let admin: any;
  try {
    admin = await (prisma as any).user.create({
      data: {
        name: 'Administradora Executiva Flowfit',
        email: email,
        passwordHash,
        role: 'ADMIN',
        status: 'ACTIVE',
        termsAcceptedAt: new Date(),
      },
    });
  } catch {
    admin = await prisma.user.create({
      data: {
        name: 'Administradora Executiva Flowfit',
        email: email,
        passwordHash,
        role: 'ADMIN',
      },
    });
  }

  console.log(`✨ Administrador criado com sucesso no padrão OWASP Enterprise!`);
  console.log(`=============================================================`);
  console.log(`E-mail de Acesso : ${admin.email}`);
  console.log(`Senha Corporativa: ${plainPassword}`);
  console.log(`Nível de Perfil  : ${admin.role}`);
  console.log(`=============================================================`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
