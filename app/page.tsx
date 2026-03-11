"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CHALLENGES, SPEEDRUN_CHALLENGES } from "@/lib/challenges";

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
      <span className="text-gray-200 dark:text-gray-700">{"★".repeat(3 - count)}</span>
    </span>
  );
}

function formatTime(ms: number) {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  const tenths = Math.floor((ms % 1000) / 100);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${tenths}`;
}

function useShortcutLabel() {
  const [label, setLabel] = useState("Alt+H");
  useEffect(() => {
    if (/Mac|iPhone|iPad|iPod/.test(navigator.platform)) setLabel("⌥+H");
  }, []);
  return label;
}

function ReviewInput({
  challengeId,
  challengeTitle,
  solved,
}: {
  challengeId: number;
  challengeTitle: string;
  solved: boolean;
}) {
  const key = `challenge_${challengeId}_review`;
  const [review, setReview] = useState("");
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setReview(localStorage.getItem(key) ?? "");
  }, [key]);

  function saveReview(value: string) {
    setReview(value);
    localStorage.setItem(key, value);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }

  return (
    <div
      className="border-t border-gray-200 dark:border-gray-800 px-4 py-3 bg-white dark:bg-gray-950"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-gray-400 dark:text-gray-600 text-xs mb-1.5">
        // 리뷰 메모 {solved ? "(풀이 완료)" : "(미해결)"}
      </div>
      <div className="flex gap-2 items-center">
        <input
          ref={inputRef}
          type="text"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          onBlur={(e) => saveReview(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              saveReview(review);
              inputRef.current?.blur();
            }
          }}
          placeholder="한 줄 메모 입력 후 Enter..."
          className="flex-1 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 px-2 py-1 text-xs text-gray-700 dark:text-gray-300 font-mono focus:outline-none focus:border-green-500/60 placeholder:text-gray-300 dark:placeholder:text-gray-700"
        />
        {saved && (
          <span className="text-green-500 text-xs font-mono shrink-0">저장됨</span>
        )}
      </div>
    </div>
  );
}

export default function LobbyPage() {
  const [solvedMap, setSolvedMap] = useState<Record<number, boolean>>({});
  const [mode, setMode] = useState<"normal" | "speedrun">("normal");
  const [speedrunResult, setSpeedrunResult] = useState<number | null>(null);
  const router = useRouter();
  const title = useTypingEffect("암호동아리 Hedgehog — Web Hacking CTF");
  const shortcutLabel = useShortcutLabel();

  const challenges = mode === "speedrun" ? SPEEDRUN_CHALLENGES : CHALLENGES;

  useEffect(() => {
    const savedMode = (localStorage.getItem("ctf_mode") as "normal" | "speedrun") ?? "normal";
    setMode(savedMode);

    const result = localStorage.getItem("ctf_speedrun_result");
    if (result) {
      setSpeedrunResult(parseInt(result));
    }

    const map: Record<number, boolean> = {};
    CHALLENGES.forEach((c) => {
      map[c.id] = localStorage.getItem(`challenge_${c.id}_solved`) === "true";
    });
    setSolvedMap(map);
  }, []);

  function switchMode(newMode: "normal" | "speedrun") {
    setMode(newMode);
    localStorage.setItem("ctf_mode", newMode);
    if (newMode === "speedrun") {
      localStorage.setItem("ctf_speedrun_start", Date.now().toString());
      localStorage.removeItem("ctf_speedrun_result");
      setSpeedrunResult(null);
    }
  }

  function startSpeedrun() {
    switchMode("speedrun");
    router.push("/challenge/1");
  }

  function exportReviews() {
    const lines: string[] = [];
    lines.push("암호동아리 Hedgehog CTF — 문제 리뷰 기록");
    lines.push(`생성일: ${new Date().toLocaleString("ko-KR")}`);
    lines.push("=".repeat(48));
    lines.push("");

    CHALLENGES.forEach((c) => {
      const solved = solvedMap[c.id] ? "✅ 해결" : "⬜ 미해결";
      const review = localStorage.getItem(`challenge_${c.id}_review`) ?? "";
      lines.push(`[CHALLENGE_${c.id.toString().padStart(2, "0")}] ${c.title}`);
      lines.push(`카테고리: ${c.category} | 상태: ${solved}`);
      lines.push(`리뷰: ${review || "(작성 없음)"}`);
      lines.push("");
    });

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hedgehog-ctf-review-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const normalSolvedCount = Object.values(solvedMap).filter(Boolean).length;
  const allNormalSolved = normalSolvedCount === CHALLENGES.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-700 dark:text-gray-300 font-mono">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] z-0 opacity-30" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <div className="text-gray-400 dark:text-gray-600 text-xs mb-4 tracking-widest">
            {">"} INITIALIZING CTF PLATFORM...
          </div>
          <h1 className="text-green-500 dark:text-green-400 text-xl md:text-2xl font-bold tracking-tight min-h-[2rem]">
            {title}
            <span className="animate-pulse">_</span>
          </h1>

          {/* 모드 선택 */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => switchMode("normal")}
              className={`px-4 py-2 text-sm border transition-all duration-200 ${
                mode === "normal"
                  ? "border-green-500 bg-green-500 text-white dark:text-black"
                  : "border-gray-300 dark:border-gray-700 text-gray-500 hover:border-green-500/60"
              }`}
            >
              일반 모드
            </button>
            <button
              onClick={() => switchMode("speedrun")}
              className={`px-4 py-2 text-sm border transition-all duration-200 ${
                mode === "speedrun"
                  ? "border-yellow-500 bg-yellow-500 text-white dark:text-black"
                  : "border-gray-300 dark:border-gray-700 text-gray-500 hover:border-yellow-500/60"
              }`}
            >
              ⚡ 타임어택 (전공자)
            </button>
          </div>

          {mode === "normal" && (
            <div className="mt-4 inline-flex items-center gap-3 border border-gray-300 dark:border-gray-700 px-5 py-2">
              <span className="text-gray-500 text-sm">PROGRESS</span>
              <span className="text-green-500 dark:text-green-400 text-sm font-bold">
                {normalSolvedCount} / {CHALLENGES.length}
              </span>
              <span className="text-gray-500 text-sm">문제 해결</span>
              <div className="flex gap-1">
                {CHALLENGES.map((c) => (
                  <div
                    key={c.id}
                    className={`w-4 h-4 border ${
                      solvedMap[c.id]
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {mode === "speedrun" && (
            <div className="mt-4 space-y-2">
              <div className="inline-block border border-yellow-500/60 bg-yellow-500/5 px-5 py-3 text-center">
                <div className="text-yellow-500 text-xs mb-1">⚡ SPEEDRUN MODE</div>
                <div className="text-gray-500 text-xs">힌트 2단계 제한 · Flag 제출 시 자동 다음 레벨 이동</div>
              </div>
              {speedrunResult && (
                <div className="inline-block border border-green-500/60 bg-green-500/5 px-5 py-2">
                  <div className="text-green-500 text-sm font-bold">
                    최근 기록: {formatTime(speedrunResult)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {mode === "normal" && allNormalSolved && (
          <div className="mb-8 p-4 border border-green-500 bg-green-500/10 text-center">
            <div className="text-green-500 dark:text-green-400 font-bold text-lg">
              [SYSTEM] 축하합니다! 모든 문제를 해결했습니다!
            </div>
            <div className="text-green-600 dark:text-green-300 text-sm mt-1">
              당신은 진정한 해커입니다.
            </div>
          </div>
        )}

        {mode === "speedrun" && (
          <div className="mb-8 text-center">
            <button
              onClick={startSpeedrun}
              className="px-8 py-3 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white dark:hover:text-black transition-all duration-200 font-bold text-base"
            >
              ⚡ 타임어택 시작 (1번부터)
            </button>
            <div className="mt-2 text-gray-400 dark:text-gray-600 text-xs">
              시작하면 타이머가 초기화되고 1번 문제부터 시작합니다
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {challenges.map((challenge) => {
            const solved = mode === "normal" ? solvedMap[challenge.id] : false;
            const href = `/challenge/${challenge.id}`;
            return (
              <div key={challenge.id} className="flex flex-col">
                <Link href={href}>
                  <div
                    className={`relative border p-6 hover:-translate-y-1 transition-transform duration-200 cursor-pointer group ${
                      solved
                        ? "border-green-500/60 bg-green-500/5"
                        : mode === "speedrun"
                        ? "border-yellow-500/40 hover:border-yellow-500/80"
                        : "border-gray-300 dark:border-gray-700 hover:border-green-500/60"
                    }`}
                  >
                    {solved && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white dark:text-black text-xs font-bold px-2 py-0.5">
                        SOLVED
                      </div>
                    )}
                    {mode === "speedrun" && (
                      <div className="absolute top-3 right-3 border border-yellow-500/60 text-yellow-500 text-xs px-2 py-0.5">
                        SPEEDRUN
                      </div>
                    )}
                    <div className="text-gray-400 dark:text-gray-600 text-xs mb-3">
                      CHALLENGE_{challenge.id.toString().padStart(2, "0")}
                    </div>
                    <h2
                      className={`font-bold text-base mb-2 ${
                        solved
                          ? "text-green-500 dark:text-green-400"
                          : mode === "speedrun"
                          ? "text-yellow-500 dark:text-yellow-400"
                          : "text-gray-800 dark:text-gray-200 group-hover:text-green-500 dark:group-hover:text-green-400"
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
                    <div className="inline-block border border-cyan-500/40 text-cyan-600 dark:text-cyan-500 text-xs px-2 py-0.5">
                      {challenge.category}
                    </div>
                    <div className="mt-4 text-gray-400 dark:text-gray-600 text-xs group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors">
                      {">"} 문제 풀기
                    </div>
                  </div>
                </Link>
                {/* 리뷰 입력 영역 */}
                <ReviewInput
                  challengeId={challenge.id}
                  challengeTitle={challenge.title}
                  solved={solved}
                />
              </div>
            );
          })}
        </div>

        {/* 리뷰 내보내기 */}
        {mode === "normal" && (
          <div className="mt-8 text-center">
            <button
              onClick={exportReviews}
              className="px-5 py-2 text-xs border border-gray-300 dark:border-gray-700 text-gray-500 hover:border-green-500/60 hover:text-green-500 transition-all duration-200"
            >
              📄 리뷰 텍스트 파일로 저장
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-gray-300 dark:text-gray-700 text-xs space-y-1">
          <div>암호동아리 Hedgehog CTF PLATFORM</div>
          <div>비전공자를 위한 웹 보안 체험</div>
          <div className="text-gray-200 dark:text-gray-800">
            <span className="border border-gray-200 dark:border-gray-800 px-1">{shortcutLabel}</span>
            {" "}세션 초기화 후 로비로
          </div>
        </div>
      </div>
    </div>
  );
}
