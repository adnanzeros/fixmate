
import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

export default function Categories() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Popular repair categories</h2>
        <p className="section-sub">
          Choose what needs fixing and we will show only the services that
          match.
        </p>

        <div className="cat-grid">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              href={`/services?category=${encodeURIComponent(cat.name)}`}
              className="card cat-card"
            >
              <span className="cat-icon">
                <cat.icon size={24} />
              </span>
              <h3>{cat.name}</h3>
              <p>{cat.blurb}</p>
            </Link>
          ))}

          <Link href="/services" className="cat-all">
            <span className="cat-icon">
              <LayoutGrid size={24} />
            </span>
            <div>
              <h3>All services</h3>
              <p>Browse everything on FixMate</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
