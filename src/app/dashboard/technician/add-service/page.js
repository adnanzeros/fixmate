
'use client';

import { useRouter } from 'next/navigation';
import PageHeader from '@/components/dashboard/PageHeader';
import ServiceForm from '@/components/dashboard/ServiceForm';

export default function AddServicePage() {
  const router = useRouter();

  return (
    <>
      <PageHeader
        title="Add a Service"
        subtitle="New services stay pending until an admin approves them."
      />
      <div className="card panel max-form">
        <ServiceForm
          onSaved={() => router.push('/dashboard/technician/my-services')}
        />
      </div>
    </>
  );
}
