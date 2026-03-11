"use client";

import { useState, useEffect } from "react";
import ChallengeLayout from "@/components/ChallengeLayout";

// ── 일반 모드 ──────────────────────────────────────────────
const NORMAL_HINTS = [
  "브라우저 개발자 도구의 'Console' 탭은 JavaScript를 직접 실행할 수 있는 공간입니다. 웹 개발자들이 디버깅용 함수를 실수로 남겨두는 경우가 있어요.",
  "F12를 누르고 'Console' 탭으로 이동하세요. 페이지에 등록된 함수를 호출할 수 있습니다. 어떤 함수가 있는지 살펴볼까요?",
  "Console에 getFlag() 를 입력하고 Enter를 눌러보세요! 개발자가 테스트용으로 만들어둔 함수가 있답니다.",
];
const NORMAL_FLAG = "FLAG{c0ns0l3_1s_y0ur_fr13nd}";

// ── 타임어택 모드 ──────────────────────────────────────────
const SPEEDRUN_HINTS = [
  "SQL Injection의 UNION 기법을 사용하면 원래 쿼리 외에 다른 테이블을 조회할 수 있습니다. 컬럼 개수를 맞춰야 합니다.",
  "username 필드에 ' UNION SELECT flag, 1 FROM secrets-- 를 시도해보세요. 쿼리 구조를 잘 분석해보면 정답이 보입니다.",
];
const SPEEDRUN_FLAG = "FLAG{un10n_s3l3ct_pwn3d}";

