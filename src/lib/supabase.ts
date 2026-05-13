import { createClient } from '@supabase/supabase-js';

// Consome dinamicamente a URL e a Chave Pública de API (Anon/Publishable Key) configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zpfeutpokctckuxxtpxr.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_PgKADt-7AweMx17Z0ZSHnw_s8gBDeB6';

/**
 * Cliente de Integração Corporativa com o Supabase
 * Suporta o ecossistema completo: Storage de Imagens de Alta Fidelidade, Realtime e Observabilidade em Nuvem.
 */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // O Prisma já gerencia sessões isomorfas de borda com Opaque RTR de forma autônoma
  },
});

/**
 * Helper Enterprise para Upload Seguro de Imagens de Produtos no Storage do Supabase
 * @param bucket Nome do Bucket (ex: 'products')
 * @param path Caminho do arquivo (ex: 'leggings/premium-preta.png')
 * @param file Arquivo binário da imagem
 */
export async function uploadProductImage(bucket: string, path: string, file: File) {
  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (error) {
      console.error('[SUPABASE_STORAGE_ERROR]', error);
      return { error: 'Falha ao gravar a imagem no Storage da nuvem.' };
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return { success: true, url: publicUrlData.publicUrl };
  } catch (err) {
    console.error('[SUPABASE_UPLOAD_EXCEPTION]', err);
    return { error: 'Exceção de rede ao conectar ao Supabase Storage.' };
  }
}
