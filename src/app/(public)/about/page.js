
import Link from 'next/link';
import { Eye, HandCoins, ShieldCheck } from 'lucide-react';
import HowItWorks from '@/components/home/HowItWorks';

export const metadata = { title: 'How It Works' };

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Trust first',
    text: 'Technicians list their services and an admin reviews each one before customers can see it.',
  },
  {
    icon: Eye,
    title: 'Clear status',
    text: 'Every repair moves through visible steps, so nobody has to call to ask what is happening.',
  },
  {
    icon: HandCoins,
    title: 'Fair payment',
    text: 'Customers pay after the job is completed, and technicians set the final amount for the work done.',
  },
];

export default function AboutPage() {
  return (
    <>
      <div className="page-header">
        <div className="container about-intro" style={{ maxWidth: 1280 }}>
          <h1>Repairs you can follow from request to payment</h1>
          <p>
            Finding a trustworthy repair technician is hard. After handing over
            a device, most people have no idea what is happening and often pay
            before any work is done. FixMate gives every job a clear status and
            moves payment to the end.
          </p>
        </div>
      </div>

      <HowItWorks />

      <section className="section">
        <div className="container">
          <h2 className="section-title">What we stand for</h2>
          <p className="section-sub">
            FixMate serves customers, technicians and admins, and each group
            gets a workspace built for what they do.
          </p>
          <div className="values-grid">
            {VALUES.map(v => (
              <div key={v.title} className="card value-card">
                <span className="trust-icon">
                  <v.icon size={22} />
                </span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <h2>Ready to get your device fixed?</h2>
            <p>
              Browse approved services and send your first repair request today.
            </p>
            <Link href="/services" className="btn btn-primary">
              Browse services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
