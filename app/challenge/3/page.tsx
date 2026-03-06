"use client";

import { useState } from "react";
import ChallengeLayout from "@/components/ChallengeLayout";

const HINTS = [
  "로그인 시스템은 내부적으로 데이터베이스에 이런 질문을 합니다: '비밀번호가 입력값인 사용자가 있나요?'",
  "만약 비밀번호 칸에 따옴표(')를 입력하면 어떻게 될까요? 시스템의 질문 구조가 깨질 수 있어요.",
  "비밀번호 입력창에 ' OR '1'='1 을 입력해보세요. 1=1은 항상 참이기 때문에 조건을 우회할 수 있어요!",
];

function LoginForm() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    flag?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/challenge3/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      setResult(data);
      if (!data.success) {
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      setResult({ success: false, message: "네트워크 오류가 발생했습니다." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-full min-h-[400px] p-8">
      <div className="w-full max-w-sm space-y-6 font-mono">
        <div className="border border-gray-700 bg-gray-900">
          <div className="border-b border-gray-700 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-gray-500 text-xs">login.php</span>
          </div>

          <div className="p-6 space-y-4">
            <div className="text-center">
              <div className="text-2xl mb-2">🗄️</div>
              <h2 className="text-gray-200 text-base font-bold">
                관리자 로그인
              </h2>
              <p className="text-gray-600 text-xs mt-1">
                내부 시스템 전용
              </p>
            </div>

            <div
              className={`space-y-3 transition-all ${
                shake ? "animate-shake" : ""
              }`}
            >
              <div>
                <label className="text-gray-500 text-xs block mb-1">
                  아이디
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black border border-gray-600 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs block mb-1">
                  비밀번호
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="비밀번호를 입력하세요..."
                  className="w-full bg-black border border-gray-600 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500 placeholder:text-gray-700"
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-2 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all duration-200 text-sm disabled:opacity-50"
              >
                {loading ? "로그인 중..." : "로그인"}
              </button>
            </div>

            {result && (
              <div
                className={`p-3 border text-sm ${
                  result.success
                    ? "border-green-500/50 bg-green-500/10 text-green-400"
                    : "border-red-500/50 bg-red-500/10 text-red-400"
                }`}
              >
                {result.success ? (
                  <div>
                    <div className="text-xs text-gray-400 mb-1">
                      [SUCCESS] {result.message}
                    </div>
                    {result.flag && (
                      <div className="font-bold mt-1">{result.flag}</div>
                    )}
                  </div>
                ) : (
                  <span>[ERROR] {result.message}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="text-gray-600 text-xs space-y-1">
          <div>{">"} SQL: SELECT * FROM users WHERE</div>
          <div className="pl-4">
            username=&apos;admin&apos; AND password=&apos;[입력값]&apos;
          </div>
          <div className="animate-pulse">{">"} _</div>
        </div>
      </div>
    </div>
  );
}

export default function Challenge3() {
  return (
    <ChallengeLayout
      challengeId={3}
      title="마법의 따옴표"
      category="SQL Injection"
      difficulty={3}
      objective="SQL Injection이 무엇인지 배웁니다. 사용자 입력이 데이터베이스 쿼리에 직접 삽입될 때, 특수 문자를 이용해 쿼리 구조를 변조할 수 있습니다."
      scenario="어떤 사이트의 로그인 창입니다. 올바른 비밀번호를 모르지만... 특별한 입력으로 시스템을 속일 수 있을까요?"
      hints={HINTS}
      correctFlag="FLAG{sql_1nj3ct10n_1s_p0w3rful}"
    >
      <LoginForm />
    </ChallengeLayout>
  );
}
