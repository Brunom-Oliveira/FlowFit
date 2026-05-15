# 🎨 Documentação Front-end e UX/UI Enterprise

Este documento descreve as convenções visuais, a biblioteca de componentes e as diretrizes estritas de UX para o E-commerce FlowFit.

## 1. Stack Visual & UI Core
Nossa arquitetura de interface é desenhada para ser agnóstica e atômica.
- **Framework de Base:** React 18+ (Next.js App Router).
- **Estilização:** TailwindCSS (Utilitário First) com tokens estritos no `tailwind.config.ts`.
- **Biblioteca de Componentes (Design System):** Radix UI / ShadCN UI para garantir Acessibilidade WCAG 2.1 AAA nativamente (Navegação por Teclado, Screen Readers).
- **Micro-animações:** Framer Motion (Transições de Roteamento e Hover States Premium).

## 2. Princípios de Experiência do Usuário (UX)
1. **Zero Fricção (CRO):** O fluxo de adicionar ao carrinho e iniciar checkout deve ocorrer com no máximo 2 toques no celular.
2. **Mobile First Irrestrito:** Todo desenvolvimento começa simulando um viewport de 360px de largura. Os breakpoints maiores (`md`, `lg`, `xl`) são aprimoramentos.
3. **Skeleton Loaders:** Nunca exiba "Loading..." textuais. Use estados espinha-de-peixe (`Skeletons`) para que a mente do cliente já perceba o layout antes de a foto carregar.
4. **Feedback de Estado Imediato:** Botões de envio devem transmutar para estado `disabled + spinner` milissegundos após o toque (Prevenção de dupla-cobrança).

## 3. Padrão de Arquitetura de Componentes
O ecossistema respeita a separação "Presentational vs Container".
```typescript
// Componente Burro (UI Pura) -> Reutilizável, testa apenas props.
export function BotaoComprarUI({ onClick, disabled }) { ... }

// Componente Inteligente (Container) -> Conecta ao Banco/Estado Global.
export function AddToCartContainer({ productId }) {
  const { handleAdd } = useCartStore();
  return <BotaoComprarUI onClick={() => handleAdd(productId)} />;
}
```

## 4. Estado Global (Client-Side)
- **Carrinho e Notificações:** Utilização de `Zustand` ou `Context API` otimizada.
- **Dados Reativos de Banco:** Utilização dos *Server Components* do Next.js. Não trazemos a biblioteca pesada `React Query` a menos que seja imperativo para poling no Front-end, visando diminuir o Bundle final (Lighthouse Score 100).
