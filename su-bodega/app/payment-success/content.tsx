'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface OrderInfo {
  preferenceId?: string;
  merchantOrderId?: string;
  paymentId?: string;
}

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);

  useEffect(() => {
    const preferenceId = searchParams.get('preference_id');
    const merchantOrderId = searchParams.get('merchant_order_id');
    const paymentId = searchParams.get('payment_id');

    // Aquí normalmente buscarías la orden en tu BD
    setOrderInfo({
      preferenceId: preferenceId || undefined,
      merchantOrderId: merchantOrderId || undefined,
      paymentId: paymentId || undefined,
    });
  }, [searchParams]);

  return (
    <main className="container-premium py-12 min-h-screen flex items-center justify-center">
      <div className="card-premium p-8 max-w-md mx-auto text-center">
        <div className="mb-4 text-6xl">✅</div>
        <h1 className="text-3xl font-semibold mb-4 text-green-400">¡Pago Aprobado!</h1>
        <p className="text-slate-300 mb-6">
          Tu compra se ha procesado correctamente. Recibirás un email de confirmación en breve.
        </p>

        {orderInfo && (
          <div className="bg-slate-800 rounded p-4 mb-6 text-left text-sm">
            <p className="mb-2">
              <span className="text-slate-400">ID Transacción:</span>
              <br />
              <code className="text-gold">{orderInfo.paymentId || 'N/A'}</code>
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link href="/wines" className="btn-premium w-full block">
            Continuar comprando
          </Link>
          <Link href="/" className="btn-premium w-full block opacity-75 hover:opacity-100">
            Ir a inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
