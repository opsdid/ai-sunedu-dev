'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface User {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  rolename: string;
}

export default function ViewUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated' && (session.user as any)?.role !== 'admin') {
      router.push('/'); // Or a dedicated "access-denied" page
    }

    // Fetch users if authenticated as an admin
    if (status === 'authenticated' && (session.user as any)?.role === 'admin') {
      const fetchUsers = async () => {
        try {
          const res = await fetch('/api/users');
          if (!res.ok) {
            throw new Error('Failed to fetch users. You may not have permission.');
          }
          const data = await res.json();
          setUsers(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }
  }, [session, status, router]);

  if (status === 'loading' || loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  }

  if ((session?.user as any)?.role !== 'admin') {
     return <p className="text-center mt-10">Access Denied</p>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
        {/* === ADDED BUTTON === */}
        <Link 
          href="/admin/users/add" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          + Add New User
        </Link>
      </div>
      <div className="overflow-x-auto bg-gray-800 shadow-md rounded-lg">
        {/* ... existing table code ... */}
      </div>
    </div>
  );
}
