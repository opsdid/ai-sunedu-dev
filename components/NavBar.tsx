"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { GithubIcon, SuneduLogo } from "./Icons";

export default function NavBar() {
  const { data: session } = useSession();
  return (
    <>
      <div className="flex flex-row justify-between items-center w-[1000px] m-auto p-6">
        <div className="flex flex-row items-center gap-4">
          <Link href="https://sunedu.id/" target="_blank">
            <SuneduLogo />
          </Link>
          <div className="bg-gradient-to-br from-sky-300 to-indigo-500 bg-clip-text">
            <p className="text-xl font-semibold text-transparent">
              Sunedu.id
            </p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-6">
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
          {status === 'authenticated' && (
            <>
              {isAdmin && (
                <Link href="/admin/users" className="text-gray-300 hover:text-blue-400 transition-colors">
                  User Management
                </Link>
              )}
              <div className="w-px h-6 bg-gray-700"></div>
              <span className="text-gray-400">
                Welcome, {session.user?.name || 'User'}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
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
