// PATH: fixmate/src/app/payment/success/page.js
import { Suspense } from 'react';
import PaymentSuccess from '@/components/payment/PaymentSuccess';

export const metadata = { title: 'Payment successful' };

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccess />
    </Suspense>
  );
}
