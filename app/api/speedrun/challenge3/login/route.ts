import { NextRequest, NextResponse } from "next/server";

// 타임어택 모드 Challenge 3: UNION-based SQL Injection
// 실제 DB 없이 교육용 로직으로 시뮬레이션
// 정상 쿼리: SELECT id, name FROM users WHERE username='?' AND password='password'
// UNION 공격: ' UNION SELECT flag, 1 FROM secrets--
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body as { username: string; password: string };

  if (!username) {
    return NextResponse.json(
      { success: false, message: "검색어를 입력해주세요." },
      { status: 400 }
    );
  }

  // UNION SELECT 기반 SQLi 감지
  // 허용 패턴: ' UNION SELECT flag, 1 FROM secrets-- (대소문자 무관)
  const normalized = username.toLowerCase().replace(/\s+/g, " ").trim();

  const isUnionAttack =
    normalized.includes("union") &&
    normalized.includes("select") &&
    normalized.includes("flag") &&
    (normalized.includes("secrets") || normalized.includes("secret")) &&
    (normalized.includes("--") || normalized.includes("#") || normalized.includes("/*"));

  if (isUnionAttack) {
    return NextResponse.json({
      success: true,
      message: "UNION SELECT 성공 — secrets 테이블 조회됨",
      flag: "FLAG{un10n_s3l3ct_pwn3d}",
    });
  }

  // 일반 검색 결과 (SQLi 아닌 경우)
  const validUsers = ["admin", "user1", "hedgehog"];
  if (validUsers.includes(username.toLowerCase()) && !username.includes("'")) {
    return NextResponse.json({
      success: true,
      message: `사용자 '${username}' 검색 완료`,
    });
  }

  return NextResponse.json(
    { success: false, message: "사용자를 찾을 수 없거나 쿼리 오류가 발생했습니다." },
    { status: 401 }
  );
}
