"use client";

import { useState } from "react";
import ChallengeLayout from "@/components/ChallengeLayout";

const HINTS = [
  "아래 SQL 쿼리 미리보기를 보세요! 비밀번호 칸에 입력하는 내용이 쿼리 안에 그대로 들어가고 있어요.",
  "비밀번호 칸에 작은따옴표(') 하나만 입력해보세요. 쿼리의 따옴표 구조가 어떻게 바뀌나요?",
  "따옴표로 비밀번호 조건을 닫은 뒤, 항상 참인 조건을 덧붙이면 어떨까요? ' OR '1'='1 을 입력해보세요!",
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
        <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="border-b border-gray-300 dark:border-gray-700 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-gray-500 text-xs">login.php</span>
          </div>

          <div className="p-6 space-y-4">
            <div className="text-center">
              <div className="text-2xl mb-2">🗄️</div>
              <h2 className="text-gray-800 dark:text-gray-200 text-base font-bold">
                관리자 로그인
              </h2>
              <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">
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
                  className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-cyan-500"
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
                  className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-cyan-500 placeholder:text-gray-400 dark:placeholder:text-gray-700"
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-2 border border-cyan-500 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500 hover:text-white dark:hover:text-black transition-all duration-200 text-sm disabled:opacity-50"
              >
                {loading ? "로그인 중..." : "로그인"}
              </button>
            </div>

            {result && (
              <div
                className={`p-3 border text-sm ${
                  result.success
                    ? "border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400"
                    : "border-red-500/50 bg-red-500/10 text-red-500 dark:text-red-400"
                }`}
              >
                {result.success ? (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
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

        <div className="text-xs space-y-1 font-mono">
          <div className="text-gray-500 mb-1">[ 실행 중인 SQL 쿼리 미리보기 ]</div>
          <div className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-3 leading-relaxed">
            <span className="text-purple-600 dark:text-purple-400">SELECT</span>
            <span className="text-gray-700 dark:text-gray-300"> * </span>
            <span className="text-purple-600 dark:text-purple-400">FROM</span>
            <span className="text-gray-700 dark:text-gray-300"> users </span>
            <span className="text-purple-600 dark:text-purple-400">WHERE</span>
            <br />
            <span className="pl-4 text-gray-700 dark:text-gray-300">
              username=<span className="text-green-600 dark:text-green-400">&apos;admin&apos;</span>
              <span className="text-gray-700 dark:text-gray-300"> AND </span>
              password=<span className="text-yellow-600 dark:text-yellow-400">&apos;</span>
              <span className="text-yellow-700 dark:text-yellow-300">{password}</span>
              <span className="text-yellow-600 dark:text-yellow-400">&apos;</span>
            </span>
          </div>
          <div className="animate-pulse text-gray-400 dark:text-gray-600">{">"} _</div>
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
