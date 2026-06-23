'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Buyer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total, clearCart } = useCart();
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Cargar datos del buyer
  useEffect(() => {
    async function loadBuyer() {
      try {
        const res = await fetch('/api/buyer/profile');
        if (!res.ok) {
          router.push('/buyer-auth');
          return;
        }
        const data = await res.json();
        setBuyer(data);
      } catch {
        router.push('/buyer-auth');
      } finally {
        setLoading(false);
      }
    }

    loadBuyer();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen buyer-bodegon-bg flex items-center justify-center">
        <div className="wine-card p-8 rounded-2xl text-center">
          <p className="text-amber-100">Cargando...</p>
        </div>
      </main>
    );
  }

  if (!buyer) {
    return null;
  }

  if (cart.length === 0 && !orderComplete) {
    return (
      <main className="min-h-screen buyer-bodegon-bg flex items-center justify-center">
        <div className="wine-card p-12 rounded-2xl text-center">
          <h2 className="text-3xl font-playfair text-gold mb-4">Carrito Vacío</h2>
          <p className="text-amber-100/70 mb-8">No tienes artículos en tu carrito</p>
          <Link href="/wines" className="btn-premium inline-block">
            Volver al Catálogo
          </Link>
        </div>
      </main>
    );
  }

  if (orderComplete) {
    return (
      <main className="min-h-screen buyer-bodegon-bg flex items-center justify-center">
        <div className="wine-card p-12 rounded-2xl text-center max-w-2xl">
          <div className="mb-8 text-6xl">✅</div>
          <h2 className="text-4xl font-playfair text-gold mb-4">¡Orden Confirmada!</h2>
          <p className="text-amber-100/80 mb-6">Gracias por tu compra. Te enviaremos un email con los detalles.</p>
          <Link href="/wines" className="btn-premium inline-block">
            Volver al Catálogo
          </Link>
        </div>
      </main>
    );
  }

  const SHIPPING_THRESHOLD = 200000;
  const SHIPPING_COST = total >= SHIPPING_THRESHOLD ? 0 : 5000;
  const FINAL_TOTAL = total + SHIPPING_COST;

  const handleSubmitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData(e.currentTarget);
      const address = formData.get('address') as string;
      const city = formData.get('city') as string;
      const zipCode = formData.get('zipCode') as string;
      const paymentMethod = (formData.get('payment') as string) || 'bank';

      // Actualizar perfil del buyer con dirección
      await fetch('/api/buyer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, city, zipCode }),
      });

      const orderData = {
        customerEmail: buyer.email,
        customerName: buyer.name,
        customerPhone: buyer.phone || '',
        shippingAddress: address,
        shippingCity: city,
        shippingZip: zipCode,
        shippingCost: SHIPPING_COST,
        total: FINAL_TOTAL,
        items: cart,
        paymentMethod: paymentMethod === 'bank' ? 'transferencia' : 'efectivo',
      };

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la orden');
      }

      clearCart();
      setOrderComplete(true);
    } catch {
      setMessage({ type: 'error', text: 'Error al procesar la orden. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen buyer-bodegon-bg">
      <div className="container-premium py-10 md:py-14">
        <section className="wine-hero grain-overlay mb-12 p-7 md:p-10">
          <Link href="/cart" className="text-gold hover:text-gold/80 text-sm">
            ← Volver al carrito
          </Link>
          <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="wine-section-label">Checkout buyer</span>
              <h1 className="mt-4 text-5xl md:text-6xl font-playfair text-amber-50">Finalizar Compra</h1>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-amber-100/74">
                Confirma tu entrega, elige el medio de pago y revisa tu pedido en una experiencia clara, sobria y pensada para una vinoteca premium.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:max-w-xl">
              <div className="wine-stat">
                <p className="text-[11px] uppercase tracking-[0.26em] text-gold/72">Cuenta</p>
                <p className="mt-2 text-lg font-playfair">Buyer autenticado</p>
              </div>
              <div className="wine-stat">
                <p className="text-[11px] uppercase tracking-[0.26em] text-gold/72">Envío</p>
                <p className="mt-2 text-lg font-playfair">Gratis desde $200.000</p>
              </div>
              <div className="wine-stat">
                <p className="text-[11px] uppercase tracking-[0.26em] text-gold/72">Confirmación</p>
                <p className="mt-2 text-lg font-playfair">Orden inmediata</p>
              </div>
            </div>
          </div>
        </section>

        {message && (
          <div className={`wine-card p-4 rounded-2xl mb-8 ${message.type === 'error' ? 'border-red-500/30 bg-red-500/10' : 'border-green-500/30 bg-green-500/10'}`}>
            <p className={message.type === 'error' ? 'text-red-200' : 'text-green-200'}>{message.text}</p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Formulario */}
          <form onSubmit={handleSubmitOrder} className="space-y-8">
            {/* Datos del Comprador */}
            <section className="wine-card p-8 md:p-10 rounded-2xl">
              <span className="wine-section-label">Identidad</span>
              <h2 className="text-2xl font-playfair text-gold mb-6">Tus Datos</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-amber-100 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={buyer.name}
                    disabled
                    className="w-full bg-black/20 border border-gold/20 rounded-lg p-3 text-amber-50 cursor-not-allowed opacity-70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-100 mb-2">Email</label>
                  <input
                    type="email"
                    value={buyer.email}
                    disabled
                    className="w-full bg-black/20 border border-gold/20 rounded-lg p-3 text-amber-50 cursor-not-allowed opacity-70"
                  />
                </div>
                {buyer.phone && (
                  <div>
                    <label className="block text-sm font-medium text-amber-100 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={buyer.phone}
                      disabled
                      className="w-full bg-black/20 border border-gold/20 rounded-lg p-3 text-amber-50 cursor-not-allowed opacity-70"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Dirección de Envío */}
            <section className="wine-card p-8 md:p-10 rounded-2xl">
              <span className="wine-section-label">Destino</span>
              <h2 className="text-2xl font-playfair text-gold mb-6">Dirección de Envío</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-amber-100 mb-2">Calle y Número *</label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={buyer.address || ''}
                    required
                    placeholder="Av. Santa Fe 1500"
                    className="w-full bg-black/20 border border-gold/20 rounded-lg p-3 text-amber-50 placeholder-amber-100/30 focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-100 mb-2">Ciudad *</label>
                    <input
                      type="text"
                      name="city"
                      defaultValue={buyer.city || ''}
                      required
                      placeholder="Buenos Aires"
                      className="w-full bg-black/20 border border-gold/20 rounded-lg p-3 text-amber-50 placeholder-amber-100/30 focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-100 mb-2">Código Postal *</label>
                    <input
                      type="text"
                      name="zipCode"
                      defaultValue={buyer.zipCode || ''}
                      required
                      placeholder="C1425"
                      className="w-full bg-black/20 border border-gold/20 rounded-lg p-3 text-amber-50 placeholder-amber-100/30 focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Método de Pago */}
            <section className="wine-card p-8 md:p-10 rounded-2xl">
              <span className="wine-section-label">Pago</span>
              <h2 className="text-2xl font-playfair text-gold mb-6">Método de Pago</h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gold/20 rounded-lg cursor-pointer hover:border-gold hover:bg-gold/5 transition">
                  <input type="radio" name="payment" value="bank" defaultChecked className="w-4 h-4 accent-gold" />
                  <div className="ml-4">
                    <p className="font-medium text-amber-50">Transferencia Bancaria</p>
                    <p className="text-sm text-amber-100/60">Envío gratis a CABA y AMBA</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gold/20 rounded-lg cursor-pointer hover:border-gold hover:bg-gold/5 transition">
                  <input type="radio" name="payment" value="cash" className="w-4 h-4 accent-gold" />
                  <div className="ml-4">
                    <p className="font-medium text-amber-50">Efectivo en Entrega</p>
                    <p className="text-sm text-amber-100/60">Paga cuando recibas tu orden</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gold/10 rounded-lg opacity-50 cursor-not-allowed">
                  <input type="radio" name="payment" value="card" disabled className="w-4 h-4 accent-gold" />
                  <div className="ml-4">
                    <p className="font-medium text-amber-50">Tarjeta de Crédito/Débito</p>
                    <p className="text-sm text-amber-100/60">Próximamente</p>
                  </div>
                </label>
              </div>
            </section>

            {/* Botón Confirmar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-premium w-full py-4 text-lg font-semibold"
            >
              {isSubmitting ? 'Procesando...' : 'Confirmar Orden'}
            </button>
          </form>

          {/* Resumen */}
          <div className="wine-card p-8 md:p-10 rounded-2xl h-fit sticky top-20">
            <span className="wine-section-label">Pedido</span>
            <h3 className="text-xl font-playfair text-gold mb-6 mt-4">Resumen de Compra</h3>

            {/* Items */}
            <div className="space-y-3 mb-6 pb-6 border-b border-gold/10">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-amber-100/80">{item.name} x {item.quantity}</span>
                  <span className="text-gold font-semibold">
                    ${(item.price * item.quantity).toLocaleString('es-AR')}
                  </span>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-amber-100/70">Subtotal</span>
                <span className="text-amber-50">${total.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-amber-100/70">Envío a CABA/AMBA</span>
                <span className={SHIPPING_COST === 0 ? 'text-green-300 font-semibold' : 'text-amber-50'}>
                  {SHIPPING_COST === 0 ? 'GRATIS' : `$${SHIPPING_COST.toLocaleString('es-AR')}`}
                </span>
              </div>

              {total < 200000 && SHIPPING_COST > 0 && (
                <p className="text-xs text-gold/70 italic">
                  Falta ${(200000 - total).toLocaleString('es-AR')} para envío gratis
                </p>
              )}

              <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gold/10">
                <span>Total</span>
                <span className="text-gold">${FINAL_TOTAL.toLocaleString('es-AR')}</span>
              </div>
            </div>

            {/* Info */}
            <div className="text-xs text-amber-100/60 space-y-2 pt-6 border-t border-gold/10">
              <div>✓ Envío gratis desde $200.000</div>
              <div>✓ Compra segura</div>
              <div>✓ Confirmación inmediata de la orden</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
