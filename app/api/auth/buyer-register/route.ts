import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createBuyerCookie } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, name, phone } = body;

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: 'Email, contraseña y nombre son requeridos' },
      { status: 400 }
    );
  }

  try {
    // Verificar si el email ya existe
    const existingBuyer = await prisma.buyerUser.findUnique({ where: { email } });
    if (existingBuyer) {
      return NextResponse.json({ error: 'Este email ya está registrado' }, { status: 409 });
    }

    // Crear nuevo buyer
    const newBuyer = await prisma.buyerUser.create({
      data: {
        email,
        password: hashPassword(password),
        name,
        phone: phone || undefined,
      },
    });

    const response = NextResponse.json(
      { success: true, buyer: { id: newBuyer.id, email: newBuyer.email, name: newBuyer.name } },
      { status: 201 }
    );

    response.headers.append('Set-Cookie', createBuyerCookie(newBuyer.id));
    return response;
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
