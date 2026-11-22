
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, MapPin, Tag, Wrench } from 'lucide-react';
import RequestRepair from '@/components/services/RequestRepair';
import { getService } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const service = await getService(id);
  return { title: service ? service.title : 'Service not found' };
}

export default async function ServiceDetailsPage({ params }) {
  const { id } = await params;
  const service = await getService(id);

  // Not found, not approved or not available => 404 page
  if (!service || service.approvalStatus !== 'approved' || !service.isAvailable)
    notFound();

  const tech = service.technician;
  const techName = tech?.name ?? service.technicianName;

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/services">Services</Link> /{' '}
        <strong>{service.title}</strong>
      </nav>

      <div className="details-grid">
        <div>
          <div className="details-image">
            {service.image ? (
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
              />
            ) : (
              <div className="service-card-placeholder">
                <Wrench size={64} />
              </div>
            )}
          </div>

          <div className="details-badges">
            <span className="badge">{service.category}</span>
            <span className="badge badge-soft">{service.serviceMode}</span>
          </div>
          <h1 className="details-title">{service.title}</h1>
          <p className="details-desc">{service.description}</p>

          <div className="info-grid">
            <div className="card info-item">
              <Clock size={20} />
              <div>
                <small>Estimated duration</small>
                <strong>{service.estimatedDuration}</strong>
              </div>
            </div>
            <div className="card info-item">
              <Tag size={20} />
              <div>
                <small>Service mode</small>
                <strong>{service.serviceMode}</strong>
              </div>
            </div>
            <div className="card info-item">
              <MapPin size={20} />
              <div>
                <small>Service area</small>
                <strong>{service.serviceArea}</strong>
              </div>
            </div>
          </div>
        </div>

        <aside className="side">
          <div className="card side-card">
            <p className="price-label">Starting from</p>
            <p className="side-price">{formatPrice(service.basePrice)}</p>
            <p className="side-note">
              You pay only after the technician completes the job. The final
              amount is confirmed at completion.
            </p>
            <div style={{ marginTop: 20 }}>
              <RequestRepair
                service={{
                  _id: service._id,
                  title: service.title,
                  technicianName: techName,
                }}
              />
            </div>
          </div>

          <div className="card side-card">
            <div className="tech">
              {tech?.image ? (
                <img src={tech.image} alt={techName} className="tech-photo" />
              ) : (
                <span className="tech-initial">
                  {techName.charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <h3>{techName}</h3>
                <small>
                  <MapPin size={13} /> {tech?.area || service.serviceArea}
                </small>
              </div>
            </div>
            {tech?.bio && <p className="tech-bio">{tech.bio}</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
