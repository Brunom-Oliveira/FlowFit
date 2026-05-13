import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
  // Clear existing data to avoid duplicates
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.image.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  
  // Create Categories
  const categoryLeggings = await prisma.category.create({ data: { name: 'Leggings', slug: 'leggings' } });
  const categoryTops = await prisma.category.create({ data: { name: 'Tops', slug: 'tops' } });
  const categoryShorts = await prisma.category.create({ data: { name: 'Shorts', slug: 'shorts' } });
  const categoryCasacos = await prisma.category.create({ data: { name: 'Casacos', slug: 'casacos' } });
  const categoryConjuntos = await prisma.category.create({ data: { name: 'Conjuntos', slug: 'conjuntos' } });
  const categoryRegatas = await prisma.category.create({ data: { name: 'Regatas', slug: 'regatas' } });

  // Create Products
  const p1 = await prisma.product.create({
    data: {
      name: 'Legging Core Flow',
      slug: 'legging-core-flow',
      description: 'A Legging Core Flow foi desenhada para acompanhar todos os seus movimentos. Com tecido de alta compressão e cós alto, oferece suporte e segurança para treinos de alto impacto. Zero transparência.',
      price: 149.90,
      categoryId: categoryLeggings.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80' }] },
      variants: {
        create: [
          { size: 'P', color: 'Preto', stock: 10, sku: 'LGF-PT-P' },
          { size: 'M', color: 'Preto', stock: 20, sku: 'LGF-PT-M' },
          { size: 'G', color: 'Preto', stock: 15, sku: 'LGF-PT-G' },
          { size: 'GG', color: 'Preto', stock: 5, sku: 'LGF-PT-GG' },
        ]
      }
    }
  });

  const p2 = await prisma.product.create({
    data: {
      name: 'Top Sustentação Elite',
      slug: 'top-sustentacao-elite',
      description: 'Top com bojo removível e alças cruzadas nas costas para máxima sustentação. Ideal para corrida e crossfit. O tecido respirável mantém você seca durante todo o treino.',
      price: 89.90,
      categoryId: categoryTops.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&q=80' }] },
      variants: {
        create: [
          { size: 'P', color: 'Preto', stock: 15, sku: 'TSE-PT-P' },
          { size: 'M', color: 'Preto', stock: 25, sku: 'TSE-PT-M' },
          { size: 'G', color: 'Preto', stock: 10, sku: 'TSE-PT-G' },
        ]
      }
    }
  });

  const p3 = await prisma.product.create({
    data: {
      name: 'Jaqueta Corta-Vento',
      slug: 'jaqueta-corta-vento',
      description: 'Leve, estilosa e funcional. A Jaqueta Corta-Vento é perfeita para treinos ao ar livre e dias mais frios. Possui capuz ajustável e bolsos laterais com zíper.',
      price: 229.90,
      categoryId: categoryCasacos.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1556817411-31ae72fa3ea8?w=800&q=80' }] },
      variants: {
        create: [
          { size: 'P', color: 'Branco', stock: 5, sku: 'JCV-BR-P' },
          { size: 'M', color: 'Branco', stock: 10, sku: 'JCV-BR-M' },
          { size: 'G', color: 'Branco', stock: 8, sku: 'JCV-BR-G' },
        ]
      }
    }
  });

  const p4 = await prisma.product.create({
    data: {
      name: 'Shorts Runner Pro',
      slug: 'shorts-runner-pro',
      description: 'Shorts duplo com bermuda interna de compressão para evitar atrito. Tecido externo super leve com aberturas laterais para maior amplitude de movimento.',
      price: 119.90,
      categoryId: categoryShorts.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1533681431008-959e980f673b?w=800&q=80' }] },
      variants: {
        create: [
          { size: 'M', color: 'Azul', stock: 12, sku: 'SRP-AZ-M' },
          { size: 'G', color: 'Azul', stock: 10, sku: 'SRP-AZ-G' },
        ]
      }
    }
  });

  const p5 = await prisma.product.create({
    data: {
      name: 'Conjunto Seamless Infinity',
      slug: 'conjunto-seamless-infinity',
      description: 'Conjunto sem costura que se adapta perfeitamente ao corpo como uma segunda pele. Valoriza as curvas e oferece liberdade total.',
      price: 259.90,
      categoryId: categoryConjuntos.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80' }] },
      variants: {
        create: [
          { size: 'P', color: 'Cinza', stock: 5, sku: 'CSI-CZ-P' },
          { size: 'M', color: 'Cinza', stock: 8, sku: 'CSI-CZ-M' },
        ]
      }
    }
  });

  const p6 = await prisma.product.create({
    data: {
      name: 'Regata DryFit Essential',
      slug: 'regata-dryfit-essential',
      description: 'A clássica regata cavada para os dias mais quentes. Tecido com tecnologia de rápida absorção de suor.',
      price: 69.90,
      categoryId: categoryRegatas.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80' }] },
      variants: {
        create: [
          { size: 'P', color: 'Branco', stock: 20, sku: 'RDE-BR-P' },
          { size: 'M', color: 'Branco', stock: 30, sku: 'RDE-BR-M' },
          { size: 'G', color: 'Branco', stock: 25, sku: 'RDE-BR-G' },
          { size: 'GG', color: 'Branco', stock: 10, sku: 'RDE-BR-GG' },
        ]
      }
    }
  });

  console.log('Database seeded successfully with 6 premium products!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
