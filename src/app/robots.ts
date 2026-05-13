import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/conta/',
        '/checkout/',
        '/api/',
        '/*?*discountValue=', // Previne indexação de variações de cupons dinâmicos
      ],
    },
    sitemap: 'https://flowfit.com/sitemap.xml',
  };
}
