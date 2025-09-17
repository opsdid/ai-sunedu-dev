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
          <button
              onClick={() => signOut({ callbackUrl: 'https://ai.sunedu.id/' })}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Sign Out
            </button>
        </div>
      </div>
    </>
  );
}
