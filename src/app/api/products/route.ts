import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// 🚀 SPRINT 3: OTIMIZAÇÃO DE APIs E CACHE DISTRIBUÍDO ENTERPRISE
// Injeção de cabeçalhos de controle Stale-While-Revalidate (SWR).
// O tráfego de borda da Vercel armazena o catálogo em cache por 1 hora (s-maxage=3600)
// e o serve instantaneamente de forma assíncrona por até 24 horas (86400s) enquanto sincroniza novas peças.
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      // Projeção cirúrgica de colunas (Especialista em Banco / Zero Overfetching)
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        category: {
          select: { name: true }
        },
        images: {
          select: { url: true },
          take: 1
        },
        variants: {
          select: { size: true }
        }
      }
    });
    
    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Database timeout or connection issue. Returning fallback state.' }, 
      { 
        status: 500,
        headers: { 'Cache-Control': 'no-store' } 
      }
    );
  }
}