// ── 일반 모드 컴포넌트 ─────────────────────────────────────
function NormalConsoleChallenge() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    // 디버깅 함수를 전역에 노출 (콘솔에서 호출 가능)
    (window as Window & { getFlag?: () => string; debug?: () => void })
      .getFlag = () => {
        setUnlocked(true);
        return NORMAL_FLAG;
      };
    (window as Window & { getFlag?: () => string; debug?: () => void })
      .debug = () => {
        console.log(
          "%c[DEBUG] getFlag() 함수를 호출하면 관리자 토큰을 얻을 수 있습니다.",
          "color: #f59e0b"
        );
        return "힌트: getFlag() 를 실행해보세요";
      };
    console.log(
      "%c[SYSTEM] 디버그 모드 활성화됨. debug() 로 정보 확인 가능.",
      "color: #6b7280; font-size: 11px;"
    );
  }, []);

  return (
    <div className="flex items-center justify-center h-full min-h-[400px] p-8">
      <div className="w-full max-w-md space-y-4 font-mono">
        <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="border-b border-gray-300 dark:border-gray-700 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-gray-500 text-xs">admin-portal.local</span>
          </div>
          <div className="p-6 space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-2">{unlocked ? "🔓" : "🔒"}</div>
              <h2 className="text-gray-800 dark:text-gray-200 text-lg font-bold">
                {unlocked ? "접근 허용됨" : "관리자 포털"}
              </h2>
              <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">
                {unlocked ? "개발자 도구로 잠금 해제 성공!" : "권한 있는 사용자만 접근 가능"}
              </p>
            </div>
            {unlocked ? (
              <div className="p-3 border border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400 text-sm text-center">
                <div className="font-bold">{NORMAL_FLAG}</div>
                <div className="text-xs mt-1 text-gray-500">Console 함수 호출 성공!</div>
              </div>
            ) : (
              <div className="p-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-black text-xs space-y-1">
                <div className="text-gray-500">시스템 로그:</div>
                <div className="text-gray-400 dark:text-gray-600">{">"} 인증 대기 중...</div>
                <div className="text-gray-400 dark:text-gray-600 animate-pulse">{">"} _</div>
              </div>
            )}
            <div className="bg-gray-100 dark:bg-black border border-dashed border-gray-300 dark:border-gray-700 p-3 text-xs text-gray-400 dark:text-gray-600">
              ⚠️ 개발자 주석: 출시 전에 debug 함수 제거할 것!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 타임어택 모드 컴포넌트 ─────────────────────────────────
function SpeedrunUnionForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("password");
  const [result, setResult] = useState<{ success: boolean; message: string; flag?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/speedrun/challenge3/login", {
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
      setResult({ success: false, message: "네트워크 오류" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-full min-h-[400px] p-8">
      <div className="w-full max-w-md space-y-4 font-mono">
        <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="border-b border-gray-300 dark:border-gray-700 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-gray-500 text-xs">search.php</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="text-center">
              <div className="text-2xl mb-2">🔎</div>
              <h2 className="text-gray-800 dark:text-gray-200 text-base font-bold">사용자 검색</h2>
              <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">내부 DB 검색 시스템</p>
            </div>
            <div className={`space-y-3 ${shake ? "animate-shake" : ""}`}>
              <div>
                <label className="text-gray-500 text-xs block mb-1">검색어 (username)</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="username을 입력..."
                  className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs block mb-1">password (고정)</label>
                <input
                  type="text"
                  value={password}
                  readOnly
                  className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-400 dark:text-gray-600"
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-2 border border-cyan-500 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500 hover:text-white dark:hover:text-black transition-all text-sm disabled:opacity-50"
              >
                {loading ? "검색 중..." : "검색"}
              </button>
            </div>
            {result && (
              <div className={`p-3 border text-sm ${result.success ? "border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400" : "border-red-500/50 bg-red-500/10 text-red-500"}`}>
                {result.success ? (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">[RESULT] {result.message}</div>
                    {result.flag && <div className="font-bold">{result.flag}</div>}
                  </div>
                ) : (
                  <span>[ERROR] {result.message}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="text-xs space-y-1">
          <div className="text-gray-500 mb-1">[ 실행 중인 SQL 쿼리 ]</div>
          <div className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-3 leading-relaxed">
            <span className="text-purple-600 dark:text-purple-400">SELECT</span>
            <span className="text-gray-700 dark:text-gray-300"> id, name </span>
            <span className="text-purple-600 dark:text-purple-400">FROM</span>
            <span className="text-gray-700 dark:text-gray-300"> users </span>
            <span className="text-purple-600 dark:text-purple-400">WHERE</span>
            <br />
            <span className="pl-4 text-gray-700 dark:text-gray-300">
              username=<span className="text-yellow-600 dark:text-yellow-400">&apos;</span>
              <span className="text-yellow-700 dark:text-yellow-300">{username}</span>
              <span className="text-yellow-600 dark:text-yellow-400">&apos;</span>
              <span className="text-gray-700 dark:text-gray-300"> AND password=</span>
              <span className="text-green-600 dark:text-green-400">&apos;password&apos;</span>
            </span>
          </div>
          <div className="text-gray-500 text-xs mt-1">
            DB 테이블: users(id, name, password), secrets(flag)
          </div>
          <div className="animate-pulse text-gray-400 dark:text-gray-600">{">"} _</div>
        </div>
      </div>
    </div>
  );
}

export default function Challenge3() {
  const [isSpeedrun, setIsSpeedrun] = useState(false);

  useEffect(() => {
    setIsSpeedrun(localStorage.getItem("ctf_mode") === "speedrun");
  }, []);

  const hints = isSpeedrun ? SPEEDRUN_HINTS : NORMAL_HINTS;
  const flag = isSpeedrun ? SPEEDRUN_FLAG : NORMAL_FLAG;

  return (
    <ChallengeLayout
      challengeId={3}
      title={isSpeedrun ? "UNION 탈출" : "개발자 도구의 마법"}
      category={isSpeedrun ? "Advanced SQLi" : "JS Console"}
      difficulty={isSpeedrun ? 3 : 3}
      objective={
        isSpeedrun
          ? "UNION 기반 SQL Injection으로 원래 쿼리에 없던 테이블(secrets)을 조회합니다. 컬럼 수를 맞추고 UNION SELECT로 플래그를 추출해야 합니다."
          : "브라우저 Console 탭에서 JavaScript 함수를 직접 실행합니다. 개발자가 제거하지 않은 디버그 함수를 찾아 호출하면 플래그를 얻을 수 있습니다."
      }
      scenario={
        isSpeedrun
          ? "사용자 검색 기능에 SQL Injection 취약점이 있습니다. users 테이블 외에 secrets 테이블에 플래그가 숨겨져 있고, UNION SELECT로만 접근 가능합니다."
          : "개발자가 테스트용 함수를 제거하지 않고 배포했습니다. 콘솔에서 해당 함수를 찾아 실행하면 관리자 권한을 얻을 수 있습니다."
      }
      hints={hints}
      correctFlag={flag}
      isSpeedrun={isSpeedrun}
      nextChallengeId={undefined}
    >
      {isSpeedrun ? <SpeedrunUnionForm /> : <NormalConsoleChallenge />}
    </ChallengeLayout>
  );
}
