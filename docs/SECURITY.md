# 🔐 Security & PCI DSS Compliance Manifesto

## 1. Tratamento de Dados de Cartão (PCI DSS)
A infraestrutura FlowFit **nunca** processa, toca ou armazena PANs (Primary Account Numbers) ou CVCs dos cartões de crédito.
- Utilizamos a biblioteca **Stripe Elements** (`@stripe/react-stripe-js`).
- O formulário gera um campo de entrada encapsulado em um `iframe` seguro conectado diretamente aos servidores da Stripe.
- O Back-end FlowFit trabalha apenas com `PaymentIntents` opacos e Segredos de Cliente efêmeros.

## 2. Autenticação e Controle de Acesso (RBAC)
- **Zero Trust:** Todas as Server Actions verificam a sessão do usuário chamando `getSession()` internamente, nunca confiando no cliente.
- **Tokens (JWT):** Apenas o ID do usuário e a Função (Role) são incluídos no JWT. Nenhum dado sensível (como saldo) é incluído no token.
- **MFA (Multi-Factor Authentication):** Administradores com `role: 'ADMIN'` devem possuir TOTP habilitado para modificar preços ou ler relatórios de catálogos.
- **Escalonamento Horizontal de Privilégios (BOLA/IDOR):** As consultas de banco (`userId`) são sempre fixadas ao usuário da sessão, impedindo que `/api/orders?userId=999` revele dados de terceiros.

## 3. Vetores OWASP Mitigados
| Vetor OWASP | Mitigação no FlowFit | Nível de Proteção |
| :--- | :--- | :--- |
| **A01: Broken Access Control** | Middleware Next.js e Validação Intransigente em Server Actions. | Alto |
| **A02: Cryptographic Failures**| TLS 1.3 obrigatório (Cloudflare/Vercel) e bcrypt para Hashes. | Alto |
| **A03: Injection (SQLi)** | Uso exclusivo do Prisma ORM que parametriza consultas de forma estrita. | Alto |
| **A04: Insecure Design** | Limite rígido de tentativas de login, proteção contra força bruta. | Alto |
| **A07: Ident. & Auth Failures** | Bloqueio temporário da conta (`lockoutUntil`) após 5 tentativas falhas. | Alto |

## 4. Proteção de Webhooks
Os pagamentos são notificados via Webhooks públicos. Para evitar ataques de *Replay* e simulação de pagamentos, aplicamos:
1. **Validação de Assinatura HMAC:** Extração de `stripe-signature` ou `x-signature` do Mercado Pago comparada contra os Segredos do `.env`.
2. **Idempotência (Banco de Dados):** Todo ID de Evento vira uma constraint `UNIQUE` na tabela `WebhookEvent` do PostgreSQL. Se um Hacker reenviar o mesmo *payload* assinado, o banco o rejeitará.
