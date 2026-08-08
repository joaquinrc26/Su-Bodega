import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getBuyerIdFromCookie } from '@/lib/auth';

export async function GET(request: Request) {
  const buyerId = getBuyerIdFromCookie(request);

  if (!buyerId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const buyer = await prisma.buyerUser.findUnique({
      where: { id: buyerId },
      select: {
        id: true,
        name: true,
        email: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            items: true,
          },
        },
      },
    });

    if (!buyer) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(
      {
        buyer: {
          id: buyer.id,
          name: buyer.name,
          email: buyer.email,
        },
        orders: buyer.orders,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}