
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { CATEGORIES, SERVICE_MODES, SORT_OPTIONS } from '@/lib/constants';


export default function ServiceFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get('search') ?? '');

  const hasFilters = ['search', 'category', 'mode', 'sort'].some(k =>
    params.get(k),
  );

  function update(next) {
    const q = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value) q.set(key, value);
      else q.delete(key);
    });
    q.delete('page'); // back to page 1 when filters change
    const qs = q.toString();
    router.push(qs ? `/services?${qs}` : '/services');
  }

  function onSearch(e) {
    e.preventDefault();
    update({ search: search.trim() });
  }

  function clearAll() {
    setSearch('');
    router.push('/services');
  }

  return (
    <div>
      <div className="filters">
        <form onSubmit={onSearch} className="search-box" role="search">
          <label htmlFor="svc-search" className="sr-only">
            Search by title or category
          </label>
          <Search size={18} />
          <input
            id="svc-search"
            type="search"
            className="input"
            placeholder="Search by title or category"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </form>

        <div>
          <label htmlFor="svc-category" className="sr-only">
            Category
          </label>
          <select
            id="svc-category"
            className="input"
            value={params.get('category') ?? ''}
            onChange={e => update({ category: e.target.value })}
          >
            <option value="">All categories</option>
            {CATEGORIES.map(c => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="svc-mode" className="sr-only">
            Service mode
          </label>
          <select
            id="svc-mode"
            className="input"
            value={params.get('mode') ?? ''}
            onChange={e => update({ mode: e.target.value })}
          >
            <option value="">Any service mode</option>
            {SERVICE_MODES.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="svc-sort" className="sr-only">
            Sort by
          </label>
          <select
            id="svc-sort"
            className="input"
            value={params.get('sort') ?? 'newest'}
            onChange={e =>
              update({
                sort: e.target.value === 'newest' ? '' : e.target.value,
              })
            }
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasFilters && (
        <div className="filters-bar">
          <span>Filters applied</span>
          <button type="button" className="link-btn" onClick={clearAll}>
            <X size={14} /> Clear all
          </button>
        </div>
      )}
    </div>
  );
}
