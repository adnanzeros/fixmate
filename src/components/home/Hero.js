
import {
  BadgeCheck,
  CircleCheck,
  CreditCard,
  Search,
  Smartphone,
  Wrench,
} from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-blob" />

      <div className="container hero-grid">
        <div>
          <h1 className="hero-title">
            Broken device? Get it fixed by verified technicians.
          </h1>
          <p className="hero-sub">
            Book a repair for your phone, laptop, AC or fridge, follow the job
            at every step, and pay only after the work is done.
          </p>

          <form action="/services" method="get" className="hero-search">
            <label htmlFor="hero-search" className="sr-only">
              Search repair services
            </label>
            <div className="hero-search-field">
              <Search size={20} />
              <input
                id="hero-search"
                name="search"
                type="text"
                placeholder='Try "iPhone screen" or "AC servicing"'
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Find a Technician
            </button>
          </form>

          <ul className="hero-trust">
            <li>
              <BadgeCheck size={20} /> Verified technicians
            </li>
            <li>
              <CircleCheck size={20} /> Live job tracking
            </li>
            <li>
              <CreditCard size={20} /> Pay after service
            </li>
          </ul>
        </div>

        {/* Visual: a repair job in progress */}
        <div className="hv">
          <div className="hv-panel" />
          <div className="hv-ring hv-ring-1" />
          <div className="hv-ring hv-ring-2" />
          <Wrench className="hv-wrench" strokeWidth={1.25} />

          <div className="hv-card hv-card-1">
            <span className="hv-card-icon">
              <Smartphone size={20} />
            </span>
            <div>
              <p className="hv-card-title">iPhone screen fix</p>
              <p className="hv-status hv-status-done">Completed</p>
            </div>
          </div>

          <div className="hv-card hv-card-2">
            <span className="hv-dot" />
            <div>
              <p className="hv-card-title">AC servicing</p>
              <p className="hv-status hv-status-progress">In progress</p>
            </div>
          </div>

          <div className="hv-pay">
            <small>Payment</small>
            <strong>Unlocks when the job is done</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
