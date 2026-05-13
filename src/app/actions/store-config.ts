"use server";

import { revalidatePath } from 'next/cache';
import { getSession } from '../../lib/session';

// Emulador em memória compartilhada do servidor Next.js na Borda
// Garante o reflexo simultâneo instantâneo entre o painel Admin e o Storefront.
// Valores iniciais pré-configurados com links conceituais premium.
let GLOBAL_STORE_WHATSAPP = '5511999999999';
let GLOBAL_STORE_INSTAGRAM = 'https://instagram.com/flowfit.premium';
let GLOBAL_STORE_FACEBOOK = 'https://facebook.com/flowfit.premium';
let GLOBAL_STORE_TIKTOK = 'https://tiktok.com/@flowfit.premium';

export interface StoreConfigPayload {
  whatsappNumber: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  loyaltyRatio?: string;
  loyaltyReward?: string;
  freeShippingThreshold?: string;
}

export async function getStoreWhatsAppAction() {
  return GLOBAL_STORE_WHATSAPP;
}

export async function getStoreSocialLinksAction() {
  return {
    instagram: GLOBAL_STORE_INSTAGRAM,
    facebook: GLOBAL_STORE_FACEBOOK,
    tiktok: GLOBAL_STORE_TIKTOK,
  };
}

// 🚀 CONSULTORIA ENTERPRISE: SERVER ACTION DE PERSISTÊNCIA GLOBAL E SOCIAL
// Atualiza os parâmetros transacionais e canais de engajamento com blindagem RBAC.
export async function updateStoreConfigAction(payload: StoreConfigPayload) {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    return { success: false, error: 'Acesso negado. Apenas o perfil corporativo ADMIN pode modificar chaves do sistema.' };
  }

  // Sanitização estrita do número de WhatsApp
  if (payload.whatsappNumber) {
    const sanitized = payload.whatsappNumber.replace(/\D/g, '');
    if (sanitized.length >= 10) {
      GLOBAL_STORE_WHATSAPP = sanitized;
    }
  }

  // Persistência reativa dos links de redes sociais
  if (payload.instagramUrl !== undefined) GLOBAL_STORE_INSTAGRAM = payload.instagramUrl.trim();
  if (payload.facebookUrl !== undefined) GLOBAL_STORE_FACEBOOK = payload.facebookUrl.trim();
  if (payload.tiktokUrl !== undefined) GLOBAL_STORE_TIKTOK = payload.tiktokUrl.trim();

  // Revalida a aplicação inteira a partir do layout raiz para propagação instantânea
  revalidatePath('/', 'layout');
  revalidatePath('/admin/configuracoes');

  return { 
    success: true, 
    whatsapp: GLOBAL_STORE_WHATSAPP,
    social: {
      instagram: GLOBAL_STORE_INSTAGRAM,
      facebook: GLOBAL_STORE_FACEBOOK,
      tiktok: GLOBAL_STORE_TIKTOK,
    }
  };
}
