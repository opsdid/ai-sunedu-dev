'use client';

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { SuneduLogo } from "./Icons"; // Assuming this file exists and exports SuneduLogo

export default function NavBar() {
  // Get both session data and the authentication status
  const { data: session, status } = useSession();

  // Check if the currently logged-in user is an admin
  const isAdmin = (session?.user as any)?.role === 'admin';

  return (
    <>
      <div className="flex flex-row justify-between items-center w-[1250px] m-auto p-6">
        <div className="flex flex-row items-center gap-4">
          <Link href="https://sunedu.id/" target="_blank">
            <SuneduLogo />
          </Link>
          <div className="bg-gradient-to-br from-sky-300 to-indigo-500 bg-clip-text">
            <Link href="https://ai.sunedu.id/">
            <p className="text-xl font-semibold text-transparent">
              Sunedu.id
            </p>
            </Link>
          </div>
        </div>
        <div className="flex flex-row items-center gap-6">
          <Link
            href="https://ai.sunedu.id/"
            target="_blank"
          >
            Interactive AI
          </Link>
          <Link
            href="https://sunedu.id/services/learning-management-system/"
            target="_blank"
          >
            Learning Management System
          </Link>
          <Link
            href="https://sunedu.id/services/microlearning-content/"
            target="_blank"
          >
            Microlearning
          </Link>
          <Link
            href="https://sunedu.id/services/blended-training/"
            target="_blank"
          >
            Employee Training
          </Link>

          {/* Only show the following content if the user is authenticated */}
          {status === 'authenticated' && (
            <>
              {/* This link is only visible to admins */}
              {isAdmin && (
                <Link href="/admin/users" className="font-semibold text-blue-400 hover:text-blue-500 transition-colors">
                  User Management
                </Link>
              )}
              
              <span className="text-gray-400">
                Welcome, {session.user?.name || 'User'}
              </span>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}