# 🛠️ Documentação Operacional e Resposta a Incidentes (Runbook)

## 1. Monitoramento e Alertas (Nível 1)
O sistema FlowFit opera com gatilhos de alerta críticos baseados em APM (Application Performance Monitoring).
- **Timeouts de Banco (Prisma):** Se `p99` de queries exceder 3 segundos, um alerta vai para o PagerDuty/Slack.
- **Falha de Webhooks:** Se a taxa de respostas HTTP 500 no endpoint `/api/webhooks/stripe` for maior que 1%, a engenharia é notificada instantaneamente.

## 2. Procedimentos de Troubleshooting
### 2.1. O Site não carrega (Error 500 / 502 Bad Gateway)
1. Verifique os logs de build da Vercel. 
2. Se o build for antigo e estiver caindo, verifique o banco de dados. Um limite de conexões excedido no PostgreSQL causa falhas em cascata.
3. **Ação Rápida:** Ativar o recurso `PgBouncer` (Pooler) no Supabase ou RDS para segurar as conexões de borda.

### 2.2. Pagamentos estão falhando (Cartão sempre Recusado)
1. Confirme se as chaves da Stripe no painel administrativo (`.env`) foram trocadas acidentalmente para `sk_test_` em produção.
2. Cheque o log do Webhook na Dashboard da Stripe. Se a assinatura estiver falhando, atualize a `STRIPE_WEBHOOK_SECRET`.

## 3. Recovery Guide (Recuperação de Desastre)
Caso o banco principal caia ou seja corrompido:
1. Navegar até o serviço Cloud de banco de dados (ex: AWS RDS ou Supabase).
2. Acionar a Restauração Point-in-Time (PITR), voltando o banco para 5 minutos antes do desastre.
3. Em paralelo, a aplicação Vercel ficará cacheada (ISR servindo páginas antigas) durante a recuperação, limitando a percepção de indisponibilidade pelo cliente.
