"use server";

import { prisma } from '../../lib/prisma';
import { getSession } from '../../lib/session';
import { revalidatePath } from 'next/cache';

export interface ProfileUpdateResult {
  success: boolean;
  error?: string;
}

// 🚀 CONSULTORIA ENTERPRISE: SERVER ACTION DE PROGRESSIVE PROFILING (Fase 6)
// Atualização blindada de informações logísticas e de contato diretamente no PostgreSQL.
// Inclui sanitização nativa e revalidação de cache da rota para reflexo visual instantâneo.
export async function updateCustomerProfileAction(formData: FormData): Promise<ProfileUpdateResult> {
  const session = await getSession();

  if (!session || !session.userId) {
    return { success: false, error: 'Sessão de usuário inválida ou expirada.' };
  }

  const phone = formData.get('phone') as string || '';
  const addressZip = formData.get('addressZip') as string || '';
  const addressStreet = formData.get('addressStreet') as string || '';
  const addressNumber = formData.get('addressNumber') as string || '';
  const addressComplement = formData.get('addressComplement') as string || '';
  const addressNeighborhood = formData.get('addressNeighborhood') as string || '';
  const addressCity = formData.get('addressCity') as string || '';
  const addressState = formData.get('addressState') as string || '';

  try {
    await prisma.user.update({
      where: { id: String(session.userId) },
      data: {
        phone,
        addressZip,
        addressStreet,
        addressNumber,
        addressComplement,
        addressNeighborhood,
        addressCity,
        addressState,
        isProfileComplete: true, // Promove a conta para o patamar de Perfil Completo
      }
    });

    // Força a revalidação da Borda para atualizar os cartões e formulários do Next.js
    revalidatePath('/conta');
    revalidatePath('/checkout');

    return { success: true };
  } catch (error) {
    console.error('[PROFILE UPDATE ERROR]', error);
    return { success: false, error: 'Falha ao persistir endereço no banco de dados. Tente novamente.' };
  }
}
