'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import AdminContent from '../page'; // your existing admin page content
import Loader from '@/components/Loader';

export default function AdminPage() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.isAdmin) {
      router.replace('/');
    }
  }, [user, router]);

  if (!user) {
    // still loading user info or redirecting
    return <Loader/>
  }

  // user is admin → render admin content
  return <AdminContent />;
}
