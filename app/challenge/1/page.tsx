import ChallengeLayout from "@/components/ChallengeLayout";

const HINTS = [
  "화면에 보이는 것이 전부가 아닐 수 있어요. 웹페이지에는 숨겨진 코드가 있답니다.",
  "브라우저에서 F12 키를 눌러보거나, 마우스 우클릭 → '페이지 소스 보기'를 해보세요.",
  "소스 코드에서 <!-- 와 --> 사이에 있는 내용을 찾아보세요. 이것을 HTML 주석이라고 합니다.",
];

export default function Challenge1() {
  return (
    <ChallengeLayout
      challengeId={1}
      title="눈에 보이지 않는 것들"
      category="View Source"
      difficulty={1}
      objective="웹페이지의 HTML 소스 코드를 보는 방법을 배웁니다. 개발자 도구(F12)나 '페이지 소스 보기'를 통해 화면에 표시되지 않는 HTML 주석을 찾을 수 있습니다."
      scenario="어느 웹사이트 관리자가 실수로 비밀 정보를 HTML에 남겨놓았습니다. 화면만 봐서는 아무것도 없어 보이지만..."
      hints={HINTS}
      correctFlag="FLAG{y0u_f0und_th3_s3cr3t}"
    >
      {/* 실제 HTML 주석으로 렌더링되도록 dangerouslySetInnerHTML 사용 */}
      <div
        dangerouslySetInnerHTML={{
          __html:
            "<!-- 개발자 메모: 플래그는 FLAG{y0u_f0und_th3_s3cr3t} 입니다. 배포 전 삭제할 것! -->",
        }}
      />

      {/* 취약한 서비스 UI: 잠긴 금고 화면 */}
      <div className="flex items-center justify-center h-full min-h-[400px] p-8">
        <div className="text-center space-y-6 max-w-sm">
          <div className="border-2 border-gray-700 p-8 bg-gray-900">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-gray-200 text-xl font-bold font-mono mb-2">
              SCH 정보보호연구실 비밀 금고
            </h2>
            <p className="text-gray-500 text-sm font-mono">
              이 금고에는 중요한 비밀이 숨겨져 있습니다.
            </p>
            <div className="mt-6 border border-gray-700 p-3">
              <div className="text-gray-600 text-xs font-mono">
                VAULT STATUS: LOCKED
              </div>
              <div className="flex justify-center gap-1 mt-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full bg-gray-700"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="text-gray-600 text-xs font-mono text-left space-y-1">
            <div>{">"} 화면에는 아무것도 없어 보이지만...</div>
            <div>{">"} 정말 아무것도 없을까요?</div>
            <div className="animate-pulse">{">"} _</div>
          </div>
        </div>
      </div>
    </ChallengeLayout>
  );
}
