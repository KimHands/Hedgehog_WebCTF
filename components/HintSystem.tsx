"use client";

import { useState } from "react";

interface HintSystemProps {
  hints: string[];
}

export default function HintSystem({ hints }: HintSystemProps) {
  const [revealed, setRevealed] = useState(0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 font-mono">
          HINTS [{revealed}/{hints.length}]
        </span>
        <button
          onClick={() => setRevealed((r) => Math.min(r + 1, hints.length))}
          disabled={revealed >= hints.length}
          className="px-3 py-1 text-xs font-mono border border-green-500 text-green-500 dark:text-green-400 hover:bg-green-500 hover:text-white dark:hover:text-black transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {revealed >= hints.length ? "// 모든 힌트 공개됨" : "힌트 보기 >>"}
        </button>
      </div>

      <div className="space-y-2">
        {hints.slice(0, revealed).map((hint, i) => (
          <div
            key={i}
            className="p-3 border border-yellow-500/40 bg-yellow-500/5 animate-fadeIn"
          >
            <span className="text-yellow-500 dark:text-yellow-400 font-mono text-xs">
              HINT_{i + 1}:{" "}
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-mono text-xs">{hint}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
