'use client';

import { Suspense } from 'react';
import PaymentSuccessContent from './content';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessLoading() {
  return (
    <main className="container-premium py-12 min-h-screen flex items-center justify-center">
      <div className="card-premium p-8 max-w-md mx-auto text-center">
        <div className="mb-4 text-6xl animate-pulse">✅</div>
        <p className="text-slate-400">Cargando información del pago...</p>
      </div>
    </main>
  );
}
