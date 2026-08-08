'use client';

import Link from 'next/link';

export default function PaymentPendingContent() {
  return (
    <main className="container-premium py-12 min-h-screen flex items-center justify-center">
      <div className="card-premium p-8 max-w-md mx-auto text-center">
        <div className="mb-4 text-6xl">⏳</div>
        <h1 className="text-3xl font-semibold mb-4 text-yellow-400">Pago Pendiente</h1>
        <p className="text-slate-300 mb-6">
          Tu pago está siendo procesado. Recibirás una confirmación cuando se complete.
        </p>

        <div className="space-y-3">
          <Link href="/wines" className="btn-premium w-full block">
            Continuar navegando
          </Link>
          <Link href="/" className="btn-premium w-full block opacity-75 hover:opacity-100">
            Ir a inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
