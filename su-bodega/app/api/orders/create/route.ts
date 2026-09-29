import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import { getBuyerIdFromCookie } from '@/lib/auth';
import { validateCartItems } from '@/lib/stock';

interface CartItem {
  id: string;
  name: string;
  year: number;
  price: number;
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const buyerId = getBuyerIdFromCookie(request);

    if (!buyerId) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para finalizar la compra' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      customerEmail,
      customerName,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingZip,
      shippingCost,
      total,
      items,
      paymentMethod,
    } = body;

    const buyer = await prisma.buyerUser.findUnique({
      where: { id: buyerId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
      },
    });

    if (!buyer) {
      return NextResponse.json(
        { error: 'Comprador no encontrado' },
        { status: 401 }
      );
    }

    // Validaciones
    if (!customerEmail || !customerName || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Datos de orden incompletos' },
        { status: 400 }
      );
    }

    if (!['transferencia', 'efectivo'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Método de pago no válido' },
        { status: 400 }
      );
    }

    if (customerEmail !== buyer.email || customerName !== buyer.name) {
      return NextResponse.json(
        { error: 'Los datos del comprador no coinciden con la sesión activa' },
        { status: 403 }
      );
    }

    const wineIds = (items as CartItem[]).map((item) => item.id);
    const wines = await prisma.wine.findMany({
      where: { id: { in: wineIds } },
      select: { id: true, stock: true, isActive: true },
    });

    const stockLookup = new Map(wines.map((wine) => [wine.id, wine]));
    const stockValidation = validateCartItems((items as CartItem[]).map((item) => ({
      id: item.id,
      quantity: item.quantity,
      stock: stockLookup.get(item.id)?.stock ?? 0,
    })));

    if (!stockValidation.ok || wines.some((wine) => !wine.isActive)) {
      return NextResponse.json(
        { error: 'No hay stock suficiente o alguno de los productos ya no está disponible.' },
        { status: 409 }
      );
    }

    const stockUpdates = (items as CartItem[]).map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    await prisma.$transaction(async (tx) => {
      for (const item of stockUpdates) {
        const currentWine = await tx.wine.findUnique({ where: { id: item.id }, select: { id: true, stock: true } });
        if (!currentWine || currentWine.stock < item.quantity) {
          throw new Error('Stock no disponible');
        }

        await tx.wine.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }
    });

    const order = await prisma.order.create({
      data: {
        buyerId: buyer.id,
        customerEmail,
        customerName,
        customerPhone: customerPhone || buyer.phone || '',
        shippingAddress,
        shippingCity,
        shippingZip,
        shippingCost: new Decimal(shippingCost),
        total: new Decimal(total),
        paymentMethod,
        status: 'pending',
        items: {
          create: (items as CartItem[]).map((item) => ({
            wineId: item.id,
            wineName: item.name,
            wineYear: item.year,
            price: new Decimal(item.price),
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        message: 'Orden creada correctamente.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear orden:', error);
    return NextResponse.json(
      { error: 'Error al procesar la orden' },
      { status: 500 }
    );
  }
}
