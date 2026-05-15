<div align="center">
  <h1>🚀 FlowFit Storefront Enterprise</h1>
  <p><strong>A Plataforma Definitiva de E-commerce de Moda Fitness Premium Feminina</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js&logoColor=white)](#)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](#)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql&logoColor=white)](#)
  [![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white)](#)
  [![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?logo=playwright&logoColor=white)](#)
  [![Vercel](https://img.shields.io/badge/Vercel-Edge-000000?logo=vercel&logoColor=white)](#)
</div>

---

## 📖 Visão Geral

O **FlowFit Storefront** é uma arquitetura de e-commerce Monolítica Modular (Cloud-Native), projetada para conversão de alto impacto e estabilidade máxima sob tráfego severo (Black Friday). Utilizamos as mais avançadas técnicas de *Server-Side Rendering* (SSR), *Incremental Static Regeneration* (ISR) e transações ACID no banco de dados para garantir que a experiência do usuário seja fluida e o processamento financeiro seja matematicamente inquebrável.

## ✨ Features Premium

- **⚡ Core Vitrine Ultra Rápida:** Carregamento quase instantâneo utilizando a rede de borda (Edge Network) da Vercel.
- **🛡️ Segurança Bancária (PCI-DSS):** Integração com *Stripe Elements*. O servidor nunca manipula dados sensíveis de cartão de crédito.
- **💳 Conciliação Assíncrona:** Webhooks resilientes com trava de Idempotência. Se a rede cair, o sistema nunca emite faturamentos duplicados.
- **🤖 Motor de Testes Enterprise:** Qualidade garantida por fluxos robustos no Jest (Testes Unitários) e Playwright (Testes de Interface E2E).
- **🔒 RBAC (Role-Based Access Control):** Rotas administrativas protegidas via *Server Actions* impenetráveis e JWT estrito.
- **💎 Motor de Fidelidade (Cashback):** Subsistema inteligente de recompensas dinâmicas acoplado diretamente ao carrinho.

## 🏗️ Stack Tecnológica

| Camada | Tecnologia | Motivo da Escolha |
| --- | --- | --- |
| **Front-end UI** | React 18, Next.js (App Router), TailwindCSS | Renderização otimizada, SEO impecável e Core Web Vitals perfeitos. |
| **Banco de Dados** | PostgreSQL | Proteção financeira absoluta usando consistência relacional e restrições rigorosas. |
| **ORM & Mutações** | Prisma | Typesafe queries e prevenção primária de SQL Injection. |
| **Integração Pagamento** | Stripe & Mercado Pago | Processamento global, tokenização segura e pagamentos via PIX. |
| **Testes (QA)** | Jest, Playwright, k6 | Automação e blindagem ponta-a-ponta e detecção de anomalias visuais e gargalos. |

---

## 🚀 Como Iniciar (Quickstart)

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) LTS (v20+)
- [Docker](https://www.docker.com/) e Docker Compose (para rodar o banco localmente)
- Git

### 2. Instalação

```bash
# Clone o repositório
git clone https://github.com/flowfit/flowfit-storefront.git

# Acesse a pasta do projeto
cd flowfit-storefront

# Instale dependências fixas
npm ci
```

### 3. Setup de Ambiente
Copie o arquivo base de ambiente para carregar as chaves:
```bash
cp .env.example .env.local
```
*(Certifique-se de popular as variáveis `DATABASE_URL` e `STRIPE_SECRET_KEY` com os dados corretos no `.env.local`)*

### 4. Banco de Dados e Sementes
```bash
# Suba o container do PostgreSQL em background
docker-compose up -d

# Sincronize as tabelas do Prisma ORM
npx prisma db push

# (Opcional) Crie o usuário Administrador padrão
npx ts-node prisma/create-admin.ts
```

### 5. Executar Servidor
```bash
npm run dev
```
O sistema estará rodando em `http://localhost:3000`.

---

## 🧪 Comandos Úteis e Testes

Mantemos um nível rigoroso de cobertura de código antes de qualquer implantação via CI/CD.

```bash
# Iniciar Testes Unitários e Lógicos (Jest)
npm run test:unit

# Executar Testes de Cobertura (Gera relatório em /coverage)
npm run test:coverage

# Acionar os Robôs de E2E (Playwright - Requer a porta 3000 online)
npx playwright test

# Formatar e auditar Linting do TypeScript
npm run lint
```

---

## 📚 Documentação Corporativa Interna

A estrutura do E-commerce vai muito além deste README. Para desenvolvedores avançados, arquitetos e DevOps, visite o **[Portal de Documentação Local (`/docs`)](./docs)** do repositório:

- [Arquitetura e Monolito Modular (`ARCHITECTURE.md`)](./docs/ARCHITECTURE.md)
- [Design System e Padrões UX (`FRONTEND_UX.md`)](./docs/FRONTEND_UX.md)
- [Conformidade PCI e Segurança (`SECURITY.md`)](./docs/SECURITY.md)
- [Operações e Resposta a Incidentes (`OPERATIONS.md`)](./docs/OPERATIONS.md)
- [Escalabilidade de Banco e Caching (`SCALABILITY.md`)](./docs/SCALABILITY.md)
- [Especificação de Contratos de API (`SWAGGER.yaml`)](./docs/SWAGGER.yaml)

---

## 🤝 Fluxo de Contribuição
1. **Branching:** Crie uma branch com o prefixo correto: `feat/nome-da-feature`, `fix/correcao-urgente`.
2. **Quality Gates:** Ao abrir um *Pull Request*, o GitHub Actions exigirá que o código compile (TypeScript Zero Errors) e que os testes do Playwright/Jest fiquem Verdes.
3. **Revisão:** Apenas *Merge* via "Squash" é permitido para manter o histórico principal limpo.

<div align="center">
  <br />
  <p>Construído com ❤️ e Alta Engenharia pelo time <b>FlowFit Enterprise</b>.</p>
</div>
