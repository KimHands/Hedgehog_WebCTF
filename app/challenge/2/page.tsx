"use client";

import { useState, useEffect } from "react";
import ChallengeLayout from "@/components/ChallengeLayout";

const HINTS = [
  "웹사이트는 '쿠키'라는 것으로 여러분의 상태를 기억합니다. 쿠키는 브라우저에 저장된 작은 데이터예요.",
  "F12 → Application(또는 저장소) → Cookies 탭을 열어 현재 저장된 쿠키를 확인해보세요.",
  "role 쿠키의 값을 guest에서 admin으로 직접 수정한 다음, 버튼을 다시 눌러보세요!",
];

function AdminPanel() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    document.cookie = "role=guest; path=/";
  }, []);

  async function fetchFlag() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/challenge2/flag", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.flag);
        setIsError(false);
      } else {
        setResult(data.error);
        setIsError(true);
      }
    } catch {
      setResult("네트워크 오류가 발생했습니다.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-full min-h-[400px] p-8">
      <div className="w-full max-w-md space-y-6 font-mono">
        <div className="border border-gray-700 bg-gray-900">
          {/* Title bar */}
          <div className="border-b border-gray-700 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-gray-500 text-xs">
              secret-admin-system.local
            </span>
          </div>

          <div className="p-6 space-y-4">
            <div className="text-center">
              <div className="text-2xl mb-2">🔐</div>
              <h2 className="text-gray-200 text-lg font-bold">
                비밀 관리자 시스템
              </h2>
            </div>

            <div className="border border-gray-700 p-3 bg-black">
              <div className="text-xs text-gray-500 mb-1">현재 세션</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-yellow-400 text-sm">
                  로그인: guest 사용자
                </span>
              </div>
              <div className="text-gray-600 text-xs mt-1">
                role=guest (권한 레벨: 0)
              </div>
            </div>

            <button
              onClick={fetchFlag}
              disabled={loading}
              className="w-full py-3 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all duration-200 text-sm disabled:opacity-50"
            >
              {loading ? "확인 중..." : "관리자 전용 플래그 보기"}
            </button>

            {result && (
              <div
                className={`p-3 border text-sm ${
                  isError
                    ? "border-red-500/50 bg-red-500/10 text-red-400"
                    : "border-green-500/50 bg-green-500/10 text-green-400"
                }`}
              >
                {isError ? (
                  <span>[ERROR] {result}</span>
                ) : (
                  <div>
                    <div className="text-xs text-gray-400 mb-1">
                      [SUCCESS] 관리자 인증 완료
                    </div>
                    <div className="font-bold">{result}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="text-gray-600 text-xs space-y-1">
          <div>{">"} 쿠키에 role=guest 가 설정되었습니다.</div>
          <div>{">"} 관리자 권한이 필요합니다...</div>
          <div className="animate-pulse">{">"} _</div>
        </div>
      </div>
    </div>
  );
}

export default function Challenge2() {
  return (
    <ChallengeLayout
      challengeId={2}
      title="쿠키는 달콤하다"
      category="Cookie Manipulation"
      difficulty={2}
      objective="브라우저 쿠키(Cookie)가 무엇인지, 그리고 쿠키 값을 조작하면 어떤 일이 생기는지 배웁니다. 서버가 쿠키만으로 권한을 판단하면 보안 취약점이 생깁니다."
      scenario="이 사이트는 쿠키로 관리자 여부를 판단합니다. 일반 유저로 로그인된 상태인데... 관리자 페이지에 접근할 수 있을까요?"
      hints={HINTS}
      correctFlag="FLAG{c00k13s_4r3_t4sty_but_d4ng3r0us}"
    >
      <AdminPanel />
    </ChallengeLayout>
  );
}
