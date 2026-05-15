# 🏛️ FlowFit Enterprise Architecture

## 1. Visão Geral (Executive Summary)
O **FlowFit Storefront** é uma plataforma de e-commerce premium desenvolvida sob a filosofia *Mobile-First* e *Cloud-Native*. Projetada para suportar picos extremos de tráfego (Black Friday) com tolerância a falhas via Vercel Edge Network e banco de dados relacional (PostgreSQL) protegido pelo Prisma ORM.

## 2. Decisões Arquiteturais (ADR)
Adotamos uma arquitetura de **Monolito Modular Moderno** utilizando **Next.js App Router (React Server Components)**.
- **Por que não Microsserviços puros?** A sobrecarga de latência de rede entre serviços de Catálogo e Carrinho prejudicaria a métrica de *Time to Interactive* (TTI). O monólito garante transações ACID atômicas usando o mesmo pool de banco.
- **Edge Computing:** Operações críticas (RBAC, Carrinho) executam na Borda (Vercel Edge), reduzindo a latência para < 50ms globalmente.
- **Isolamento de Estado:** Zustand/Context API para estado efêmero do cliente, e PostgreSQL para estado persistente, eliminando problemas de dessincronização de cache.

## 3. Topologia e Componentes (C4 Model)

### Nível 1: Contexto de Sistema
- **Customer:** Acessa a vitrine (Next.js SSR/ISR).
- **Admin:** Acessa o Dashboard restrito (RBAC Middleware).
- **Payment Gateway (Stripe/MP):** Processa transações via API HTTP e sinaliza eventos via Webhooks assíncronos.

### Nível 2: Contêineres
- **Web App (Next.js):** Gerencia UI, Server Actions e Endpoints de API.
- **Database (PostgreSQL):** Única fonte de verdade (Single Source of Truth). Protegida por VPC privada.
- **CDN (Vercel/Cloudflare):** Cache de imagens de produtos e assets estáticos (ISR).

## 4. Fluxo Transacional (DDD)
A aplicação respeita fronteiras estritas de domínio:
1. `Identity`: Autenticação, RBAC, MFA, JWT.
2. `Catalog`: Produtos, Variantes, Inventário.
3. `Cart & Checkout`: Cesta de compras e cálculo de desconto de Cashback.
4. `Billing`: Intenções de pagamento, Idempotência de Webhook e Faturamento.

## 5. Padrões de Código
- **Fail-Fast:** Todas as rotas de API validam *payloads* no início da execução.
- **Idempotência Forte:** Todo *webhook* de pagamento utiliza a tabela `WebhookEvent` com constraint única para impedir recálculos.
- **Server Actions:** O uso rigoroso de Server Actions em Next.js para mutações de dados substitui APIs tradicionais de Front-end, mitigando vetores de ataque CSRF.
