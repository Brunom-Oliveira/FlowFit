# 👁️ Estratégia de Observabilidade e Auditoria

Se um servidor cai em uma floresta (VPS) e ninguém percebe, o prejuízo é em milhares de reais. Este documento normatiza a telemetria do E-commerce FlowFit.

## 1. Tríade da Observabilidade (Metrics, Traces, Logs)
- **Logs:** Para depuração histórica. Não usamos `console.log()` comum em áreas críticas; encapsulamos em uma interface de `Logger` que direciona erros fatais (`error()`) ou avisos (`warn()`) para um agregador.
- **Traces:** Usados para entender o *gargalo* da rede. Rastreia o tempo exato desde que o Front-end envia um clique até a finalização do banco de dados (Sentry APM / Datadog).
- **Métricas:** Relatórios vitais em tempo real. Exemplo: Taxa de carrinhos abandonados por minuto, Tempo de resposta `p99` das APIs.

## 2. Monitoramento de Front-end (Sentry)
Nenhum "Erro Vermelho" do React na máquina do cliente deve ser ignorado.
- Instalamos o Sentry SDK no Next.js.
- Se o celular de um cliente gerar falha ao tentar parsear o retorno do Checkout de Pagamentos, o Sentry captura a tela em background e manda um e-mail para a equipe, avisando qual dispositivo exato (ex: Safari no iOS 16) sofreu o Bug.

## 3. Logs Financeiros e Auditoria (PCI)
- Todo evento originado por administradores é salvo na tabela `AuthLog`. O sistema registra qual usuário `ADMIN` apagou um produto, junto com seu Endereço de IP e data exata, para rastreio criminal (Cybersecurity Forensics).
- Nunca injetamos "Payloads Cruz" nos logs. Números de cartão, E-mails e senhas **nunca** aparecem no log. O log deve exibir: `Iniciada transação user_598x, status: aprovado`.

## 4. Gerenciamento de Alertas (Alerting)
A pipeline de Observabilidade atinge a engenharia via Webhook do Slack.
- **Level Warning:** Uma API de Terceiros demorou 3 segundos. (Apenas log no Slack).
- **Level Fatal:** O Prisma não conseguiu conexão com o Banco em 5 tentativas. (Dispara alarme visual e sonoro via PagerDuty para o Engenheiro de Plantão).
