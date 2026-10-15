import Link from 'next/link';
import { getSiteContent } from '@/lib/site-content';

const SECTION_CARDS = [
  { id: 'guardados', href: '/wines#guardados', className: 'home-category-unique' },
  { id: 'vinos', href: '/wines', className: 'home-category-varietals' },
  { id: 'regaleria', href: '/wines#regaleria', className: 'home-category-gifts' },
] as const;

export default async function Home() {
  const c = await getSiteContent();
  const steps = [1, 2, 3] as const;
  const stores = [1, 2] as const;

  return (
    <main className="buyer-bodegon-bg text-amber-50">
      <div className="container-premium py-8 md:py-12">
      <section className="home-cover grain-overlay p-8 md:p-12 lg:p-16">
        <div className="flex min-h-[inherit] items-end">
          <div className="max-w-2xl space-y-7">
            <span className="wine-section-label">{c['home.kicker']}</span>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-playfair font-semibold leading-[0.95] md:text-7xl">
                {c['home.title']}
              </h1>
              <p className="text-2xl md:text-3xl text-gold/95 font-playfair">{c['home.subtitle']}</p>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-amber-100/78">
              {c['home.description']}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/wines" className="btn-premium px-6 py-4 text-base">
                {c['home.primaryButton']}
              </Link>
              <Link href="/cart" className="rounded-full border border-amber-100/20 px-6 py-4 text-center text-amber-50 transition hover:border-gold hover:bg-gold/10">
                {c['home.secondaryButton']}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-5 md:grid-cols-3">
        {SECTION_CARDS.map((card) => (
          <Link key={card.id} href={card.href} className={`home-category-card ${card.className} group`}>
            <div className="relative z-10 p-6">
              <span className="wine-section-label">{c[`sec.${card.id}.cardLabel`]}</span>
              <h2 className="mt-4 text-2xl font-semibold">{c[`sec.${card.id}.cardTitle`]}</h2>
              <p className="mt-3 leading-7 text-amber-100/82">
                {c[`sec.${card.id}.cardText`]}
              </p>
              <span className="mt-5 inline-flex text-sm text-gold transition group-hover:translate-x-1">{c[`sec.${card.id}.cardButton`]}</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-16">
        <div className="wine-card p-7 md:p-8">
          <span className="wine-section-label">{c['how.label']}</span>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step} className="rounded-2xl border border-gold/10 bg-black/20 p-5">
                <p className="text-gold text-sm">{String(step).padStart(2, '0')}</p>
                <h3 className="mt-2 text-xl font-playfair">{c[`how.${step}.title`]}</h3>
                <p className="mt-2 text-sm leading-6 text-amber-100/68">{c[`how.${step}.text`]}</p>
              </div>
            ))}
          </div>
        </div>

      </section>

      <footer className="mt-16 wine-card p-7 md:p-8">
          <span className="wine-section-label">{c['stores.label']}</span>
          <h2 className="mt-4 text-3xl font-playfair">{c['stores.title']}</h2>
          <p className="mt-3 max-w-xl leading-7 text-amber-100/72">
            {c['stores.text']}
          </p>
          <div className="wine-divider my-6" />
          <div className="space-y-4 text-amber-50">
            {stores.filter((store) => c[`stores.${store}.name`]).map((store) => (
              <div key={store} className="rounded-2xl border border-gold/14 bg-black/20 p-5">
                <h3 className="font-semibold">{c[`stores.${store}.name`]}</h3>
                {c[`stores.${store}.hours`].split('\n').filter(Boolean).map((line, index) => (
                  <p key={index} className={`text-sm leading-6 text-amber-100/68 ${index === 0 ? 'mt-2' : ''}`}>{line}</p>
                ))}
              </div>
            ))}
          </div>
      </footer>
      </div>
    </main>
  );
}
