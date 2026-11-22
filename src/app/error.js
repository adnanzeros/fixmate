
'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { TriangleAlert } from 'lucide-react';

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="nf">
      <TriangleAlert size={56} color="#C8102E" style={{ marginBottom: 20 }} />
      <h1>Something went wrong</h1>
      <p>
        An unexpected error stopped this page from loading. Please try again, or
        go back to the home page.
      </p>
      <div className="nf-actions">
        <button className="btn btn-primary" onClick={() => reset()}>
          Try again
        </button>
        <Link href="/" className="btn btn-outline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
