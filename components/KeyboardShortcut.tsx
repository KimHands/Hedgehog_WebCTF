"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CTF_KEYS = [
  "ctf_mode",
  "ctf_speedrun_start",
  "ctf_speedrun_result",
  "challenge_1_solved",
  "challenge_2_solved",
  "challenge_3_solved",
];

function isMac() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
}

export default function KeyboardShortcut() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Alt+H (Windows/Linux) / Option+H (Mac): 세션 초기화 후 로비로
      if (e.altKey && (e.key === "h" || e.key === "H")) {
        e.preventDefault();
        CTF_KEYS.forEach((key) => localStorage.removeItem(key));
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          router.push("/");
        }, 600);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  if (!showToast) return null;

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white font-mono text-sm px-4 py-2 animate-fadeIn">
      {">> 세션 초기화 — 로비로 이동 중..."}
    </div>
  );
}

export function shortcutLabel() {
  return isMac() ? "⌥+H" : "Alt+H";
}
