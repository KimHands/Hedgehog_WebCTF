import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  // next/headers cookies() 또는 request 헤더에서 쿠키 읽기
  const cookieHeader = request.headers.get("cookie") ?? "";
  const roleCookie = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("role="));
  const role = roleCookie ? roleCookie.split("=")[1] : null;

  if (role === "admin") {
    return NextResponse.json({
      flag: "FLAG{c00k13s_4r3_t4sty_but_d4ng3r0us}",
    });
  }

  return NextResponse.json(
    { error: "권한이 없습니다. role 쿠키를 확인하세요." },
    { status: 401 }
  );
}
