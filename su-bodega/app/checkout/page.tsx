'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Redirigir si no hay items en el carrito
  if (cart.length === 0 && !orderComplete) {
    return (
      <main className="container-premium py-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-playfair text-gold mb-4">Carrito Vacío</h2>
          <p className="text-slate-400 mb-8">No tienes artículos en tu carrito</p>
          <Link href="/wines" className="btn-premium">
            Volver al Catálogo
          </Link>
        </div>
      </main>
    );
  }

  // Pantalla de orden completada
  if (orderComplete) {
    return (
      <main className="container-premium py-12 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <div className="mb-8 text-6xl">✅</div>
          <h2 className="text-4xl font-playfair text-gold mb-4">¡Compra Completada!</h2>
          <p className="text-slate-300 mb-4">
            Gracias por tu compra. Tu orden ha sido registrada exitosamente.
          </p>
          <p className="text-slate-400 mb-8">
            Recibirás un email de confirmación con los detalles de envío y la información de pago.
          </p>
          <Link href="/wines" className="btn-premium">
            Volver al Catálogo
          </Link>
        </div>
      </main>
    );
  }

  const SHIPPING_FREE_THRESHOLD = 200000;
  const SHIPPING_COST = total >= SHIPPING_FREE_THRESHOLD ? 0 : 5000;
  const FINAL_TOTAL = total + SHIPPING_COST;

  const handleSubmitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const customerName = formData.get('name') as string;
      const customerEmail = formData.get('email') as string;
      const customerPhone = formData.get('phone') as string;
      const shippingAddress = `${formData.get('street')} ${formData.get('number')}${
        formData.get('apartment') ? `, Apto ${formData.get('apartment')}` : ''
      }`;
      const shippingCity = formData.get('city') as string;
      const shippingZip = formData.get('postal') as string;
      const paymentMethod = (formData.get('payment') as string) || 'transferencia';

      const orderData = {
        customerEmail,
        customerName,
        customerPhone,
        shippingAddress,
        shippingCity,
        shippingZip,
        shippingCost: SHIPPING_COST,
        total: FINAL_TOTAL,
        items: cart,
        paymentMethod: paymentMethod === 'bank' ? 'transferencia' : paymentMethod === 'cash' ? 'efectivo' : 'mercadopago',
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

      // Si es MercadoPago, redirigir a checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        // Si es transferencia o efectivo, mostrar confirmación
        setOrderComplete(true);
      }
    } catch (error) {
      console.error('Error al procesar orden:', error);
      alert('Hubo un error al procesar tu orden. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container-premium py-12 min-h-screen">
      <div className="mb-8">
        <Link href="/wines" className="text-gold hover:text-yellow-300 transition">
          ← Volver al Catálogo
        </Link>
      </div>

      <h1 className="text-4xl font-playfair text-gold mb-12">Finalizar Compra</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmitOrder} className="space-y-8">
            {/* Información Personal */}
            <section className="card-premium p-6 border border-slate-700">
              <h2 className="text-2xl font-playfair text-gold mb-6">Información Personal</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-montserrat text-slate-300 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-gold focus:outline-none transition"
                    placeholder="Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-montserrat text-slate-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-gold focus:outline-none transition"
                    placeholder="juan@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-montserrat text-slate-300 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-gold focus:outline-none transition"
                    placeholder="+54 11 1234-5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-montserrat text-slate-300 mb-2">
                    País *
                  </label>
                  <select
                    name="country"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none transition"
                  >
                    <option value="AR">Argentina</option>
                    <option value="CL">Chile</option>
                    <option value="BR">Brasil</option>
                    <option value="UY">Uruguay</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Dirección */}
            <section className="card-premium p-6 border border-slate-700">
              <h2 className="text-2xl font-playfair text-gold mb-6">Dirección de Envío</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-montserrat text-slate-300 mb-2">
                      Calle *
                    </label>
                    <input
                      type="text"
                      name="street"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-gold focus:outline-none transition"
                      placeholder="Av. Santa Fe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-montserrat text-slate-300 mb-2">
                      Número *
                    </label>
                    <input
                      type="text"
                      name="number"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-gold focus:outline-none transition"
                      placeholder="1234"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-montserrat text-slate-300 mb-2">
                      Departamento/Apto. (Opcional)
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-gold focus:outline-none transition"
                      placeholder="5B"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-montserrat text-slate-300 mb-2">
                      Código Postal *
                    </label>
                    <input
                      type="text"
                      name="postal"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-gold focus:outline-none transition"
                      placeholder="C1425"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-montserrat text-slate-300 mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-gold focus:outline-none transition"
                      placeholder="Buenos Aires"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-montserrat text-slate-300 mb-2">
                      Provincia/Estado *
                    </label>
                    <input
                      type="text"
                      name="province"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-gold focus:outline-none transition"
                      placeholder="Buenos Aires"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Método de Pago */}
            <section className="card-premium p-6 border border-slate-700">
              <h2 className="text-2xl font-playfair text-gold mb-6">Método de Pago</h2>
              <div className="space-y-4">
                <label className="flex items-center p-4 border border-slate-700 rounded-lg cursor-pointer hover:border-gold hover:bg-slate-900/50 transition">
                  <input type="radio" name="payment" value="bank" defaultChecked className="w-4 h-4" />
                  <div className="ml-4">
                    <p className="font-montserrat text-white">Transferencia Bancaria</p>
                    <p className="text-sm text-slate-400">Recibe los datos después de confirmar</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-slate-700 rounded-lg cursor-pointer hover:border-gold hover:bg-slate-900/50 transition">
                  <input type="radio" name="payment" value="cash" className="w-4 h-4" />
                  <div className="ml-4">
                    <p className="font-montserrat text-white">Efectivo contra Entrega</p>
                    <p className="text-sm text-slate-400">Paga cuando recibas tu orden</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-slate-700 rounded-lg cursor-pointer opacity-50 disabled:cursor-not-allowed">
                  <input type="radio" name="payment" value="card" disabled className="w-4 h-4" />
                  <div className="ml-4">
                    <p className="font-montserrat text-white">Tarjeta de Crédito/Débito</p>
                    <p className="text-sm text-slate-400">Próximamente</p>
                  </div>
                </label>
              </div>
            </section>

            {/* Notas */}
            <section className="card-premium p-6 border border-slate-700">
              <h2 className="text-2xl font-playfair text-gold mb-6">Notas Adicionales (Opcional)</h2>
              <textarea
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-gold focus:outline-none transition h-32 resize-none"
                placeholder="Agregá instrucciones especiales para la entrega..."
              />
            </section>

            {/* Botón Enviar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-premium py-4 text-lg font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Procesando...' : 'Finalizar Compra'}
            </button>
          </form>
        </div>

        {/* Resumen Lateral */}
        <div className="lg:col-span-1">
          <div className="card-premium border border-slate-700 p-6 sticky top-8">
            <h3 className="text-2xl font-playfair text-gold mb-6">Resumen del Pedido</h3>

            {/* Items */}
            <div className="space-y-4 mb-6 max-h-72 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-slate-700">
                  {item.image && (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-montserrat truncate">{item.name}</p>
                    <p className="text-slate-400 text-sm">{item.year}</p>
                    <p className="text-gold text-sm">
                      {item.quantity} x ${item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="space-y-3 border-t border-slate-700 pt-6">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal:</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Envío:</span>
                <span className={SHIPPING_COST === 0 ? 'text-green-400 font-semibold' : ''}>
                  {SHIPPING_COST === 0 ? '¡GRATIS!' : `$${SHIPPING_COST.toLocaleString()}`}
                </span>
              </div>

              {total < SHIPPING_FREE_THRESHOLD && (
                <p className="text-xs text-slate-400 bg-slate-900/50 p-2 rounded">
                  Envío gratis desde ${SHIPPING_FREE_THRESHOLD.toLocaleString()}
                </p>
              )}

              <div className="flex justify-between text-xl font-playfair text-gold pt-3 border-t border-slate-700">
                <span>Total:</span>
                <span>${FINAL_TOTAL.toLocaleString()}</span>
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-700 text-xs text-slate-400 space-y-2">
              <p>✓ Envío seguro</p>
              <p>✓ Datos encriptados</p>
              <p>✓ Política de devolución</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
