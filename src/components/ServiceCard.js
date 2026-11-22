// components/ServiceCard.js
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, UserRound, Wrench } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function ServiceCard({ service }) {
  return (
    <article className="card service-card">
      <div className="service-card-img">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
          />
        ) : (
          <div className="service-card-placeholder">
            <Wrench size={48} />
          </div>
        )}
        <span className="service-card-cat">{service.category}</span>
      </div>

      <div className="service-card-body">
        <h3 className="service-card-title">{service.title}</h3>

        <div className="service-card-meta">
          <span className="chip">{service.serviceMode}</span>
          <span className="with-icon">
            <MapPin size={14} />
            <span>{service.serviceArea}</span>
          </span>
        </div>

        <p className="service-card-tech">
          <UserRound size={16} />
          <span>{service.technicianName}</span>
        </p>

        <div className="service-card-foot">
          <div>
            <p className="price-label">Starting from</p>
            <p className="price">{formatPrice(service.basePrice)}</p>
          </div>
          <Link href={`/services/${service._id}`} className="btn btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
