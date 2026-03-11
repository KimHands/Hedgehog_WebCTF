"use client";

import { useEffect, useState } from "react";
import ChallengeLayout from "@/components/ChallengeLayout";

// ── 일반 모드 ──────────────────────────────────────────────
const NORMAL_HINTS = [
  "브라우저는 서버로부터 받은 HTML 코드를 그대로 갖고 있어요. '렌더링된 화면'과 '원본 코드'는 다를 수 있답니다.",
  "마우스 우클릭 → '페이지 소스 보기'를 클릭해보세요. 또는 Windows/Linux는 Ctrl+U, Mac은 Cmd+Option+U를 눌러보세요.",
  "소스 코드에서 <!-- 로 시작하는 줄을 찾아보세요. HTML 주석은 화면에 표시되지 않지만, 소스에는 고스란히 남아있답니다!",
];
const NORMAL_FLAG = "FLAG{html_c0mm3nts_4r3_v1s1bl3}";

// ── 타임어택 모드 ──────────────────────────────────────────
// window._s 에 Base64 인코딩된 flag를 숨겨둠
// atob(window._s) → flag
const SPEEDRUN_HINTS = [
  "페이지에 실행되는 JavaScript 코드를 분석해보세요. Console 탭에서 전역 변수를 확인할 수 있습니다.",
  "개발자 도구 Console에서 atob() 함수를 사용해 Base64 인코딩을 디코딩해보세요. window._s 가 힌트입니다.",
];
const SPEEDRUN_FLAG = "FLAG{b4s364_1s_n0t_3ncrypt10n}";
// btoa("FLAG{b4s364_1s_n0t_3ncrypt10n}") = "RkxBR3tiNHMzNjRfMXNfbjB0XzNuY3J5cHQxMG59"
const SPEEDRUN_ENCODED = "RkxBR3tiNHMzNjRfMXNfbjB0XzNuY3J5cHQxMG59";

function NormalContent() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px] p-8">
      <div className="text-center space-y-6 max-w-sm">
        <div className="border-2 border-gray-300 dark:border-gray-700 p-8 bg-white dark:bg-gray-900">
          <div className="text-6xl mb-4">📜</div>
          <h2 className="text-gray-800 dark:text-gray-200 text-xl font-bold font-mono mb-2">
            암호동아리 Hedgehog 비밀 문서
          </h2>
          <p className="text-gray-500 text-sm font-mono">
            이 페이지에는 공개된 내용만 있습니다.
          </p>
          <div className="mt-6 border border-gray-300 dark:border-gray-700 p-3">
            <div className="text-gray-400 dark:text-gray-600 text-xs font-mono">
              DOCUMENT STATUS: PUBLIC
            </div>
            <div className="text-green-500 text-xs font-mono mt-1">
              ✓ 검열 완료 — 비밀 없음
            </div>
          </div>
        </div>

        {/* 실제 HTML 주석으로 렌더링 — 소스 보기로 발견 가능 */}
        <div dangerouslySetInnerHTML={{ __html: '<!-- 개발자 메모: 플래그는 FLAG{html_c0mm3nts_4r3_v1s1bl3} 입니다. 배포 전 삭제할 것! -->' }} />

        <div className="text-gray-400 dark:text-gray-600 text-xs font-mono text-left space-y-1">
          <div>{">"} 화면에는 아무 비밀도 없어 보이지만...</div>
          <div>{">"} 정말 그럴까요?</div>
          <div className="animate-pulse">{">"} _</div>
        </div>
      </div>
    </div>
  );
}

function SpeedrunContent() {
  useEffect(() => {
    // 전역 변수에 Base64 인코딩된 값 노출
    (window as Window & { _s?: string })._s = SPEEDRUN_ENCODED;
    // Console 힌트 출력
    console.log("%c[DEBUG] 개발 테스트용 변수가 남아있습니다.", "color: #ef4444; font-weight: bold;");
    console.log("%c> window._s 에 민감한 값이 저장되어 있습니다.", "color: #f59e0b;");
  }, []);

  return (
    <div className="flex items-center justify-center h-full min-h-[400px] p-8">
      <div className="w-full max-w-md space-y-4 font-mono">
        <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="border-b border-gray-300 dark:border-gray-700 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-gray-500 text-xs">secret-vault.js (minified)</span>
          </div>
          <div className="p-5 space-y-3">
            <div className="text-2xl text-center mb-2">🔐</div>
            <h2 className="text-gray-800 dark:text-gray-200 text-base font-bold text-center">
              난독화된 비밀 금고
            </h2>
            <div className="bg-gray-100 dark:bg-black border border-gray-300 dark:border-gray-700 p-3 text-xs overflow-x-auto">
              <span className="text-purple-600 dark:text-purple-400">var </span>
              <span className="text-blue-600 dark:text-blue-300">_s</span>
              <span className="text-gray-600 dark:text-gray-400"> = </span>
              <span className="text-green-600 dark:text-green-400">&quot;RkxBR3...&quot;</span>
              <span className="text-gray-600 dark:text-gray-400">;</span>
              <br />
              <span className="text-purple-600 dark:text-purple-400">function </span>
              <span className="text-yellow-600 dark:text-yellow-400">_v</span>
              <span className="text-gray-600 dark:text-gray-400">(x)&#123;</span>
              <span className="text-purple-600 dark:text-purple-400">return </span>
              <span className="text-blue-600 dark:text-blue-300">atob</span>
              <span className="text-gray-600 dark:text-gray-400">(x)&#125;</span>
            </div>
            <div className="text-gray-400 dark:text-gray-600 text-xs">
              <div>{">"} 소스 코드가 난독화되어 있습니다</div>
              <div>{">"} 하지만 변수는 여전히 메모리에...</div>
              <div className="animate-pulse">{">"} _</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Challenge1() {
  const [isSpeedrun, setIsSpeedrun] = useState(false);

  useEffect(() => {
    setIsSpeedrun(localStorage.getItem("ctf_mode") === "speedrun");
  }, []);

  const hints = isSpeedrun ? SPEEDRUN_HINTS : NORMAL_HINTS;
  const flag = isSpeedrun ? SPEEDRUN_FLAG : NORMAL_FLAG;

  return (
    <ChallengeLayout
      challengeId={1}
      title={isSpeedrun ? "인코딩된 비밀" : "보이지 않는 잉크"}
      category={isSpeedrun ? "JS Obfuscation" : "View Source"}
      difficulty={isSpeedrun ? 2 : 1}
      objective={
        isSpeedrun
          ? "JavaScript 전역 변수에 숨겨진 Base64 인코딩 값을 찾고, atob() 함수로 디코딩합니다. 소스 코드 난독화가 보안을 보장하지 않는다는 것을 이해합니다."
          : "HTML 소스 보기를 통해 화면에 렌더링되지 않는 HTML 주석을 찾습니다. 개발자가 실수로 소스에 남긴 민감한 정보를 발견할 수 있습니다."
      }
      scenario={
        isSpeedrun
          ? "개발자가 배포 전 테스트용 변수 제거를 깜빡했습니다. 난독화된 것처럼 보이지만 런타임에서는 쉽게 읽을 수 있습니다."
          : "어느 웹사이트 관리자가 개발 중 작성한 주석을 제거하지 않고 배포했습니다. 화면은 깔끔해 보이지만 소스 코드에는..."
      }
      hints={hints}
      correctFlag={flag}
      isSpeedrun={isSpeedrun}
      nextChallengeId={isSpeedrun ? 2 : undefined}
    >
      {isSpeedrun ? <SpeedrunContent /> : <NormalContent />}
    </ChallengeLayout>
  );
}
