import { NextRequest, NextResponse } from "next/server";

// 타임어택 모드 Challenge 2: HTTP 커스텀 헤더 인증 우회
// X-Admin-Secret: hedgehog 헤더가 있어야 flag 반환
export async function GET(request: NextRequest) {
  const adminSecret = request.headers.get("x-admin-secret");

  if (adminSecret === "hedgehog") {
    return NextResponse.json({
      flag: "FLAG{cust0m_h34d3rs_byp4ss_4ccess}",
    });
  }

  return NextResponse.json(
    { error: "접근 거부: 유효한 X-Admin-Secret 헤더가 필요합니다." },
    { status: 403 }
  );
}
