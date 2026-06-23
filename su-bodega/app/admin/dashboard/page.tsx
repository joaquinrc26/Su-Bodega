import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE_NAME, isAdminToken } from '@/lib/auth';
import LogoutButton from './LogoutButton';

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!isAdminToken(token)) {
    redirect('/admin');
  }

  return (
    <main className="container-premium py-12">
      <section className="card-premium p-8 glass space-y-6">
        <div>
          <span className="text-sm uppercase tracking-[0.4em] text-gold">Panel Administrador</span>
          <h1 className="text-4xl md:text-5xl font-playfair font-semibold mt-4">Dashboard de gestión</h1>
          <p className="text-slate-300 mt-3 max-w-2xl">
            Esta es la vista de administración. Desde acá podés cargar productos y gestionar el catálogo.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/add-wine" className="btn-premium text-center">
            Cargar nuevo vino
          </Link>
          <Link
            href="/wines"
            className="px-4 py-3 border rounded text-slate-100 border-slate-600 hover:border-gold text-center"
          >
            Ir a vista comprador
          </Link>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/" className="px-4 py-3 border rounded text-slate-100 border-slate-600 hover:border-gold">
            Volver al inicio
          </Link>
          <LogoutButton />
        </div>
      </section>
    </main>
  );
}
