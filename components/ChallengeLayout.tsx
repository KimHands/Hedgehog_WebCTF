"use client";

import Link from "next/link";
import HintSystem from "./HintSystem";
import FlagInput from "./FlagInput";

interface ChallengeLayoutProps {
  challengeId: number;
  title: string;
  category: string;
  difficulty: number;
  objective: string;
  scenario: string;
  hints: string[];
  correctFlag: string;
  children: React.ReactNode;
}

function Stars({ count }: { count: number }) {
  return (
    <span className="font-mono text-sm">
      {"★".repeat(count)}
      <span className="text-gray-600">{"★".repeat(3 - count)}</span>
    </span>
  );
}

export default function ChallengeLayout({
  challengeId,
  title,
  category,
  difficulty,
  objective,
  scenario,
  hints,
  correctFlag,
  children,
}: ChallengeLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono">
      {/* Top bar */}
      <div className="border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-green-400 hover:text-green-300 text-sm transition-colors"
        >
          &lt;&lt; BACK TO LOBBY
        </Link>
        <div className="text-gray-500 text-xs">
          CHALLENGE_{challengeId.toString().padStart(2, "0")} / {category}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-49px)]">
        {/* Left panel */}
        <div className="lg:w-[420px] border-r border-gray-800 flex flex-col overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <div className="text-xs text-gray-500 mb-1">
                [CHALLENGE_{challengeId.toString().padStart(2, "0")}]
              </div>
              <h1 className="text-green-400 text-xl font-bold">{title}</h1>
              <div className="flex items-center gap-3 mt-1">
                <Stars count={difficulty} />
                <span className="text-xs text-cyan-500 border border-cyan-500/40 px-2 py-0.5">
                  {category}
                </span>
              </div>
            </div>

            {/* Objective */}
            <div className="border border-cyan-500/30 bg-cyan-500/5 p-4">
              <div className="text-cyan-400 text-xs mb-2">// 공격 목표</div>
              <p className="text-gray-300 text-sm leading-relaxed">{objective}</p>
            </div>

            {/* Scenario */}
            <div className="border-l-2 border-green-500 pl-4">
              <div className="text-green-400 text-xs mb-1">SCENARIO</div>
              <p className="text-gray-400 text-sm leading-relaxed italic">
                &ldquo;{scenario}&rdquo;
              </p>
            </div>

            {/* Hints */}
            <div>
              <div className="text-gray-500 text-xs mb-3">HINT SYSTEM</div>
              <HintSystem hints={hints} />
            </div>

            {/* Flag input */}
            <div>
              <div className="text-gray-500 text-xs mb-3">FLAG SUBMISSION</div>
              <FlagInput correctFlag={correctFlag} challengeId={challengeId} />
            </div>
          </div>
        </div>

        {/* Right panel - vulnerable service */}
        <div className="flex-1 overflow-auto bg-gray-950">{children}</div>
      </div>
    </div>
  );
}
