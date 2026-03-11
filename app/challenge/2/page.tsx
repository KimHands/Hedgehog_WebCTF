"use client";

import { useState, useEffect } from "react";
import ChallengeLayout from "@/components/ChallengeLayout";

// ── 일반 모드 ──────────────────────────────────────────────
const NORMAL_HINTS = [
  "웹사이트는 쿠키 외에도 'localStorage'라는 브라우저 저장소를 사용합니다. 이 값은 클라이언트에서 직접 수정할 수 있어요.",
  "F12 → Application (또는 저장소) 탭 → Local Storage를 열어보세요. 이 사이트와 관련된 키-값 쌍이 보이나요?",
  "isAdmin 값을 false에서 true로 직접 수정하세요! 더블클릭하면 값을 편집할 수 있습니다. 그 다음 버튼을 다시 눌러보세요.",
];
const NORMAL_FLAG = "FLAG{l0c4l_st0r4g3_1snt_s3cr3t}";

// ── 타임어택 모드 ──────────────────────────────────────────
const SPEEDRUN_HINTS = [
  "Network 탭에서 버튼 클릭 시 발생하는 API 요청을 분석해보세요. 요청 헤더 중 빠진 것이 있지 않을까요?",
  "Console에서 fetch('/api/speedrun/challenge2/flag', {headers: {'X-Admin-Secret': '???'}}) 형태로 올바른 값을 찾아보세요. 동아리 이름이 힌트입니다.",
];
const SPEEDRUN_FLAG = "FLAG{cust0m_h34d3rs_byp4ss_4ccess}";

