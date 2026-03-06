import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body as {
    username: string;
    password: string;
  };

  if (!username || !password) {
    return NextResponse.json(
      { success: false, message: "아이디와 비밀번호를 입력해주세요." },
      { status: 400 }
    );
  }

  // 의도적으로 취약한 로직 시뮬레이션 (SQL Injection 개념 교육용)
  const isSQLInjection =
    password.includes("' OR '1'='1") ||
    password.includes("' or '1'='1") ||
    password.includes("' OR 1=1--") ||
    password.includes("' or 1=1--");

  if (username === "admin" && isSQLInjection) {
    return NextResponse.json({
      success: true,
      flag: "FLAG{sql_1nj3ct10n_1s_p0w3rful}",
      message: "관리자로 로그인되었습니다!",
    });
  }

  return NextResponse.json(
    { success: false, message: "아이디 또는 비밀번호가 틀렸습니다." },
    { status: 401 }
  );
}
