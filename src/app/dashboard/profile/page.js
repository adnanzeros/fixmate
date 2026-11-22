// fixmath/src/app/dashboard/profile/page.js
'use client';

import { useSession } from '@/lib/auth-client';
import PageHeader from '@/components/dashboard/PageHeader';
import { Loading } from '@/components/dashboard/DataState';
import ProfileForm from '@/components/dashboard/ProfileForm';

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  return (
    <>
      <PageHeader
        title="Update Profile"
        subtitle="Keep your details up to date."
      />
      {isPending || !session ? (
        <Loading />
      ) : (
        // key makes the form start from the latest saved values
        <ProfileForm key={session.user.updatedAt} user={session.user} />
      )}
    </>
  );
}
