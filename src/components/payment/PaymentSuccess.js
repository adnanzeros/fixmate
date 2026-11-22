// PATH: fixmate/src/components/payment/PaymentSuccess.js
'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { CircleCheck, LoaderCircle, TriangleAlert } from 'lucide-react';
import { authFetch } from '@/lib/auth-fetch';
import { formatMoney } from '@/lib/format';

export default function PaymentSuccess() {
  const sessionId = useSearchParams().get('session_id');
  const [state, setState] = useState(sessionId ? 'loading' : 'error');
  const [payment, setPayment] = useState(null);
  const [message, setMessage] = useState(
    sessionId ? '' : 'Missing payment session.',
  );
  const started = useRef(false);

  useEffect(() => {
    if (!sessionId || started.current) return;
    started.current = true;

    // The server asks Stripe if the session is paid, then saves the payment once
    authFetch(
      `/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`,
    )
      .then(({ payment }) => {
        setPayment(payment);
        setState('done');
        toast.success('Payment successful');
      })
      .catch(err => {
        setMessage(err.message);
        setState('error');
        toast.error(err.message);
      });
  }, [sessionId]);

  if (state === 'loading') {
    return (
      <div className="card pay-card">
        <LoaderCircle size={44} className="spin pay-icon-warn" />
        <h1>Confirming your payment</h1>
        <p>Please wait a moment. Do not close this page.</p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="card pay-card">
        <TriangleAlert size={48} className="pay-icon-warn" />
        <h1>We could not confirm the payment</h1>
        <p>{message || 'Something went wrong.'}</p>
        <div style={{ marginTop: 24 }}>
          <Link
            href="/dashboard/customer/bookings"
            className="btn btn-primary btn-block"
          >
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card pay-card">
      <CircleCheck size={52} className="pay-icon-ok" />
      <h1>Payment successful</h1>
      <p>Thank you. Your technician has been paid for the completed job.</p>

      <div className="pay-rows">
        <div className="pay-row">
          <span>Service</span>
          <strong>{payment.serviceTitle}</strong>
        </div>
        <div className="pay-row">
          <span>Amount paid</span>
          <strong>{formatMoney(payment.amount)}</strong>
        </div>
        <div className="pay-row">
          <span>Transaction ID</span>
          <strong>{payment.transactionId}</strong>
        </div>
      </div>

      <Link
        href="/dashboard/customer/bookings"
        className="btn btn-primary btn-block"
      >
        Back to My Bookings
      </Link>
    </div>
  );
}
