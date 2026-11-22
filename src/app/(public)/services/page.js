
import Link from 'next/link';
import { Suspense } from 'react';
import { SearchX } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import ServiceFilters from '@/components/services/ServiceFilters';
import { getServices } from '@/lib/api';

export const metadata = { title: 'Browse Services' };

const PAGE_SIZE = 12;

export default async function ServicesPage({ searchParams }) {
  const sp = await searchParams;
  const { services, total, page, totalPages } = await getServices({
    search: sp.search,
    category: sp.category,
    mode: sp.mode,
    sort: sp.sort,
    page: sp.page,
    limit: PAGE_SIZE,
  });

  // keep every active filter when moving between pages
  const pageHref = p => {
    const q = new URLSearchParams();
    ['search', 'category', 'mode', 'sort'].forEach(k => {
      if (sp[k]) q.set(k, sp[k]);
    });
    q.set('page', String(p));
    return `/services?${q.toString()}`;
  };

  const first = Math.max(1, page - 2);
  const last = Math.min(totalPages, page + 2);
  const pages = [];
  for (let p = first; p <= last; p++) pages.push(p);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Browse repair services</h1>
          <p>
            Compare approved technicians, prices and service areas, then send
            your request.
          </p>

          <Suspense
            fallback={
              <div className="skeleton" style={{ height: 44, marginTop: 32 }} />
            }
          >
            <ServiceFilters key={JSON.stringify(sp)} />
          </Suspense>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          {services.length > 0 ? (
            <>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
                Showing {services.length} of {total} services
              </p>
              <div
                className="service-grid service-grid-4"
                style={{ marginTop: 20 }}
              >
                {services.map(service => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="pagination" aria-label="Pagination">
                  <Link
                    href={pageHref(Math.max(1, page - 1))}
                    className={`page-link ${page <= 1 ? 'disabled' : ''}`}
                  >
                    Previous
                  </Link>
                  {pages.map(p => (
                    <Link
                      key={p}
                      href={pageHref(p)}
                      aria-current={p === page ? 'page' : undefined}
                      className={`page-link ${p === page ? 'active' : ''}`}
                    >
                      {p}
                    </Link>
                  ))}
                  <Link
                    href={pageHref(Math.min(totalPages, page + 1))}
                    className={`page-link ${page >= totalPages ? 'disabled' : ''}`}
                  >
                    Next
                  </Link>
                </nav>
              )}
            </>
          ) : (
            <div className="empty">
              <SearchX size={40} />
              <h3>No services match your search</h3>
              <p>
                Try a different keyword, or clear the filters to see every
                approved service.
              </p>
              <Link href="/services" className="btn btn-primary">
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
