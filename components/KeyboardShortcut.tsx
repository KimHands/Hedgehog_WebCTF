"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function KeyboardShortcut() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Alt+H: 로비로 이동 (브라우저/OS 단축키와 겹치지 않음)
      if (e.altKey && (e.key === "h" || e.key === "H")) {
        e.preventDefault();
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          router.push("/");
        }, 400);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  if (!showToast) return null;

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white dark:text-black font-mono text-sm px-4 py-2 animate-fadeIn">
      {">> 로비로 이동 중..."}
    </div>
  );
}
