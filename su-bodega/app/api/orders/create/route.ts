import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import { getBuyerIdFromCookie } from '@/lib/auth';

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

    if (customerEmail !== buyer.email || customerName !== buyer.name) {
      return NextResponse.json(
        { error: 'Los datos del comprador no coinciden con la sesión activa' },
        { status: 403 }
      );
    }

    // Si es transferencia o efectivo, crear orden sin MercadoPago
    if (paymentMethod !== 'mercadopago') {
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
          message: 'Orden creada. Confirma el pago en el método elegido.',
        },
        { status: 201 }
      );
    }

    // Para MercadoPago, crear preferencia
    const preference = {
      items: (items as CartItem[]).map((item) => ({
        title: `${item.name} ${item.year}`,
        unit_price: Number(item.price),
        quantity: item.quantity,
        currency_id: 'ARS',
      })),
      payer: {
        email: customerEmail,
        name: customerName,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/payment-success`,
        failure: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/payment-failure`,
        pending: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/payment-pending`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/webhooks/mercadopago`,
      external_reference: `order_`,
      description: `Compra de ${items.length} vino(s) en Su Bodega`,
    };

    // Crear preferencia en MercadoPago usando API REST
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-123456789';
    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preference),
    });

    if (!mpResponse.ok) {
      console.error('MercadoPago API error:', await mpResponse.text());
      return NextResponse.json(
        { error: 'Error al crear preferencia en MercadoPago' },
        { status: 500 }
      );
    }

    const mercadopagoData = await mpResponse.json() as {
      id: string;
      init_point: string;
    };

    if (!mercadopagoData.id) {
      return NextResponse.json(
        { error: 'Error: No preference ID from MercadoPago' },
        { status: 500 }
      );
    }

    // Crear orden en BD
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
        paymentMethod: 'mercadopago',
        status: 'pending',
        mpPreferenceId: mercadopagoData.id,
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

    // Actualizar referencia externa con ID de orden
    await fetch(`https://api.mercadopago.com/checkout/preferences/${mercadopagoData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        external_reference: `order_${order.id}`,
      }),
    });

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        preferenceId: mercadopagoData.id,
        checkoutUrl: mercadopagoData.init_point,
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
