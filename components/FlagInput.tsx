"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FlagInputProps {
  correctFlag: string;
  challengeId: number;
  isSpeedrun?: boolean;
  nextChallengeId?: number;
  onSuccess?: () => void;
}

export default function FlagInput({
  correctFlag,
  challengeId,
  isSpeedrun,
  nextChallengeId,
  onSuccess,
}: FlagInputProps) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const router = useRouter();

  function handleSubmit() {
    if (value.trim() === correctFlag) {
      localStorage.setItem(`challenge_${challengeId}_solved`, "true");
      setStatus("success");
      onSuccess?.();

      if (isSpeedrun) {
        if (nextChallengeId) {
          setTimeout(() => router.push(`/challenge/${nextChallengeId}`), 1200);
        } else {
          // 마지막 챌린지 완료 → 완료 시간 저장 후 로비로
          const startTime = localStorage.getItem("ctf_speedrun_start");
          if (startTime) {
            const elapsed = Date.now() - parseInt(startTime);
            localStorage.setItem("ctf_speedrun_result", elapsed.toString());
          }
          setTimeout(() => router.push("/"), 1500);
        }
      }
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 1500);
    }
  }

  if (status === "success") {
    return (
      <div className="space-y-4">
        <div className="p-4 border border-green-500 bg-green-500/10 text-center animate-pulse">
          <div className="text-green-500 dark:text-green-400 font-mono text-lg font-bold">
            [SUCCESS] FLAG ACCEPTED
          </div>
          <div className="text-green-600 dark:text-green-300 font-mono text-sm mt-1">
            {isSpeedrun
              ? nextChallengeId
                ? "다음 레벨로 이동 중..."
                : "모든 챌린지 완료! 로비로 이동 중..."
              : "문제를 해결했습니다!"}
          </div>
        </div>
        {!isSpeedrun && (
          <button
            onClick={() => router.push("/")}
            className="w-full py-2 font-mono text-sm border border-green-500 text-green-500 dark:text-green-400 hover:bg-green-500 hover:text-white dark:hover:text-black transition-all duration-200"
          >
            {"<< 메인으로 돌아가기"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className={`flex gap-2 transition-all duration-150 ${
          status === "error" ? "animate-shake" : ""
        }`}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="FLAG{...}"
          className="flex-1 bg-white dark:bg-black border border-gray-300 dark:border-gray-600 px-3 py-2 font-mono text-sm text-green-600 dark:text-green-400 focus:outline-none focus:border-green-500 placeholder:text-gray-400 dark:placeholder:text-gray-600"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 font-mono text-sm border border-green-500 text-green-500 dark:text-green-400 hover:bg-green-500 hover:text-white dark:hover:text-black transition-all duration-200"
        >
          SUBMIT
        </button>
      </div>

      {status === "error" && (
        <div className="text-red-500 dark:text-red-400 font-mono text-xs">
          [ERROR] 틀렸습니다. 다시 시도해보세요.
        </div>
      )}
    </div>
  );
}
