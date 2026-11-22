// fixmath/src/components/services/RequestRepair.js
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CircleCheck, LoaderCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from '@/lib/auth-client';
import { authFetch } from '@/lib/auth-fetch';
import { todayString } from '@/lib/utils';
import { validatePhone } from '@/lib/validators';

function RepairForm({ service, user, onClose }) {
  const [form, setForm] = useState({
    phone: '',
    address: '',
    preferredDate: todayString(),
    problem: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  function validate() {
    const next = {};
    const phoneError = validatePhone(form.phone);
    if (phoneError) next.phone = phoneError;
    if (!form.address.trim()) next.address = 'Address is required';
    if (!form.preferredDate) next.preferredDate = 'Choose a date';
    else if (form.preferredDate < todayString())
      next.preferredDate = 'Date must be today or later';
    if (form.problem.trim().length < 20) {
      next.problem = 'Describe the problem in at least 20 characters';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Server reads name / email from the verified token and copies service data itself
      await authFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: service._id,
          customerPhone: form.phone.trim(),
          address: form.address.trim(),
          preferredDate: form.preferredDate,
          problemDescription: form.problem.trim(),
        }),
      });
      toast.success('Repair request sent!');
      setDone(true);
    } catch (err) {
      // e.g. "You already have an active request for this service"
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="success-box">
        <CircleCheck size={48} />
        <h3>Request sent</h3>
        <p>
          {service.technicianName} will review your request. You can follow
          every update from your bookings.
        </p>
        <Link
          href="/dashboard/customer/bookings"
          className="btn btn-primary btn-block"
        >
          Go to My Bookings
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="form-row">
        <div className="field">
          <label className="label" htmlFor="rr-name">
            Name
          </label>
          <input id="rr-name" className="input" value={user.name} readOnly />
        </div>
        <div className="field">
          <label className="label" htmlFor="rr-email">
            Email
          </label>
          <input id="rr-email" className="input" value={user.email} readOnly />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label className="label" htmlFor="rr-phone">
            Phone
          </label>
          <input
            id="rr-phone"
            type="tel"
            className={`input ${errors.phone ? 'has-error' : ''}`}
            placeholder="+880 1XXX-XXXXXX"
            value={form.phone}
            onChange={set('phone')}
          />
          {errors.phone && <p className="field-error">{errors.phone}</p>}
        </div>
        <div className="field">
          <label className="label" htmlFor="rr-date">
            Preferred date
          </label>
          <input
            id="rr-date"
            type="date"
            min={todayString()}
            className={`input ${errors.preferredDate ? 'has-error' : ''}`}
            value={form.preferredDate}
            onChange={set('preferredDate')}
          />
          {errors.preferredDate && (
            <p className="field-error">{errors.preferredDate}</p>
          )}
        </div>
      </div>

      <div className="field">
        <label className="label" htmlFor="rr-address">
          Address
        </label>
        <input
          id="rr-address"
          className={`input ${errors.address ? 'has-error' : ''}`}
          placeholder="House, road, area"
          value={form.address}
          onChange={set('address')}
        />
        {errors.address && <p className="field-error">{errors.address}</p>}
      </div>

      <div className="field">
        <label className="label" htmlFor="rr-problem">
          Problem description
        </label>
        <textarea
          id="rr-problem"
          className={`input ${errors.problem ? 'has-error' : ''}`}
          placeholder="What is wrong with the device? When did it start?"
          value={form.problem}
          onChange={set('problem')}
        />
        {errors.problem && <p className="field-error">{errors.problem}</p>}
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={loading}
      >
        {loading ? (
          <>
            <LoaderCircle size={16} className="spin" /> Sending request
          </>
        ) : (
          'Send request'
        )}
      </button>
    </form>
  );
}

export default function RequestRepair({ service }) {
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);

  const user = session?.user;
  const role = user?.role ?? 'customer';

  // close on Escape + lock page scroll while the modal is open
  useEffect(() => {
    if (!open) return;
    const onKey = e => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  if (isPending) {
    return (
      <button className="btn btn-primary btn-block" disabled>
        Loading
      </button>
    );
  }

  // Logged out: go to sign in, then come back to this page
  if (!user) {
    return (
      <Link
        href={`/sign-in?redirect=${encodeURIComponent(`/services/${service._id}`)}`}
        className="btn btn-primary btn-block"
      >
        Request Repair
      </Link>
    );
  }

  // Technician / admin cannot request a repair
  if (role !== 'customer') {
    return (
      <>
        <button className="btn btn-primary btn-block" disabled>
          Request Repair
        </button>
        <p className="notice">Only customers can request a repair.</p>
      </>
    );
  }

  return (
    <>
      <button
        className="btn btn-primary btn-block"
        onClick={() => setOpen(true)}
      >
        Request Repair
      </button>

      {open && (
        <div
          className="modal-backdrop"
          onMouseDown={e => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rr-title"
          >
            <div className="modal-head">
              <div>
                <h2 id="rr-title">Request a repair</h2>
                <p>{service.title}</p>
              </div>
              <button
                className="close-btn"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <RepairForm
                service={service}
                user={user}
                onClose={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
