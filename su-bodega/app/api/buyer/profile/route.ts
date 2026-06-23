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
        email: true,
        name: true,
        phone: true,
        address: true,
        city: true,
        zipCode: true,
      },
    });

    if (!buyer) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(buyer, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const buyerId = getBuyerIdFromCookie(request);

  if (!buyerId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { phone, address, city, zipCode } = body;

    const updatedBuyer = await prisma.buyerUser.update({
      where: { id: buyerId },
      data: {
        phone: phone || undefined,
        address: address || undefined,
        city: city || undefined,
        zipCode: zipCode || undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        city: true,
        zipCode: true,
      },
    });

    return NextResponse.json(updatedBuyer, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
