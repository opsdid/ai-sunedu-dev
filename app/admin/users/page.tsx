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
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated' && (session.user as any)?.role !== 'admin') {
      router.push('/');
    }

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
        {/* === THIS IS THE MISSING BUTTON === */}
        <Link 
          href="/admin/users/add" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          + Add New User
        </Link>
      </div>
      <div className="overflow-x-auto bg-gray-800 shadow-md rounded-lg">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Username
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Full Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-700">
                <td className="px-5 py-5 border-b border-gray-700 text-sm">
                  <p className="text-gray-100 whitespace-no-wrap">{user.id}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-700 text-sm">
                  <p className="text-gray-100 whitespace-no-wrap">{user.username}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-700 text-sm">
                  <p className="text-gray-100 whitespace-no-wrap">{`${user.firstname} ${user.lastname}`}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-700 text-sm">
                  <p className="text-gray-100 whitespace-no-wrap">{user.email}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-700 text-sm">
                  <span
                    className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${
                      user.rolename === 'admin' ? 'text-green-900 bg-green-200' : 'text-blue-900 bg-blue-200'
                    }`}
                  >
                    <span aria-hidden className="absolute inset-0 opacity-50 rounded-full"></span>
                    <span className="relative">{user.rolename}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}