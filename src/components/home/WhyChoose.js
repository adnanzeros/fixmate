// components/home/WhyChoose.js
import { Activity, Quote, ShieldCheck, Wallet, BadgeCheck } from 'lucide-react';

const TRUST = [
  {
    icon: ShieldCheck,
    title: 'Services are reviewed before they go live',
    text: 'Every listing is checked by an admin, so you only see technicians that passed review.',
  },
  {
    icon: Activity,
    title: 'You always know the job status',
    text: 'Requested, accepted, in progress, completed. No more wondering what happened to your device.',
  },
  {
    icon: Wallet,
    title: 'Pay only after the work is done',
    text: 'The Pay Now button appears when the technician marks the job completed.',
  },
  {
    icon: BadgeCheck,
    title: 'A clear final price',
    text: 'See the starting price up front and the final amount before you pay a single taka.',
  },
];

const STATS = [
  { value: '500+', label: 'Verified technicians' },
  { value: '12k+', label: 'Jobs completed' },
  { value: '4.8/5', label: 'Average rating' },
  { value: '0', label: 'Payments taken upfront' },
];

const TESTIMONIALS = [
  {
    quote:
      'My phone screen was replaced the same afternoon. I could see when the technician accepted and started, and I paid only after I checked it.',
    name: 'Nusrat Jahan',
    place: 'Mirpur, Dhaka',
  },
  {
    quote:
      'Our AC stopped cooling before Eid. I booked a home visit in two minutes and the status updates kept the whole family informed.',
    name: 'Tanvir Ahmed',
    place: 'Dhanmondi, Dhaka',
  },
  {
    quote:
      'As a technician I finally have one place for my services and requests. Setting the final amount at completion keeps things fair.',
    name: 'Rafiqul Islam',
    place: 'Uttara, Dhaka',
  },
];

export default function WhyChoose() {
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="why-grid">
          <div>
            <h2 className="section-title">Why people choose FixMate</h2>
            <p className="section-sub">
              We built FixMate around two things repair customers ask for most:
              clear updates and no payment before the job is done.
            </p>

            <ul className="trust-list">
              {TRUST.map(t => (
                <li key={t.title} className="trust-item">
                  <span className="trust-icon">
                    <t.icon size={22} />
                  </span>
                  <div>
                    <h3>{t.title}</h3>
                    <p>{t.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="stats">
            {STATS.map(s => (
              <div key={s.label} className="stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="why-block">
          <h3 className="subhead">What customers say</h3>
          <div className="testimonials">
            {TESTIMONIALS.map(t => (
              <figure
                key={t.name}
                className="card testimonial"
                style={{ margin: 0 }}
              >
                <Quote size={28} />
                <p>{t.quote}</p>
                <footer>
                  <strong>{t.name}</strong>
                  <span>{t.place}</span>
                </footer>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
