# 🐳 Dockerfile Multi-Stage de Grau Enterprise
# Otimizado para Next.js Standalone com Prisma ORM no Node.js 24 Alpine

# --- Estágio 1: Dependências Base ---
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copia pacotes para cache de camadas
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Instala dependências nativas
RUN npm ci

# --- Estágio 2: Build da Aplicação ---
FROM node:24-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variáveis de build-time seguras
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Gera o Prisma Client nativamente para Alpine
RUN npx prisma generate

# Executa o build de produção (Standalone Output configurado no Next)
RUN npm run build

# --- Estágio 3: Imagem de Produção Leve (Runner) ---
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache openssl

# Cria usuário não-root por segurança (Princípio de Menor Privilégio)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia apenas os arquivos estáticos e de build essenciais
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

# Executa a aplicação via entrypoint standalone otimizado
CMD ["node", "server.js"]
