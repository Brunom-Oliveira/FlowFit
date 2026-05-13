import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, orderId, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
    }

    const sanitizedEmail = email.trim().toLowerCase();
    if (sanitizedEmail.length > 254) {
      return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 });
    }

    // TODO: Integrar com serviço de e-mail (Resend, SendGrid, SES)
    console.info('[Contact] New message:', { name, email: sanitizedEmail, orderId, message });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
