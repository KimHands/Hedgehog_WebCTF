"use client";

import Link from "next/link";
import HintSystem from "./HintSystem";
import FlagInput from "./FlagInput";
import { useEffect, useState } from "react";

interface ChallengeLayoutProps {
  challengeId: number;
  title: string;
  category: string;
  difficulty: number;
  objective: string;
  scenario: string;
  hints: string[];
  correctFlag: string;
  isSpeedrun?: boolean;
  nextChallengeId?: number;
  children: React.ReactNode;
}

function Stars({ count }: { count: number }) {
  return (
    <span className="font-mono text-sm">
      {"★".repeat(count)}
      <span className="text-gray-200 dark:text-gray-600">{"★".repeat(3 - count)}</span>
    </span>
  );
}

function SpeedrunTimer({ startTime }: { startTime: number }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 100);
    return () => clearInterval(interval);
  }, [startTime]);

  const mins = Math.floor(elapsed / 60000);
  const secs = Math.floor((elapsed % 60000) / 1000);
  const tenths = Math.floor((elapsed % 1000) / 100);

  return (
    <div className="font-mono text-yellow-500 dark:text-yellow-400 text-sm font-bold tabular-nums">
      ⏱ {mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}.{tenths}
    </div>
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
  isSpeedrun,
  nextChallengeId,
  children,
}: ChallengeLayoutProps) {
  const [speedrunStart, setSpeedrunStart] = useState<number | null>(null);

  useEffect(() => {
    if (isSpeedrun) {
      const stored = localStorage.getItem("ctf_speedrun_start");
      if (stored) {
        setSpeedrunStart(parseInt(stored));
      }
    }
  }, [isSpeedrun]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-700 dark:text-gray-300 font-mono">
      {/* Top bar */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-green-500 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 text-sm transition-colors"
        >
          {"<< BACK TO LOBBY"}
        </Link>
        <div className="flex items-center gap-4">
          {isSpeedrun && speedrunStart && (
            <SpeedrunTimer startTime={speedrunStart} />
          )}
          {isSpeedrun && (
            <span className="text-xs border border-yellow-500 text-yellow-500 px-2 py-0.5">
              SPEEDRUN
            </span>
          )}
          <div className="text-gray-500 text-xs">
            CHALLENGE_{challengeId.toString().padStart(2, "0")} / {category}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-49px)]">
        {/* Left panel */}
        <div className="lg:w-[420px] border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <div className="text-xs text-gray-500 mb-1">
                [CHALLENGE_{challengeId.toString().padStart(2, "0")}]
              </div>
              <h1 className="text-green-500 dark:text-green-400 text-xl font-bold">{title}</h1>
              <div className="flex items-center gap-3 mt-1">
                <Stars count={difficulty} />
                <span className="text-xs text-cyan-600 dark:text-cyan-500 border border-cyan-500/40 px-2 py-0.5">
                  {category}
                </span>
              </div>
            </div>

            {/* Objective */}
            <div className="border border-cyan-500/30 bg-cyan-500/5 p-4">
              <div className="text-cyan-600 dark:text-cyan-400 text-xs mb-2">// 공격 목표</div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{objective}</p>
            </div>

            {/* Scenario */}
            <div className="border-l-2 border-green-500 pl-4">
              <div className="text-green-500 dark:text-green-400 text-xs mb-1">SCENARIO</div>
              <p className="text-gray-500 text-sm leading-relaxed italic">
                &ldquo;{scenario}&rdquo;
              </p>
            </div>

            {/* Hints */}
            <div>
              <div className="text-gray-500 text-xs mb-3">HINT SYSTEM</div>
              <HintSystem hints={hints} maxHints={isSpeedrun ? 2 : undefined} />
            </div>

            {/* Flag input */}
            <div>
              <div className="text-gray-500 text-xs mb-3">FLAG SUBMISSION</div>
              <FlagInput
                correctFlag={correctFlag}
                challengeId={challengeId}
                isSpeedrun={isSpeedrun}
                nextChallengeId={nextChallengeId}
              />
            </div>

            {/* Keyboard shortcut hint */}
            <div className="text-gray-400 dark:text-gray-600 text-xs border-t border-gray-200 dark:border-gray-800 pt-4">
              <span className="border border-gray-300 dark:border-gray-700 px-1">Alt+H</span>
              {" "} 로비로 돌아가기
            </div>
          </div>
        </div>

        {/* Right panel - vulnerable service */}
        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-950">{children}</div>
      </div>
    </div>
  );
}
