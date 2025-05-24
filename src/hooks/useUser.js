'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { decode } from 'jsonwebtoken';


export function useUser() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/');
      return;
    }

    try {
      const decoded = decode(token);

      const isAdmin = decoded.role === 'admin';

      if (!isAdmin) {
        router.push('/');
        return;
      }

      setUser({ ...decoded, isAdmin });
    } catch (error) {
      console.log('Error decoding token:', error);
      router.push('/');
    }
  }, [router]);

  return user;
}
