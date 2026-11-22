'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import PasswordInput from './PasswordInput';
import GoogleButton from './GoogleButton';
import { signIn } from '@/lib/auth-client';
import { ROLE_DASHBOARD } from '@/lib/constants';
import { safeRedirect } from '@/lib/utils';
import { validateEmail } from '@/lib/validators';

export default function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = safeRedirect(params.get('redirect'));

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  function validate() {
    const next = {};
    const emailError = validateEmail(form.email);
    if (emailError) next.email = emailError;
    if (!form.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const { data, error } = await signIn.email({
      email: form.email.trim(),
      password: form.password,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || 'Invalid email or password');
      return;
    }

    toast.success('Signed in successfully');
    const role = data?.user?.role ?? 'customer';
    router.push(redirect ?? ROLE_DASHBOARD[role] ?? '/dashboard');
    router.refresh();
  }

  return (
    <div className="auth-card">
      <h1>Welcome back</h1>
      <p className="auth-sub">Sign in to manage your repair jobs.</p>

      <form onSubmit={onSubmit} noValidate>
        <div className="field">
          <label className="label" htmlFor="si-email">
            Email
          </label>
          <input
            id="si-email"
            type="email"
            className={`input ${errors.email ? 'has-error' : ''}`}
            placeholder="you@example.com"
            autoComplete="email"
            value={form.email}
            onChange={set('email')}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="field">
          <label className="label" htmlFor="si-password">
            Password
          </label>
          <PasswordInput
            id="si-password"
            value={form.password}
            onChange={set('password')}
            error={errors.password}
          />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoaderCircle size={16} className="spin" /> Signing in
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <GoogleButton callbackURL={redirect ?? '/dashboard'} />

      <p className="auth-foot">
        New to FixMate?{' '}
        <Link
          href={
            redirect
              ? `/sign-up?redirect=${encodeURIComponent(redirect)}`
              : '/sign-up'
          }
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
