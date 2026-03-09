import ChallengeLayout from "@/components/ChallengeLayout";

const HINTS = [
  "화면에 보이는 요소들도 많은 정보를 숨기고 있을 수 있어요. 눈에 보이는 것 너머를 봐야 한답니다.",
  "F12를 눌러 개발자 도구를 열고 'Elements' 탭을 확인해보세요. 또는 화면의 '-' 부분에 마우스 우클릭 → '검사(Inspect)'를 해보세요.",
  "'-' 요소를 Elements 패널에서 클릭하면 HTML 속성 목록이 나타납니다. 'data-' 로 시작하는 속성에 무언가 숨겨져 있지 않을까요?",
];

export default function Challenge1() {
  return (
    <ChallengeLayout
      challengeId={1}
      title="눈에 보이지 않는 것들"
      category="View Source"
      difficulty={1}
      objective="개발자 도구의 Elements 탭으로 HTML 요소를 검사하는 방법을 배웁니다. 화면에 표시되지 않는 HTML 속성(data-*)을 통해 숨겨진 정보를 발견할 수 있습니다."
      scenario="어느 웹사이트 관리자가 실수로 비밀 정보를 HTML 요소 속성에 남겨놓았습니다. 화면만 봐서는 아무것도 없어 보이지만..."
      hints={HINTS}
      correctFlag="FLAG{y0u_f0und_th3_s3cr3t}"
    >
      {/* 취약한 서비스 UI: 잠긴 금고 화면 */}
      <div className="flex items-center justify-center h-full min-h-[400px] p-8">
        <div className="text-center space-y-6 max-w-sm">
          <div className="border-2 border-gray-700 p-8 bg-gray-900">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-gray-200 text-xl font-bold font-mono mb-2">
              암호동아리 Hedgehog 비밀 금고
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
            {/* FLAG가 data-flag 속성에 숨겨진 구분선 */}
            <div
              className="mt-4 text-gray-700 text-xs font-mono cursor-default select-none"
              data-flag="FLAG{y0u_f0und_th3_s3cr3t}"
            >
              -
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
