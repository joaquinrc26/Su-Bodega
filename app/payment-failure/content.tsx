'use client';

import Link from 'next/link';

export default function PaymentFailureContent() {
  return (
    <main className="container-premium py-12 min-h-screen flex items-center justify-center">
      <div className="card-premium p-8 max-w-md mx-auto text-center">
        <div className="mb-4 text-6xl">❌</div>
        <h1 className="text-3xl font-semibold mb-4 text-red-400">Pago Rechazado</h1>
        <p className="text-slate-300 mb-6">
          El pago no se pudo procesar. Por favor, verifica tu información e intenta de nuevo.
        </p>

        <div className="space-y-3">
          <Link href="/checkout" className="btn-premium w-full block">
            Reintentar pago
          </Link>
          <Link href="/cart" className="btn-premium w-full block opacity-75 hover:opacity-100">
            Volver al carrito
          </Link>
        </div>
      </div>
    </main>
  );
}
