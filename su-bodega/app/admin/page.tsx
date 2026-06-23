'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
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
        setTimeout(() => router.push('/add-wine'), 1500);
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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '¡Cuenta creada! Redirigiendo...' });
        setTimeout(() => router.push('/add-wine'), 1500);
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
    <main className="container-premium py-12">
      <div className="card-premium p-8 max-w-md mx-auto">
        <h1 className="text-3xl font-semibold mb-4">
          {mode === 'login' ? 'Ingreso Administrador' : 'Crear Cuenta Admin'}
        </h1>
        <p className="text-slate-300 mb-6">
          {mode === 'login'
            ? 'Ingresa con tu cuenta para cargar vinos.'
            : 'Crea una nueva cuenta de administrador.'}
        </p>

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium mb-2">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded p-3 bg-transparent"
                placeholder="Tu nombre completo"
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
              className="w-full border rounded p-3 bg-transparent"
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
              className="w-full border rounded p-3 bg-transparent"
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-premium w-full">
            {loading ? 'Procesando...' : mode === 'login' ? 'Ingresar' : 'Crear Cuenta'}
          </button>

          {message && (
            <p className={`text-sm ${message.type === 'success' ? 'text-green-300' : 'text-yellow-200'}`}>
              {message.text}
            </p>
          )}
        </form>

        <div className="mt-6 pt-6 border-t border-slate-700 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setMessage(null);
              setEmail('');
              setPassword('');
              setName('');
            }}
            className="text-sm text-gold hover:underline"
          >
            {mode === 'login'
              ? '¿No tienes cuenta? Crear una nueva'
              : '¿Ya tienes cuenta? Ingresar'}
          </button>
        </div>

        <div className="mt-4 p-4 bg-slate-800 rounded text-xs text-slate-400">
          <p className="font-semibold mb-2">Para pruebas rápidas:</p>
          <p>Email: <code className="text-gold">admin@bodega.com</code></p>
          <p>Contraseña: <code className="text-gold">admin123</code></p>
        </div>
      </div>
    </main>
  );
}

