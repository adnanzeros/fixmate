// components/home/FeaturedServices.js
import Link from 'next/link';
import { PackageSearch } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import { getServices } from '@/lib/api';

export default async function FeaturedServices() {
  // Server returns approved + available services, newest first (limit 6)
  const { services } = await getServices({ sort: 'newest', limit: 6 });

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2 className="section-title">Latest repair services</h2>
            <p className="section-sub">
              Freshly approved services from technicians near you. Pick one and
              send a request in a minute.
            </p>
          </div>
          <Link href="/services" className="btn btn-outline">
            View all services
          </Link>
        </div>

        {services.length > 0 ? (
          <div className="service-grid">
            {services.map(service => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <PackageSearch size={40} />
            <h3>No services yet</h3>
            <p>
              Approved services will show up here. Check back soon or browse the
              full list.
            </p>
            <Link href="/services" className="btn btn-primary">
              Browse services
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
