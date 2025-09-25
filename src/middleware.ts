import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // OPTIONS 요청 (Preflight) 처리
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 200 });

    // 모든 오리진 허용
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "*"
    );
    response.headers.set("Access-Control-Max-Age", "86400");

    return response;
  }

  const response = NextResponse.next();

  // 모든 요청에 대해 CORS 헤더 설정
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "*"
  );

  return response;
}

export const config = {
  matcher: "/:path*",
};