// ── 일반 모드 컴포넌트 ─────────────────────────────────────
function NormalAdminPanel() {
  const [result, setResult] = useState<{ success: boolean; message: string; flag?: string } | null>(null);

  useEffect(() => {
    localStorage.setItem("isAdmin", "false");
    localStorage.setItem("username", "guest");
  }, []);

  function checkAccess() {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (isAdmin) {
      setResult({ success: true, flag: NORMAL_FLAG, message: "관리자 인증 완료" });
    } else {
      setResult({ success: false, message: "권한이 없습니다. isAdmin 값을 확인하세요." });
    }
  }

  return (
    <div className="flex items-center justify-center h-full min-h-[400px] p-8">
      <div className="w-full max-w-md space-y-6 font-mono">
        <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="border-b border-gray-300 dark:border-gray-700 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-gray-500 text-xs">dashboard.internal</span>
          </div>
          <div className="p-6 space-y-4">
            <div className="text-center">
              <div className="text-2xl mb-2">🗂️</div>
              <h2 className="text-gray-800 dark:text-gray-200 text-lg font-bold">내부 관리 대시보드</h2>
            </div>
            <div className="border border-gray-300 dark:border-gray-700 p-3 bg-gray-50 dark:bg-black">
              <div className="text-xs text-gray-500 mb-1">세션 정보 (localStorage)</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-yellow-600 dark:text-yellow-400 text-sm">
                  username: guest
                </span>
              </div>
              <div className="text-gray-400 dark:text-gray-600 text-xs mt-1">
                isAdmin: false (권한 부족)
              </div>
            </div>
            <button
              onClick={checkAccess}
              className="w-full py-3 border border-cyan-500 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500 hover:text-white dark:hover:text-black transition-all duration-200 text-sm"
            >
              관리자 전용 플래그 확인
            </button>
            {result && (
              <div className={`p-3 border text-sm ${result.success ? "border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400" : "border-red-500/50 bg-red-500/10 text-red-500"}`}>
                {result.success ? (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">[SUCCESS] {result.message}</div>
                    <div className="font-bold">{result.flag}</div>
                  </div>
                ) : (
                  <span>[ERROR] {result.message}</span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="text-gray-400 dark:text-gray-600 text-xs space-y-1">
          <div>{">"} localStorage에 isAdmin=false 가 설정되었습니다.</div>
          <div>{">"} 관리자 권한이 있어야 플래그를 볼 수 있습니다...</div>
          <div className="animate-pulse">{">"} _</div>
        </div>
      </div>
    </div>
  );
}

// ── 타임어택 모드 컴포넌트 ─────────────────────────────────
function SpeedrunHeaderPanel() {
  const [result, setResult] = useState<{ success: boolean; flag?: string; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function requestFlag() {
    setLoading(true);
    setResult(null);
    try {
      // 헤더 없이 요청 (실패)
      const res = await fetch("/api/speedrun/challenge2/flag");
      const data = await res.json();
      if (res.ok) {
        setResult({ success: true, flag: data.flag });
      } else {
        setResult({ success: false, error: data.error });
      }
    } catch {
      setResult({ success: false, error: "네트워크 오류" });
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
            <span className="ml-2 text-gray-500 text-xs">api-gateway.internal/flag</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="text-center">
              <div className="text-2xl mb-2">🔑</div>
              <h2 className="text-gray-800 dark:text-gray-200 text-base font-bold">
                API 접근 제어 우회
              </h2>
              <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">
                올바른 헤더를 포함해야만 응답합니다
              </p>
            </div>
            <button
              onClick={requestFlag}
              disabled={loading}
              className="w-full py-2 border border-cyan-500 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500 hover:text-white dark:hover:text-black transition-all text-sm disabled:opacity-50"
            >
              {loading ? "요청 중..." : "GET /api/speedrun/challenge2/flag"}
            </button>
            {result && (
              <div className={`p-3 border text-xs ${result.success ? "border-green-500/50 bg-green-500/10 text-green-500" : "border-red-500/50 bg-red-500/10 text-red-500"}`}>
                {result.success ? (
                  <div>
                    <div className="text-gray-500 mb-1">HTTP 200 OK</div>
                    <div className="font-bold">{result.flag}</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-gray-500 mb-1">HTTP 403 Forbidden</div>
                    <div>{result.error}</div>
                  </div>
                )}
              </div>
            )}
            <div className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 p-3 text-xs">
              <div className="text-gray-500 mb-2">서버 응답 로직 (의사 코드):</div>
              <div className="text-purple-600 dark:text-purple-400">if</div>
              <div className="pl-3 text-gray-600 dark:text-gray-400">
                req.headers[<span className="text-green-600 dark:text-green-400">&apos;x-admin-secret&apos;</span>]
              </div>
              <div className="pl-3 text-gray-600 dark:text-gray-400">
                === <span className="text-yellow-600 dark:text-yellow-400">&apos;???&apos;</span>
              </div>
              <div className="text-purple-600 dark:text-purple-400">then</div>
              <div className="pl-3 text-gray-600 dark:text-gray-400">return flag</div>
            </div>
          </div>
        </div>
        <div className="text-gray-400 dark:text-gray-600 text-xs space-y-1">
          <div>{">"} Network 탭에서 요청을 분석하거나</div>
          <div>{">"} Console에서 직접 fetch()를 실행해보세요</div>
          <div className="animate-pulse">{">"} _</div>
        </div>
      </div>
    </div>
  );
}

export default function Challenge2() {
  const [isSpeedrun, setIsSpeedrun] = useState(false);

  useEffect(() => {
    setIsSpeedrun(localStorage.getItem("ctf_mode") === "speedrun");
  }, []);

  const hints = isSpeedrun ? SPEEDRUN_HINTS : NORMAL_HINTS;
  const flag = isSpeedrun ? SPEEDRUN_FLAG : NORMAL_FLAG;

  return (
    <ChallengeLayout
      challengeId={2}
      title={isSpeedrun ? "헤더를 보내라" : "브라우저의 기억"}
      category={isSpeedrun ? "HTTP Headers" : "Client Storage"}
      difficulty={isSpeedrun ? 2 : 2}
      objective={
        isSpeedrun
          ? "HTTP 요청 헤더에 커스텀 값을 추가해 API 접근 제어를 우회합니다. 서버가 헤더 기반 인증을 사용할 때, 올바른 헤더 값을 추측하거나 분석해야 합니다."
          : "브라우저 localStorage가 무엇인지, 그리고 클라이언트 측 저장 값만으로 권한을 판단하면 왜 위험한지 배웁니다."
      }
      scenario={
        isSpeedrun
          ? "내부 API 서버가 특정 비밀 헤더를 가진 요청만 허용합니다. Network 탭을 분석하고 Console로 직접 요청을 재구성해야 합니다."
          : "이 사이트는 localStorage에 저장된 isAdmin 값으로 관리자를 판단합니다. 하지만 localStorage는 누구나 수정할 수 있습니다."
      }
      hints={hints}
      correctFlag={flag}
      isSpeedrun={isSpeedrun}
      nextChallengeId={isSpeedrun ? 3 : undefined}
    >
      {isSpeedrun ? <SpeedrunHeaderPanel /> : <NormalAdminPanel />}
    </ChallengeLayout>
  );
}
