"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthStatus() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="flex gap-5">
      <p className="self-end">
        Logged in as {session?.user?.email}.{" "}
        <a className="cursor-pointer text-blue" onClick={() => signOut()}>
          Sign out
        </a>
      </p>
    </div>
  );
}
