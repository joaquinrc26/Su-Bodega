import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createBuyerCookie } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 });
  }

  try {
    const buyer = await prisma.buyerUser.findUnique({ where: { email } });

    if (!buyer || buyer.password !== password) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const response = NextResponse.json(
      { success: true, buyer: { id: buyer.id, email: buyer.email, name: buyer.name } },
      { status: 200 }
    );

    response.headers.append('Set-Cookie', createBuyerCookie(buyer.id));
    return response;
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
