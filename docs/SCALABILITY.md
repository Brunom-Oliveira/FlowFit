# 📈 Documentação de Escalabilidade Corporativa

Este documento descreve como a plataforma FlowFit suporta crescimentos súbitos (Picos Múltiplos) sem degradação de performance.

## 1. Arquitetura de Cache Multi-Camada
Para proteger o banco de dados de leituras excessivas (Reads), aplicamos 3 camadas de cache:
1. **Edge CDN (Vercel):** Páginas estáticas geradas no momento de Build e servidas diretamente dos nós globais da Vercel. 
2. **Next.js Data Cache (ISR):** Consultas de Produtos utilizam cache estendido (`revalidate: 3600`). Somente se um administrador alterar o produto no painel, disparamos a server action `revalidateTag('products')` para limpar o cache seletivamente.
3. **Database Connection Pooling:** O uso de PgBouncer (ou similar no Supabase/RDS) garante que 10.000 requisições simultâneas não abram 10.000 conexões com o PostgreSQL, e sim as multiplexem em 50 a 100 conexões pesadas.

## 2. Escalabilidade Horizontal
- Sendo construído com funções Serveless (Next.js App Router em Nuvem Edge), o aplicativo automaticamente escala de 0 para 100.000 instâncias concorrentes.
- A restrição se torna puramente a escrita no Banco de Dados (Transações).

## 3. Gestão de Tráfego Massivo (Filas e Filas Distribuídas)
Em um cenário futuro onde o pico atinge a capacidade máxima de gravação do banco:
- A intenção de compra será transferida de transacional puro para um barramento Assíncrono (ex: Kafka ou AWS SQS).
- O pedido entrará como "Fila de Processamento" no banco, e *Workers* isolados processarão o pagamento sem travar o tráfego do site principal.
