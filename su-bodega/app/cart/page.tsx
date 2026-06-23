'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const [coupon, setCoupon] = useState('');

  const shippingCost = total > 200000 ? 0 : 5000; // Envío gratis desde 200.000
  const subtotal = total;
  const finalTotal = subtotal + shippingCost;

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container-premium py-12">
        {/* Header */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-sm uppercase tracking-[0.4em] text-gold">Tu carrito</span>
              <h1 className="text-4xl md:text-5xl font-playfair font-semibold mt-2">Revisar compra</h1>
            </div>
            <Link href="/wines" className="text-gold hover:text-gold/80 underline">
              ← Volver al catálogo
            </Link>
          </div>
        </section>

        {cart.length === 0 ? (
          <div className="card-premium p-12 glass text-center">
            <p className="text-xl text-slate-300 mb-6">Tu carrito está vacío</p>
            <Link href="/wines" className="btn-premium">
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-[1fr_350px]">
            {/* Carrito Items */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="card-premium p-6 glass flex gap-4 md:flex-row flex-col"
                >
                  {/* Imagen */}
                  {item.image && (
                    <div className="flex-shrink-0 w-full md:w-24 h-24 bg-slate-800 rounded overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Detalles */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-sm text-slate-400">Cosecha {item.year}</p>
                      </div>
                      <p className="text-lg font-semibold text-gold">${item.price.toLocaleString('es-AR')}</p>
                    </div>

                    {/* Cantidad */}
                    <div className="flex items-center gap-3 mt-4">
                      <label className="text-sm text-slate-300">Cantidad:</label>
                      <div className="flex items-center border border-slate-600 rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-slate-700"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-12 text-center bg-transparent border-x border-slate-600 py-1"
                          min="1"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-slate-700"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm text-gold font-semibold">
                        Total: ${(item.price * item.quantity).toLocaleString('es-AR')}
                      </p>
                    </div>

                    {/* Botón eliminar */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="mt-3 text-sm text-red-400 hover:text-red-300 underline"
                    >
                      Eliminar del carrito
                    </button>
                  </div>
                </div>
              ))}

              {/* Botón limpiar carrito */}
              <button
                onClick={clearCart}
                className="text-sm text-slate-400 hover:text-slate-200 underline"
              >
                Vaciar carrito
              </button>
            </div>

            {/* Resumen */}
            <div className="card-premium p-6 glass h-fit sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Resumen</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-slate-700">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>${subtotal.toLocaleString('es-AR')}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Envío a CABA/AMBA</span>
                  <span className={shippingCost === 0 ? 'text-gold' : ''}>
                    {shippingCost === 0 ? 'GRATIS ✓' : `$${shippingCost.toLocaleString('es-AR')}`}
                  </span>
                </div>

                {total > 0 && total < 200000 && (
                  <p className="text-xs text-gold/70 italic">
                    Falta ${(200000 - total).toLocaleString('es-AR')} para envío gratis
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="text-sm text-slate-300 mb-2 block">Código promocional</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="DESCUENTO10"
                    className="flex-grow px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm focus:outline-none focus:border-gold"
                  />
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm">
                    Aplicar
                  </button>
                </div>
              </div>

              <div className="bg-gold/10 p-3 rounded mb-6">
                <div className="text-xl font-semibold text-gold">
                  Total: ${finalTotal.toLocaleString('es-AR')}
                </div>
              </div>

              <button 
                onClick={() => router.push('/buyer-auth')}
                className="btn-premium w-full mb-3"
              >
                Proceder al pago
              </button>

              <Link href="/wines" className="block w-full text-center px-4 py-3 border border-slate-600 rounded hover:border-gold text-slate-100">
                Continuar comprando
              </Link>

              {/* Info promo */}
              <div className="mt-6 pt-6 border-t border-slate-700 text-xs text-slate-400 space-y-2">
                <div className="flex gap-2">
                  <span className="text-gold">✓</span>
                  <span>Envío gratis a CABA y AMBA desde $200.000</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gold">✓</span>
                  <span>Hasta 6 cuotas sin interés en vinos</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
