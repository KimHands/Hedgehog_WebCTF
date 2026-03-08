"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CHALLENGES } from "@/lib/challenges";

function useTypingEffect(text: string, speed = 60) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return displayed;
}

function DifficultyStars({ count }: { count: number }) {
  return (
    <span>
      <span className="text-yellow-400">{"★".repeat(count)}</span>
      <span className="text-gray-700">{"★".repeat(3 - count)}</span>
    </span>
  );
}

export default function LobbyPage() {
  const [solvedMap, setSolvedMap] = useState<Record<number, boolean>>({});
  const title = useTypingEffect("암호동아리 Hedgehog — Web Hacking CTF");

  useEffect(() => {
    const map: Record<number, boolean> = {};
    CHALLENGES.forEach((c) => {
      map[c.id] = localStorage.getItem(`challenge_${c.id}_solved`) === "true";
    });
    setSolvedMap(map);
  }, []);

  const solvedCount = Object.values(solvedMap).filter(Boolean).length;
  const allSolved = solvedCount === CHALLENGES.length;

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] z-0 opacity-30" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <div className="text-gray-600 text-xs mb-4 tracking-widest">
            {">"} INITIALIZING CTF PLATFORM...
          </div>
          <h1 className="text-green-400 text-xl md:text-2xl font-bold tracking-tight min-h-[2rem]">
            {title}
            <span className="animate-pulse">_</span>
          </h1>
          <div className="mt-6 inline-flex items-center gap-3 border border-gray-700 px-5 py-2">
            <span className="text-gray-500 text-sm">PROGRESS</span>
            <span className="text-green-400 text-sm font-bold">
              {solvedCount} / {CHALLENGES.length}
            </span>
            <span className="text-gray-500 text-sm">문제 해결</span>
            <div className="flex gap-1">
              {CHALLENGES.map((c) => (
                <div
                  key={c.id}
                  className={`w-4 h-4 border ${
                    solvedMap[c.id]
                      ? "bg-green-500 border-green-500"
                      : "border-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {allSolved && (
          <div className="mb-8 p-4 border border-green-500 bg-green-500/10 text-center">
            <div className="text-green-400 font-bold text-lg">
              [SYSTEM] 축하합니다! 모든 문제를 해결했습니다!
            </div>
            <div className="text-green-300 text-sm mt-1">
              당신은 진정한 해커입니다.
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {CHALLENGES.map((challenge) => {
            const solved = solvedMap[challenge.id];
            return (
              <Link key={challenge.id} href={`/challenge/${challenge.id}`}>
                <div
                  className={`relative border p-6 hover:-translate-y-1 transition-transform duration-200 cursor-pointer group ${
                    solved
                      ? "border-green-500/60 bg-green-500/5"
                      : "border-gray-700 hover:border-green-500/60"
                  }`}
                >
                  {solved && (
                    <div className="absolute top-3 right-3 bg-green-500 text-black text-xs font-bold px-2 py-0.5">
                      SOLVED
                    </div>
                  )}
                  <div className="text-gray-600 text-xs mb-3">
                    CHALLENGE_{challenge.id.toString().padStart(2, "0")}
                  </div>
                  <h2
                    className={`font-bold text-base mb-2 ${
                      solved
                        ? "text-green-400"
                        : "text-gray-200 group-hover:text-green-400"
                    } transition-colors`}
                  >
                    {challenge.title}
                  </h2>
                  <div className="mb-3">
                    <DifficultyStars count={challenge.difficulty} />
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">
                    {challenge.description}
                  </p>
                  <div className="inline-block border border-cyan-500/40 text-cyan-500 text-xs px-2 py-0.5">
                    {challenge.category}
                  </div>
                  <div className="mt-4 text-gray-600 text-xs group-hover:text-green-400 transition-colors">
                    {">"} 문제 풀기
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center text-gray-700 text-xs">
          <div>암호동아리 Hedgehog CTF PLATFORM</div>
          <div className="mt-1">비전공자를 위한 웹 보안 체험</div>
        </div>
      </div>
    </div>
  );
}
