// fixmath/src/components/auth/SignUpForm.js
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoaderCircle, UserRound, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import PasswordInput from './PasswordInput';
import GoogleButton from './GoogleButton';
import { signUp } from '@/lib/auth-client';
import { ROLE_DASHBOARD } from '@/lib/constants';
import { safeRedirect } from '@/lib/utils';
import {
  validateEmail,
  validateName,
  validatePassword,
} from '@/lib/validators';

// Admin is intentionally not selectable. The server also forces anything else to 'customer'.
const ROLES = [
  {
    value: 'customer',
    title: 'Customer',
    text: 'Book repairs',
    icon: UserRound,
  },
  {
    value: 'technician',
    title: 'Technician',
    text: 'Offer repair services',
    icon: Wrench,
  },
];

export default function SignUpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = safeRedirect(params.get('redirect'));

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [role, setRole] = useState('customer');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  function validate() {
    const next = {};
    const nameError = validateName(form.name);
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    if (nameError) next.name = nameError;
    if (emailError) next.email = emailError;
    if (passwordError) next.password = passwordError;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const { data, error } = await signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role,
    });
    setLoading(false);

    if (error) {
      // e.g. "User already exists"
      toast.error(error.message || 'Could not create your account');
      return;
    }

    toast.success('Account created. Welcome to FixMate!');
    const finalRole = data?.user?.role ?? role;
    router.push(redirect ?? ROLE_DASHBOARD[finalRole] ?? '/dashboard');
    router.refresh();
  }

  return (
    <div className="auth-card">
      <h1>Create your account</h1>
      <p className="auth-sub">Join FixMate as a customer or a technician.</p>

      <form onSubmit={onSubmit} noValidate>
        <div className="field">
          <span className="label" id="role-label">
            I want to join as
          </span>
          <div
            className="role-cards"
            role="radiogroup"
            aria-labelledby="role-label"
          >
            {ROLES.map(r => (
              <button
                key={r.value}
                type="button"
                role="radio"
                aria-checked={role === r.value}
                onClick={() => setRole(r.value)}
                className={`role-card ${role === r.value ? 'selected' : ''}`}
              >
                <r.icon size={22} />
                <strong>{r.title}</strong>
                <span>{r.text}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="su-name">
            Full name
          </label>
          <input
            id="su-name"
            className={`input ${errors.name ? 'has-error' : ''}`}
            placeholder="Your full name"
            autoComplete="name"
            value={form.name}
            onChange={set('name')}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="field">
          <label className="label" htmlFor="su-email">
            Email
          </label>
          <input
            id="su-email"
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
          <label className="label" htmlFor="su-password">
            Password
          </label>
          <PasswordInput
            id="su-password"
            value={form.password}
            onChange={set('password')}
            error={errors.password}
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
          {errors.password ? (
            <p className="field-error">{errors.password}</p>
          ) : (
            <p className="side-note" style={{ marginTop: 6 }}>
              Use 6+ characters with an uppercase and a lowercase letter.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoaderCircle size={16} className="spin" /> Creating account
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <GoogleButton callbackURL={redirect ?? '/dashboard'} />

      <p className="auth-foot">
        Already have an account?{' '}
        <Link
          href={
            redirect
              ? `/sign-in?redirect=${encodeURIComponent(redirect)}`
              : '/sign-in'
          }
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
