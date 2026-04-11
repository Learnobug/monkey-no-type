"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Nav() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  return (
    <nav className="w-full flex justify-between items-center px-8 py-4 text-[#646669]">
      <Link href="/" className="text-[#e2b714] font-bold text-xl tracking-tight">
        monkey-no-type
      </Link>
      <div className="flex items-center gap-6 text-sm">
        {session ? (
          <>
            <Link href="/result/history" className="hover:text-white transition-colors">
              history
            </Link>
            <span className="text-[#5d5f62]">{session.user?.name ?? session.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="hover:text-white transition-colors"
            >
              sign out
            </button>
          </>
        ) : (
          <Link href="/auth/signin" className="hover:text-white transition-colors">
            sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
