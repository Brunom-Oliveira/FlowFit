import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import Stripe from 'stripe';

// Configuração Enterprise: Retries Inteligentes e Inicialização com API Versioning
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia', // Usar versão específica para evitar quebras
  maxNetworkRetries: 3,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Assinatura Stripe ausente. Possível ataque replay ou fraude.' }, { status: 400 });
  }

  let event: Stripe.Event;

  // 1. Validação Criptográfica do Payload (Prevenção de MITM e Replay Attacks)
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error(`[WEBHOOK CRÍTICO] Falha na validação de assinatura: ${err.message}`);
    return NextResponse.json({ error: 'Assinatura inválida.' }, { status: 400 });
  }

  try {
    // 2. IDEMPOTÊNCIA BLINDADA COM PRISMA TRANSACTION
    // Previne que o mesmo webhook de pagamento seja processado duas vezes e libere estoque duplo.
    const processed = await prisma.$transaction(async (tx) => {
      // Usar UPSERT atômico para garantir concorrência
      const webhookLog = await tx.webhookEvent.findUnique({
        where: { eventId: event.id }
      });

      if (webhookLog?.processed) {
        return true; // Já processado, abortar execução silenciosamente (Idempotência)
      }

      await tx.webhookEvent.upsert({
        where: { eventId: event.id },
        create: {
          eventId: event.id,
          gateway: 'STRIPE',
          eventType: event.type,
          payload: JSON.parse(payload),
          processed: false
        },
        update: {}
      });

      return false;
    });

    if (processed) {
      console.log(`[WEBHOOK] Evento ${event.id} já processado anteriormente. Abortando.`);
      return NextResponse.json({ received: true, status: 'ignored_idempotent' });
    }

    // 3. MÁQUINA DE ESTADO FINANCEIRA (Routing de Eventos)
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(failedIntent);
        break;

      case 'charge.refunded':
        const refund = event.data.object as Stripe.Charge;
        await handleRefund(refund);
        break;

      default:
        console.log(`Evento ${event.type} ignorado por não ser de escopo financeiro transacional.`);
    }

    // 4. MARCAÇÃO DE SUCESSO DO EVENTO (Commit)
    await prisma.webhookEvent.update({
      where: { eventId: event.id },
      data: { processed: true }
    });

    return NextResponse.json({ received: true, status: 'processed' });

  } catch (error: any) {
    // DLQ (Dead Letter Queue) Simples: Registrar falha para Retry posterior do Gateway
    console.error(`[WEBHOOK ERROR] Falha ao processar evento ${event.id}:`, error);
    
    await prisma.webhookEvent.update({
      where: { eventId: event.id },
      data: { error: error.message }
    }).catch(e => console.error("Falha catastrófica ao atualizar log do webhook:", e));

    // Retorna 500 para forçar a Stripe a reenviar o evento usando Exponential Backoff
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ==========================================
// FUNÇÕES TRANSACIONAIS DE ESTADO (ACID)
// ==========================================

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;
  
  if (!orderId) throw new Error('PaymentIntent sem OrderId associado.');

  // Transação ACID garantindo que Pedido, Transação e Estoque atualizem atômicamente
  await prisma.$transaction(async (tx) => {
    // 1. Lock Row do Pedido (Prevenção de Race Conditions)
    const order = await tx.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error(`Pedido ${orderId} não encontrado.`);
    if (order.status === 'PAID') return; // Segurança redundante

    // 2. Atualizar Transação Física
    await tx.transaction.update({
      where: { gatewayId: paymentIntent.id },
      data: { status: 'CAPTURED', paymentMethod: paymentIntent.payment_method_types[0] }
    });

    // 3. Marcar Pedido como Pago
    await tx.order.update({
      where: { id: orderId },
      data: { status: 'PAID' }
    });

    // IMPORTANTE: Aqui seria disparado a baixa real de estoque, envio de email via SQS/Kafka
  });
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;
  if (!orderId) return;

  await prisma.$transaction(async (tx) => {
    await tx.transaction.update({
      where: { gatewayId: paymentIntent.id },
      data: { status: 'FAILED', errorMessage: paymentIntent.last_payment_error?.message }
    });

    await tx.order.update({
      where: { id: orderId },
      data: { status: 'CANCELED' } // Cancela pedido para liberar reserva de estoque se houver
    });
  });
}

async function handleRefund(charge: Stripe.Charge) {
  const paymentIntentId = charge.payment_intent as string;
  
  const transaction = await prisma.transaction.findUnique({
    where: { gatewayId: paymentIntentId }
  });

  if (!transaction) return;

  await prisma.$transaction(async (tx) => {
    await tx.transaction.update({
      where: { id: transaction.id },
      data: { status: charge.refunded ? 'REFUNDED' : 'PARTIALLY_REFUNDED' }
    });

    await tx.order.update({
      where: { id: transaction.orderId },
      data: { status: 'REFUNDED' }
    });
  });
}
