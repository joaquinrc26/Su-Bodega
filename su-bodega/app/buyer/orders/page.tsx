'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type OrderItem = {
  id: string;
  wineName: string;
  wineYear: number;
  quantity: number;
  price: number | string;
};

type Order = {
  id: string;
  status: string;
  paymentMethod: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  shippingCost: number | string;
  total: number | string;
  createdAt: string;
  items: OrderItem[];
};

type BuyerOrdersResponse = {
  buyer: {
    id: string;
    name: string;
    email: string;
  };
  orders: Order[];
};

function formatCurrency(value: number | string) {
  return Number(value).toLocaleString('es-AR');
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'approved':
      return 'Aprobada';
    case 'rejected':
      return 'Rechazada';
    case 'cancelled':
      return 'Cancelada';
    default:
      return 'Pendiente';
  }
}

function getPaymentLabel(paymentMethod: string) {
  switch (paymentMethod) {
    case 'mercadopago':
      return 'Mercado Pago';
    case 'efectivo':
      return 'Efectivo en entrega';
    default:
      return 'Transferencia bancaria';
  }
}

export default function BuyerOrdersPage() {
  const router = useRouter();
  const [data, setData] = useState<BuyerOrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch('/api/buyer/orders');

        if (response.status === 401) {
          router.push('/buyer-auth');
          return;
        }

        if (!response.ok) {
          throw new Error('Error al cargar órdenes');
        }

        const result = (await response.json()) as BuyerOrdersResponse;
        setData(result);
      } catch {
        router.push('/buyer-auth');
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await fetch('/api/auth/buyer-logout', { method: 'POST' });
      router.push('/buyer-auth');
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen buyer-bodegon-bg flex items-center justify-center text-amber-50">
        <div className="card-premium rounded-2xl p-8 text-center">
          <p>Cargando tus compras...</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main className="min-h-screen buyer-bodegon-bg text-amber-50">
      <div className="container-premium py-10 md:py-14">
        <div className="mb-10 flex flex-col gap-4 rounded-3xl border border-gold/15 bg-black/35 p-6 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gold/80">Mi cuenta</p>
            <h1 className="mt-3 text-4xl font-playfair md:text-5xl">Tus compras</h1>
            <p className="mt-2 text-amber-100/70">
              {data.buyer.name} · {data.buyer.email}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/wines" className="rounded-lg border border-gold/20 px-4 py-3 text-sm font-semibold text-amber-50 transition hover:border-gold hover:bg-gold/10">
              Seguir comprando
            </Link>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-lg border border-red-400/30 px-4 py-3 text-sm font-semibold text-red-100 transition hover:border-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingOut ? 'Cerrando...' : 'Cerrar sesión'}
            </button>
          </div>
        </div>

        {data.orders.length === 0 ? (
          <div className="card-premium rounded-3xl p-10 text-center">
            <h2 className="text-3xl font-playfair text-gold">Todavía no tienes compras</h2>
            <p className="mx-auto mt-4 max-w-xl text-amber-100/70">
              Cuando completes tu primera orden la verás acá con sus productos, total y método de pago.
            </p>
            <Link href="/wines" className="btn-premium mt-8 inline-block">
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {data.orders.map((order) => (
              <section key={order.id} className="card-premium rounded-3xl p-6 md:p-8">
                <div className="flex flex-col gap-4 border-b border-gold/10 pb-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-gold/80">Orden #{order.id.slice(-8).toUpperCase()}</p>
                    <h2 className="mt-2 text-2xl font-playfair">{getStatusLabel(order.status)}</h2>
                    <p className="mt-2 text-sm text-amber-100/65">Creada el {formatDate(order.createdAt)}</p>
                  </div>

                  <div className="grid gap-2 text-sm text-amber-100/80 md:text-right">
                    <p>Método de pago: {getPaymentLabel(order.paymentMethod)}</p>
                    <p>Destino: {order.shippingCity}, {order.shippingZip}</p>
                    <p className="text-lg font-semibold text-gold">Total: ${formatCurrency(order.total)}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-amber-50">Productos</h3>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-2xl border border-gold/10 bg-black/20 px-4 py-4">
                          <div>
                            <p className="font-semibold text-amber-50">{item.wineName}</p>
                            <p className="text-sm text-amber-100/60">Año {item.wineYear} · Cantidad {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-gold">
                            ${formatCurrency(Number(item.price) * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gold/10 bg-black/20 p-5">
                    <h3 className="text-lg font-semibold text-amber-50">Entrega</h3>
                    <p className="mt-4 text-sm leading-7 text-amber-100/70">{order.shippingAddress}</p>
                    <p className="text-sm leading-7 text-amber-100/70">{order.shippingCity}, {order.shippingZip}</p>

                    <div className="mt-6 space-y-3 border-t border-gold/10 pt-4 text-sm">
                      <div className="flex items-center justify-between text-amber-100/70">
                        <span>Envío</span>
                        <span>${formatCurrency(order.shippingCost)}</span>
                      </div>
                      <div className="flex items-center justify-between text-amber-50">
                        <span>Estado</span>
                        <span>{getStatusLabel(order.status)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}