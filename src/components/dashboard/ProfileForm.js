
'use client';


import { useState } from 'react';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import { ROLE_LABEL } from '@/lib/constants';
import { useSession } from '@/lib/auth-client';
import { authFetch } from '@/lib/auth-fetch';
import { uploadImage } from '@/lib/imgbb';
import { validateName, validatePhone } from '@/lib/validators';

export default function ProfileForm({ user }) {
  const { refetch } = useSession();
  const [form, setForm] = useState({
    name: user.name ?? '',
    phone: user.phone ?? '',
    area: user.area ?? '',
    bio: user.bio ?? '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user.image ?? '');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  function onFile(e) {
    const picked = e.target.files?.[0];
    if (!picked) return;
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  }

  function validate() {
    const next = {};
    const nameError = validateName(form.name);
    if (nameError) next.name = nameError;
    if (form.phone.trim()) {
      const phoneError = validatePhone(form.phone);
      if (phoneError) next.phone = phoneError;
    }
    if (form.bio.length > 600) next.bio = 'Bio must be under 600 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const body = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        area: form.area.trim(),
        bio: form.bio.trim(),
      };
      if (file) body.image = await uploadImage(file); // ImgBB upload

      await authFetch('/api/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(body),
      });

      // reload the session so the navbar and dashboard top bar show the new name / photo
      await refetch();
      toast.success('Profile updated');
      setFile(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card panel max-form">
      <div className="file-box" style={{ marginBottom: 24 }}>
        {preview ? (
          <img src={preview} alt="Profile" className="avatar-lg" />
        ) : (
          <span className="avatar-lg">{form.name.charAt(0).toUpperCase()}</span>
        )}
        <div>
          <label className="label" htmlFor="pf-image">
            Profile photo
          </label>
          <input id="pf-image" type="file" accept="image/*" onChange={onFile} />
        </div>
      </div>

      <div className="form-grid">
        <div className="field">
          <label className="label" htmlFor="pf-email">
            Email
          </label>
          <input id="pf-email" className="input" value={user.email} readOnly />
        </div>
        <div className="field">
          <label className="label" htmlFor="pf-role">
            Role
          </label>
          <input
            id="pf-role"
            className="input"
            value={ROLE_LABEL[user.role ?? 'customer']}
            readOnly
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="pf-name">
            Full name
          </label>
          <input
            id="pf-name"
            className={`input ${errors.name ? 'has-error' : ''}`}
            value={form.name}
            onChange={set('name')}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>
        <div className="field">
          <label className="label" htmlFor="pf-phone">
            Phone
          </label>
          <input
            id="pf-phone"
            type="tel"
            className={`input ${errors.phone ? 'has-error' : ''}`}
            placeholder="+880 1XXX-XXXXXX"
            value={form.phone}
            onChange={set('phone')}
          />
          {errors.phone && <p className="field-error">{errors.phone}</p>}
        </div>

        <div className="field span-2">
          <label className="label" htmlFor="pf-area">
            Area
          </label>
          <input
            id="pf-area"
            className="input"
            placeholder="e.g. Mirpur, Dhaka"
            value={form.area}
            onChange={set('area')}
          />
        </div>

        <div className="field span-2">
          <label className="label" htmlFor="pf-bio">
            Bio
          </label>
          <textarea
            id="pf-bio"
            className={`input ${errors.bio ? 'has-error' : ''}`}
            placeholder="Skills and experience (shown to customers if you are a technician)"
            value={form.bio}
            onChange={set('bio')}
          />
          {errors.bio && <p className="field-error">{errors.bio}</p>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading && <LoaderCircle size={16} className="spin" />}
          Save changes
        </button>
      </div>
    </form>
  );
}
