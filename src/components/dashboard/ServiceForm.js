
'use client';


import { useState } from 'react';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import { CATEGORIES, SERVICE_MODES } from '@/lib/constants';
import { useSession } from '@/lib/auth-client';
import { authFetch } from '@/lib/auth-fetch';
import { uploadImage } from '@/lib/imgbb';


export default function ServiceForm({ service = null, onSaved }) {
  const { data: session } = useSession();
  const isEdit = Boolean(service);

  const [form, setForm] = useState({
    title: service?.title ?? '',
    category: service?.category ?? '',
    description: service?.description ?? '',
    basePrice: service?.basePrice ?? '',
    estimatedDuration: service?.estimatedDuration ?? '',
    serviceMode: service?.serviceMode ?? '',
    serviceArea: service?.serviceArea ?? '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(service?.image ?? '');
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
    if (form.title.trim().length < 3)
      next.title = 'Title must be at least 3 characters';
    if (!form.category) next.category = 'Choose a category';
    if (form.description.trim().length < 10)
      next.description = 'Description must be at least 10 characters';
    if (!(Number(form.basePrice) > 0))
      next.basePrice = 'Enter a positive price';
    if (!form.estimatedDuration.trim())
      next.estimatedDuration = 'Estimated duration is required';
    if (!form.serviceMode) next.serviceMode = 'Choose a service mode';
    if (form.serviceArea.trim().length < 2)
      next.serviceArea = 'Service area is required';
    if (!isEdit && !file) next.image = 'Upload a service image';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const body = { ...form, basePrice: Number(form.basePrice) };
      if (file) body.image = await uploadImage(file); // ImgBB upload

      const saved = await authFetch(
        isEdit ? `/api/services/${service._id}` : '/api/services',
        { method: isEdit ? 'PATCH' : 'POST', body: JSON.stringify(body) },
      );

      toast.success(
        isEdit
          ? 'Service updated. It is waiting for admin approval again.'
          : 'Service added. It is waiting for admin approval.',
      );
      onSaved?.(saved);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const err = field =>
    errors[field] && <p className="field-error">{errors[field]}</p>;

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <div className="field">
          <label className="label" htmlFor="sf-tname">
            Technician name
          </label>
          <input
            id="sf-tname"
            className="input"
            value={session?.user?.name ?? ''}
            readOnly
          />
        </div>
        <div className="field">
          <label className="label" htmlFor="sf-temail">
            Technician email
          </label>
          <input
            id="sf-temail"
            className="input"
            value={session?.user?.email ?? ''}
            readOnly
          />
        </div>

        <div className="field span-2">
          <label className="label" htmlFor="sf-title">
            Title
          </label>
          <input
            id="sf-title"
            className={`input ${errors.title ? 'has-error' : ''}`}
            placeholder="e.g. iPhone Screen Replacement"
            value={form.title}
            onChange={set('title')}
          />
          {err('title')}
        </div>

        <div className="field">
          <label className="label" htmlFor="sf-category">
            Category
          </label>
          <select
            id="sf-category"
            className={`input ${errors.category ? 'has-error' : ''}`}
            value={form.category}
            onChange={set('category')}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(c => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          {err('category')}
        </div>

        <div className="field">
          <label className="label" htmlFor="sf-mode">
            Service mode
          </label>
          <select
            id="sf-mode"
            className={`input ${errors.serviceMode ? 'has-error' : ''}`}
            value={form.serviceMode}
            onChange={set('serviceMode')}
          >
            <option value="">Select a mode</option>
            {SERVICE_MODES.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {err('serviceMode')}
        </div>

        <div className="field">
          <label className="label" htmlFor="sf-price">
            Base price (USD)
          </label>
          <input
            id="sf-price"
            type="number"
            min="1"
            step="0.01"
            className={`input ${errors.basePrice ? 'has-error' : ''}`}
            placeholder="45"
            value={form.basePrice}
            onChange={set('basePrice')}
          />
          {err('basePrice')}
        </div>

        <div className="field">
          <label className="label" htmlFor="sf-duration">
            Estimated duration
          </label>
          <input
            id="sf-duration"
            className={`input ${errors.estimatedDuration ? 'has-error' : ''}`}
            placeholder="e.g. 2-3 hours"
            value={form.estimatedDuration}
            onChange={set('estimatedDuration')}
          />
          {err('estimatedDuration')}
        </div>

        <div className="field span-2">
          <label className="label" htmlFor="sf-area">
            Service area
          </label>
          <input
            id="sf-area"
            className={`input ${errors.serviceArea ? 'has-error' : ''}`}
            placeholder="e.g. Dhanmondi, Dhaka"
            value={form.serviceArea}
            onChange={set('serviceArea')}
          />
          {err('serviceArea')}
        </div>

        <div className="field span-2">
          <label className="label" htmlFor="sf-desc">
            Description
          </label>
          <textarea
            id="sf-desc"
            className={`input ${errors.description ? 'has-error' : ''}`}
            placeholder="What does this service include?"
            value={form.description}
            onChange={set('description')}
          />
          {err('description')}
        </div>

        <div className="field span-2">
          <label className="label" htmlFor="sf-image">
            Service image {isEdit && '(leave empty to keep the current one)'}
          </label>
          <div className="file-box">
            {preview && (
              <img src={preview} alt="Service preview" className="preview" />
            )}
            <input
              id="sf-image"
              type="file"
              accept="image/*"
              onChange={onFile}
            />
          </div>
          {err('image')}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading && <LoaderCircle size={16} className="spin" />}
          {isEdit ? 'Save changes' : 'Add service'}
        </button>
      </div>
    </form>
  );
}
