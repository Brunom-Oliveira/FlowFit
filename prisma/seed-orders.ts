import { PrismaClient, OrderStatus, Role } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Seeding mock orders with complete line items...');

  // Remove mock orders antigos para evitar duplicatas
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  // Remove apenas os usuários de teste específicos criados pelo seed
  await prisma.user.deleteMany({
    where: { email: { in: ['amanda@test.com', 'carolina@test.com', 'juliana@test.com'] } }
  });

  // Create mock customers com senhas funcionais
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'amanda@test.com',
        name: 'Amanda Silva',
        passwordHash: '123',
        role: Role.CUSTOMER,
      }
    }),
    prisma.user.create({
      data: {
        email: 'carolina@test.com',
        name: 'Carolina Mendes',
        passwordHash: '123',
        role: Role.CUSTOMER,
      }
    }),
    prisma.user.create({
      data: {
        email: 'juliana@test.com',
        name: 'Juliana Costa',
        passwordHash: '123',
        role: Role.CUSTOMER,
      }
    }),
  ]);

  // Busca os produtos e suas variantes para atrelar as fotos e preços reais
  const [pConjunto, pLegging, pJaqueta] = await Promise.all([
    prisma.product.findFirst({ where: { slug: 'conjunto-seamless-infinity' }, include: { variants: true } }),
    prisma.product.findFirst({ where: { slug: 'legging-core-flow' }, include: { variants: true } }),
    prisma.product.findFirst({ where: { slug: 'jaqueta-corta-vento' }, include: { variants: true } }),
  ]);

  if (!pConjunto || !pLegging || !pJaqueta) {
    throw new Error('Execute "npx tsx prisma/seed.ts" antes para garantir que os produtos base existem!');
  }

  // 1. Pedido da Amanda: Conjunto Infinity (R$ 259,90)
  await prisma.order.create({
    data: {
      userId: users[0].id,
      status: OrderStatus.PAID,
      totalAmount: 259.90,
      createdAt: new Date(),
      items: {
        create: [
          {
            variantId: pConjunto.variants[0].id,
            quantity: 1,
            price: pConjunto.price,
          }
        ]
      }
    }
  });

  // 2. Pedido da Carolina: Legging Core Flow (R$ 149,90)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.order.create({
    data: {
      userId: users[1].id,
      status: OrderStatus.SHIPPED,
      totalAmount: 149.90,
      createdAt: yesterday,
      items: {
        create: [
          {
            variantId: pLegging.variants[1].id, // Tamanho M
            quantity: 1,
            price: pLegging.price,
          }
        ]
      }
    }
  });

  // 3. Pedido da Juliana: Jaqueta (R$ 229,90) + Conjunto (R$ 259,90) = R$ 489,80
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  await prisma.order.create({
    data: {
      userId: users[2].id,
      status: OrderStatus.DELIVERED,
      totalAmount: 489.80,
      createdAt: twoDaysAgo,
      items: {
        create: [
          {
            variantId: pJaqueta.variants[0].id,
            quantity: 1,
            price: pJaqueta.price,
          },
          {
            variantId: pConjunto.variants[0].id,
            quantity: 1,
            price: pConjunto.price,
          }
        ]
      }
    }
  });

  console.log('Mock orders with line items seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
