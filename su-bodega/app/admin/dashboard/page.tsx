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
    <main className="min-h-screen buyer-bodegon-bg text-amber-50">
      <div className="container-premium py-10 md:py-14">
        <section className="wine-hero grain-overlay mb-12 p-7 md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="wine-section-label">Gestión de catálogo</span>
              <h1 className="mt-4 text-5xl md:text-6xl font-playfair text-amber-50">Panel Administrativo</h1>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-amber-100/74">
                Desde aquí controlas el catálogo de Su Bodega. Carga vinos, gestiona productos y mantén actualizado el inventario con una interfaz clara y directa.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:max-w-xl">
              <div className="wine-stat">
                <p className="text-[11px] uppercase tracking-[0.26em] text-gold/72">Acción</p>
                <p className="mt-2 text-lg font-playfair">Cargar vinos</p>
              </div>
              <div className="wine-stat">
                <p className="text-[11px] uppercase tracking-[0.26em] text-gold/72">Catálogo</p>
                <p className="mt-2 text-lg font-playfair">Gestionar etiquetas</p>
              </div>
              <div className="wine-stat">
                <p className="text-[11px] uppercase tracking-[0.26em] text-gold/72">Vista</p>
                <p className="mt-2 text-lg font-playfair">Buyer live</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Link href="/add-wine" className="wine-card p-8 rounded-[24px] hover:border-gold transition-all group">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📦</div>
              <div>
                <span className="wine-section-label">Acción principal</span>
                <h2 className="text-2xl font-playfair font-semibold mt-2">Cargar Nuevo Vino</h2>
                <p className="text-sm text-amber-100/70 mt-2">
                  Agrega productos a tu catálogo. Formulario claro con fotos, precios, región y maridaje.
                </p>
              </div>
              <div className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">→</div>
            </div>
          </Link>

          <Link href="/wines" className="wine-card p-8 rounded-[24px] hover:border-gold transition-all group">
            <div className="flex items-start gap-4">
              <div className="text-4xl">👁️</div>
              <div>
                <span className="wine-section-label">Vista buyer</span>
                <h2 className="text-2xl font-playfair font-semibold mt-2">Ver Catálogo en Vivo</h2>
                <p className="text-sm text-amber-100/70 mt-2">
                  Previsualiza cómo ven los clientes tu catálogo actualizado en tiempo real.
                </p>
              </div>
              <div className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">→</div>
            </div>
          </Link>
        </div>

        <section className="wine-card p-8 rounded-[24px]">
          <span className="wine-section-label">Navegación</span>
          <h3 className="text-xl font-playfair font-semibold mt-4 mb-6">Más opciones</h3>

          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/" className="rounded-lg border border-gold/20 px-5 py-4 text-center text-amber-50 hover:border-gold hover:bg-gold/5 transition">
              <p className="text-2xl mb-2">🏠</p>
              <p className="text-sm">Volver a Inicio</p>
            </Link>

            <Link href="/buyer-auth" className="rounded-lg border border-gold/20 px-5 py-4 text-center text-amber-50 hover:border-gold hover:bg-gold/5 transition">
              <p className="text-2xl mb-2">👤</p>
              <p className="text-sm">Acceso Buyer</p>
            </Link>

            <div className="rounded-lg border border-gold/20 px-5 py-4 text-center hover:border-gold hover:bg-gold/5 transition">
              <p className="text-2xl mb-2">🚪</p>
              <LogoutButton />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
