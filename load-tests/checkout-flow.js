import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Métrica customizada de sucesso de pagamentos
export const paymentSuccessRate = new Rate('payment_success_rate');

// Simula Black Friday: 100 usuários constantes por 3 minutos batendo na API de checkout
export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp up
    { duration: '2m', target: 100 },  // Peak traffic
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% das requests devem responder em menos de 500ms
    http_req_failed: ['rate<0.01'],   // Taxa de erro máxima de 1%
    payment_success_rate: ['rate>0.99'] // 99% dos checkouts simulados devem retornar 200
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // 1. Simula visualização de produto (Read Pesado)
  let res = http.get(`${BASE_URL}/api/products/vitrine`);
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);

  // 2. Simula criação de PaymentIntent na API (Write Pesado / I/O Externo)
  const payload = JSON.stringify({
    items: [{ id: 'prod_123', quantity: 2, size: 'M' }],
    currency: 'brl'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer test_token_user_${__VU}`
    },
  };

  res = http.post(`${BASE_URL}/api/checkout/intent`, payload, params);
  
  const isSuccess = check(res, { 
    'intent created 200': (r) => r.status === 200,
    'has clientSecret': (r) => JSON.parse(r.body).clientSecret !== undefined
  });

  paymentSuccessRate.add(isSuccess);
  sleep(2);
}
