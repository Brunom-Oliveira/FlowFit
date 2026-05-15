# 🚀 Guia de Onboarding (Engenharia FlowFit)

Bem-vindo ao esquadrão de elite da engenharia FlowFit. Este guia garante que você suba o ambiente de desenvolvimento em menos de 15 minutos, sem fricção.

## 1. Setup do Ambiente Local

### Pré-requisitos
- Node.js LTS (v20+)
- Docker Desktop (Para o banco de dados local)
- Git e VS Code (com extensões Prisma e Tailwind)

### Passo a Passo
1. Clone o repositório:
   ```bash
   git clone https://github.com/empresa/flowfit.git
   cd flowfit/apps/storefront
   ```
2. Instale dependências de forma rígida:
   ```bash
   npm ci
   ```
3. Suba o Banco de Dados Local efêmero:
   ```bash
   docker-compose up -d
   ```
4. Copie as variáveis de ambiente base:
   ```bash
   cp .env.example .env
   ```
5. Sincronize o Prisma ORM e insira sementes (Admin e Produtos de Teste):
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
6. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 2. Padrões e Convenções de Código
- **Componentes React:** Utilizamos *Server Components* por padrão. Só marque um arquivo com `"use client"` se ele precisar de estado (`useState`), ciclo de vida (`useEffect`) ou APIs do navegador (ex: `window`).
- **Commits:** Siga o *Conventional Commits* (ex: `feat: add stripe webhook`, `fix: checkout crash on mobile`).
- **Linting:** O `npm run lint` falhará seu commit via Husky (Git Hook) se houverem erros críticos.

## 3. Guia Rápido de Testes (QA)
Para executar validações antes de subir seu código:
```bash
npm run test:unit      # Testes do Jest
npx playwright test    # Testes visuais e de fluxo de E2E
```
