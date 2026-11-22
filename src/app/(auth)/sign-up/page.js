// fixmath/src/app/(auth)/sign-up/page.js
import { Suspense } from 'react';
import SignUpForm from '@/components/auth/SignUpForm';

export const metadata = { title: 'Sign Up' };

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
