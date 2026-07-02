"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("hrConnectSession");
    if (!session) {
      router.replace("/");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        Checking session...
      </div>
    );
  }

  return <>{children}</>;
}