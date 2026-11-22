// components/home/HowItWorks.js
import { CreditCard, Search, Send, Wrench } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    title: 'Find a service',
    text: 'Search by device or category and compare approved technicians, prices and service areas.',
  },
  {
    icon: Send,
    title: 'Send a request',
    text: 'Share your phone, address, preferred date and what is wrong. The technician replies fast.',
  },
  {
    icon: Wrench,
    title: 'Technician fixes it',
    text: 'Follow the job from accepted to in progress to completed, right from your dashboard.',
  },
  {
    icon: CreditCard,
    title: 'Pay after completion',
    text: 'The Pay Now button appears only when the job is done. Pay securely with Stripe.',
  },
];

export default function HowItWorks() {
  return (
    <section className="section section-alt">
      <div className="container">
        <h2 className="section-title">How FixMate works</h2>
        <p className="section-sub">
          Four simple steps from a broken device to a working one, with no
          payment upfront.
        </p>

        <ol className="steps">
          {STEPS.map((step, i) => (
            <li key={step.title} className="step">
              <div className="step-icon">
                <step.icon size={24} />
                <span className="step-num">{i + 1}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
