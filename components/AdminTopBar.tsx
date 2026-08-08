import Link from 'next/link';

type AdminTopBarProps = {
  isAdmin: boolean;
};

export default function AdminTopBar({ isAdmin }: AdminTopBarProps) {
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 border-b border-gold/30 bg-black/80 backdrop-blur">
      <div className="container-premium py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-gold/50 bg-bordeaux/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold">
            Modo Admin Activo
          </span>
          <span className="text-sm text-slate-300">Estás navegando como administrador</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/dashboard"
            className="px-3 py-2 border rounded text-slate-100 border-slate-600 hover:border-gold text-sm"
          >
            Dashboard
          </Link>
          <Link
            href="/wines"
            className="px-3 py-2 border rounded text-slate-100 border-slate-600 hover:border-gold text-sm"
          >
            Vista comprador
          </Link>
        </div>
      </div>
    </div>
  );
}
