'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="px-4 py-3 border rounded text-slate-100 border-slate-600 hover:border-gold"
    >
      Cerrar sesión
    </button>
  );
}
