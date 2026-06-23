'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BuyerAuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/buyer-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '¡Ingreso exitoso! Redirigiendo...' });
        setTimeout(() => router.push('/checkout'), 1200);
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

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/buyer-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phone: phone || undefined }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '¡Cuenta creada! Redirigiendo...' });
        setTimeout(() => router.push('/checkout'), 1200);
      } else if (response.status === 409) {
        setMessage({ type: 'error', text: 'Este email ya está registrado' });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Error al crear la cuenta' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de red' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen buyer-bodegon-bg text-amber-50">
      <div className="container-premium py-12 md:py-20 flex items-center justify-center">
        <div className="card-premium p-8 md:p-12 max-w-md w-full rounded-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-playfair font-semibold mb-2">
              {mode === 'login' ? 'Ingresa a tu Cuenta' : 'Crear Cuenta'}
            </h1>
            <p className="text-amber-100/70">
              {mode === 'login' ? 'Continúa con tu compra' : 'Completá tu registro para comprar'}
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 placeholder-amber-100/40 focus:border-gold focus:outline-none"
                  placeholder="Tu nombre"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 placeholder-amber-100/40 focus:border-gold focus:outline-none"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contraseña</label>
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

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium mb-2">Teléfono (Opcional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 placeholder-amber-100/40 focus:border-gold focus:outline-none"
                  placeholder="Tu teléfono"
                />
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-premium w-full mt-6">
              {loading ? 'Procesando...' : mode === 'login' ? 'Ingresar' : 'Crear Cuenta'}
            </button>

            {message && (
              <p
                className={`text-sm text-center ${
                  message.type === 'success' ? 'text-green-300' : 'text-yellow-200'
                }`}
              >
                {message.text}
              </p>
            )}
          </form>

          {/* Cambiar modo */}
          <div className="mt-8 pt-8 border-t border-gold/10 text-center">
            <p className="text-amber-100/70 text-sm mb-4">
              {mode === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}
            </p>
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setMessage(null);
                setEmail('');
                setPassword('');
                setName('');
                setPhone('');
              }}
              className="text-gold hover:text-gold/80 font-semibold transition"
            >
              {mode === 'login' ? 'Crear una nueva' : 'Ingresa aquí'}
            </button>
          </div>

          {/* Link al catálogo */}
          <div className="mt-6 text-center">
            <Link href="/wines" className="text-amber-100/60 hover:text-amber-100 text-sm">
              ← Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
