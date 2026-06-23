import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const webhookHits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const current = webhookHits.get(key);

  if (!current || current.resetAt <= now) {
    webhookHits.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  current.count += 1;
  webhookHits.set(key, current);
  return current.count > limit;
}

export async function POST(request: NextRequest) {
  try {
    const requestKey = request.headers.get('x-forwarded-for') || request.headers.get('user-agent') || 'webhook';

    if (isRateLimited(requestKey)) {
      return NextResponse.json({ received: true }, { status: 429 });
    }

    const body = await request.json();
    
    // MercadoPago envía notificaciones con datos en query params o body
    const { data, type } = body;

    if (!data || !data.id) {
      return NextResponse.json({ received: true });
    }

    // Si es notificación de pago
    if (type === 'payment') {
      const paymentId = data.id;
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-123456789';

      // Obtener detalles del pago de MercadoPago
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!mpResponse.ok) {
        return NextResponse.json({ received: true });
      }

      const payment = await mpResponse.json();
      const externalReference = payment.external_reference;
      const status = payment.status;

      // Extraer ID de orden de external_reference (formato: order_XXXX)
      const orderId = externalReference?.replace('order_', '');

      if (orderId) {
        // Actualizar orden según estado de pago
        let orderStatus = 'pending';
        if (status === 'approved') {
          orderStatus = 'approved';
        } else if (status === 'rejected' || status === 'cancelled') {
          orderStatus = 'rejected';
        } else if (status === 'pending') {
          orderStatus = 'pending';
        }

        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: orderStatus,
            mpPaymentId: String(paymentId),
          },
        });

        console.log(`✅ Orden ${orderId} actualizada a estado: ${orderStatus}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error en webhook MercadoPago:', error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}

// GET también para validar el webhook
export async function GET(request: NextRequest) {
  return NextResponse.json({ status: 'webhook active' });
}
