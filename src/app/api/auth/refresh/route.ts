import { NextRequest, NextResponse } from 'next/server';
import { rotateSessionToken } from '../../../../lib/session';

export async function POST(request: NextRequest) {
  try {
    const refreshTokenCookie = request.cookies.get('refresh_token')?.value;

    if (!refreshTokenCookie) {
      return NextResponse.json({ error: 'Token de atualização ausente' }, { status: 401 });
    }

    const ipAddress = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Executa a rotação de token segura com Single-Use Tokens e checagem de Replay/Theft
    const result = await rotateSessionToken(refreshTokenCookie, ipAddress, userAgent);

    if (result?.error) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json({ success: true, message: 'Sessão rotacionada e estendida com sucesso' }, { status: 200 });
  } catch (err) {
    console.error('[API_REFRESH_ERROR]', err);
    return NextResponse.json({ error: 'Erro interno do servidor ao atualizar a sessão' }, { status: 500 });
  }
}
