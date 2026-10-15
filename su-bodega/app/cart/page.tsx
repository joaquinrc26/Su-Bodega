'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';
import { validateCartItems } from '@/lib/stock';
import { useSiteContent } from '@/components/SiteContentProvider';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const c = useSiteContent();
  const [coupon, setCoupon] = useState('');

  const baseShipping = Number(c['shipping.cost']);
  const freeShippingFrom = Number(c['shipping.freeFrom']);
  const showShipping = baseShipping > 0;
  const shippingCost = showShipping && !(freeShippingFrom > 0 && total >= freeShippingFrom) ? baseShipping : 0;
  const subtotal = total;
  const finalTotal = subtotal + shippingCost;
  const stockValidation = validateCartItems(cart.map((item) => ({ id: item.id, quantity: item.quantity, stock: item.stock })));
  const cartPerks = [c['cart.perk1'], c['cart.perk2']].filter(Boolean);
  const whatsappMessage = [
    c['cart.messageIntro'],
    '',
    ...cart.map((item) => `- ${item.name} ${item.year} × ${item.quantity}: $${(item.price * item.quantity).toLocaleString('es-AR')}`),
    '',
    `Subtotal: $${subtotal.toLocaleString('es-AR')}`,
    ...(showShipping ? [`Envío: ${shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString('es-AR')}`}`] : []),
    `Total: $${finalTotal.toLocaleString('es-AR')}`,
    '',
    c['cart.messageOutro'],
  ].join('\n');
  const whatsappHref = `https://wa.me/${c['contact.whatsapp']}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="min-h-screen buyer-bodegon-bg text-amber-50">
      <div className="container-premium py-12">
        {/* Header */}
        <section className="wine-hero grain-overlay mb-10 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="wine-section-label">{c['cart.kicker']}</span>
              <h1 className="text-4xl md:text-5xl font-playfair font-semibold mt-2">{c['cart.title']}</h1>
              <p className="mt-3 max-w-2xl text-amber-100/72">{c['cart.subtitle']}</p>
            </div>
            <Link href="/wines" className="text-gold hover:text-gold/80 underline">
              ← Volver al catálogo
            </Link>
          </div>
        </section>

        {cart.length === 0 ? (
          <div className="wine-card p-12 text-center">
            <p className="text-xl text-amber-100/74 mb-6">Tu carrito está vacío</p>
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
                  className="wine-card p-6 flex gap-4 md:flex-row flex-col"
                >
                  {/* Imagen */}
                  {item.image && (
                    <div className="flex-shrink-0 w-full md:w-24 h-24 bg-black/30 rounded overflow-hidden">
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
                        <p className="text-sm text-amber-100/60">Cosecha {item.year}</p>
                      </div>
                      <p className="text-lg font-semibold text-gold">${item.price.toLocaleString('es-AR')}</p>
                    </div>

                    {/* Cantidad */}
                    <div className="flex items-center gap-3 mt-4">
                      <label className="text-sm text-amber-100/72">Cantidad:</label>
                      <div className="flex items-center border border-amber-100/20 rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-white/5"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          aria-label={`Cantidad de ${item.name}`}
                          title={`Cantidad de ${item.name}`}
                          className="w-12 text-center bg-transparent border-x border-amber-100/20 py-1"
                          min="1"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-white/5"
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
                className="text-sm text-amber-100/62 hover:text-amber-100 underline"
              >
                Vaciar carrito
              </button>
            </div>

            {/* Resumen */}
            <div className="wine-card p-6 h-fit sticky top-20">
              <span className="wine-section-label">Resumen</span>
              <h2 className="text-xl font-semibold mb-4 mt-4">Tu selección</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gold/10">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>${subtotal.toLocaleString('es-AR')}</span>
                </div>

                {showShipping && (
                  <div className="flex justify-between text-sm">
                    <span>{c['shipping.label']}</span>
                    <span className={shippingCost === 0 ? 'text-gold' : ''}>
                      {shippingCost === 0 ? 'GRATIS ✓' : `$${shippingCost.toLocaleString('es-AR')}`}
                    </span>
                  </div>
                )}

                {showShipping && freeShippingFrom > 0 && total > 0 && total < freeShippingFrom && (
                  <p className="text-xs text-gold/70 italic">
                    Falta ${(freeShippingFrom - total).toLocaleString('es-AR')} para envío gratis
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="text-sm text-amber-100/72 mb-2 block">Código promocional</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="DESCUENTO10"
                    className="flex-grow px-3 py-2 bg-black/25 border border-amber-100/20 rounded text-sm focus:outline-none focus:border-gold"
                  />
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-sm border border-amber-100/15">
                    Aplicar
                  </button>
                </div>
              </div>

              <div className="bg-gold/10 p-4 rounded-2xl mb-6 border border-gold/15">
                <div className="text-xl font-semibold text-gold">
                  Total: ${finalTotal.toLocaleString('es-AR')}
                </div>
              </div>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`mb-3 flex w-full items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-medium transition ${
                  stockValidation.ok
                    ? 'border-[#25D366]/60 bg-[#25D366]/15 text-emerald-100 hover:bg-[#25D366]/25'
                    : 'pointer-events-none border-amber-100/15 text-amber-100/35'
                }`}
                aria-disabled={!stockValidation.ok}
              >
                <span aria-hidden="true">WhatsApp</span>
                {stockValidation.ok ? c['cart.whatsappButton'] : 'Revisar stock'}
              </a>

              <p className="mb-4 text-center text-xs leading-5 text-amber-100/60">
                {c['cart.note']}
              </p>

              <Link href="/wines" className="block w-full text-center px-4 py-3 border border-amber-100/20 rounded hover:border-gold text-amber-50">
                Continuar comprando
              </Link>

              {/* Info promo */}
              {!stockValidation.ok && (
                <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">
                  Algunos productos ya no tienen stock suficiente para tu pedido.
                </div>
              )}

              {cartPerks.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gold/10 text-xs text-amber-100/60 space-y-2">
                  {cartPerks.map((perk) => (
                    <div key={perk} className="flex gap-2">
                      <span className="text-gold">✓</span>
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
