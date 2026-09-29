'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '¡Ingreso exitoso! Redirigiendo...' });
        setTimeout(() => router.push('/admin/dashboard'), 1200);
      } else if (response.status === 401) {
        setMessage({ type: 'error', text: 'Credenciales inválidas' });
      } else {
        setMessage({ type: 'error', text: 'Error en el login' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de red' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen buyer-bodegon-bg text-amber-50">
      <div className="container-premium py-12 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
          <section className="wine-hero grain-overlay p-8 md:p-10 rounded-[28px]">
            <span className="wine-section-label">Acceso administrativo</span>
            <h1 className="mt-5 text-4xl md:text-5xl font-playfair font-semibold leading-tight">
              Ingresar al Panel
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-amber-100/76">
              Accede para cargar vinos, gestionar el catálogo y mantener actualizado el inventario de Su Bodega.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              <div className="wine-stat">
                <p className="text-[11px] uppercase tracking-[0.26em] text-gold/72">Catálogo</p>
                <p className="mt-2 text-xl font-playfair">Cargar vinos</p>
              </div>
              <div className="wine-stat">
                <p className="text-[11px] uppercase tracking-[0.26em] text-gold/72">Gestión</p>
                <p className="mt-2 text-xl font-playfair">Dashboard intuitivo</p>
              </div>
              <div className="wine-stat">
                <p className="text-[11px] uppercase tracking-[0.26em] text-gold/72">Control</p>
                <p className="mt-2 text-xl font-playfair">Panel administrativo</p>
              </div>
            </div>

            <div className="wine-divider my-8" />

            <div className="space-y-2 text-sm text-amber-100/66">
              <p>✓ Interfaz premium y clara</p>
              <p>✓ Carga rápida de productos</p>
              <p>✓ Control completo del catálogo</p>
            </div>
          </section>

          <div className="wine-card p-8 md:p-12 w-full rounded-[28px] self-center">
            <div className="text-center mb-8">
              <span className="wine-section-label">Credenciales</span>
              <h2 className="text-3xl md:text-4xl font-playfair font-semibold mt-4 mb-2">
                Tu Acceso
              </h2>
              <p className="text-amber-100/70">
                Ingresa para acceder al panel.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-100/80 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 placeholder-amber-100/40 focus:border-gold focus:outline-none"
                  placeholder="admin@bodega.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-100/80 mb-2">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 placeholder-amber-100/40 focus:border-gold focus:outline-none"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
              </div>

              <button type="submit" disabled={loading} className="btn-premium w-full mt-6 py-3">
                {loading ? 'Procesando...' : 'Ingresar'}
              </button>

              {message && (
                <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-900/30 text-green-200' : 'bg-amber-900/30 text-amber-200'}`}>
                  {message.text}
                </div>
              )}
            </form>

          </div>
        </div>
      </div>
    </main>
  );
}

