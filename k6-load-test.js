import http from 'k6/http';
import { check, sleep } from 'k6';

// 🚀 SPRINT 4: TESTES DE ESTRESSE & THROUGHPUT ENTERPRISE (k6 Load Test)
// Simulação de tráfego pesado focado em homologação de lançamento de nova coleção.
// Valida se o Incremental Static Regeneration (ISR) e o Stale-While-Revalidate (SWR)
// da CDN suportam milhares de acessos em massa sem derrubar o banco de dados Supabase.
export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp-up inicial rápido para 50 usuárias simultâneas
    { duration: '1m', target: 200 },  // Pico de estresse sustentado com 200 compradoras VIP ativas
    { duration: '30s', target: 0 },   // Ramp-down suave de encerramento
  ],
  thresholds: {
    // Critérios de aceitação estritos da nossa Consultoria de Performance
    http_req_duration: ['p(95)<100'], // 95% das requisições devem ser respondidas em menos de 100ms
    http_req_failed: ['rate<0.01'],   // Taxa de falha/timeout deve ser estritamente inferior a 1%
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:3000';

export default function () {
  // Cenário 1: Compradora acessando a Home e o Catálogo estático em cache (ISR)
  const resShop = http.get(`${BASE_URL}/shop`);
  check(resShop, {
    'Catálogo carregado com sucesso (status 200)': (r) => r.status === 200,
    'Tempo de resposta de borda < 50ms': (r) => r.timings.duration < 50,
  });

  sleep(1);

  // Cenário 2: App de parceiro consumindo a API REST de produtos com Stale-While-Revalidate
  const resApi = http.get(`${BASE_URL}/api/products`);
  check(resApi, {
    'API REST servida com sucesso (status 200)': (r) => r.status === 200,
    'Cabeçalho de Cache SWR injetado': (r) => r.headers['Cache-Control'] !== undefined,
  });

  sleep(0.5);
}
