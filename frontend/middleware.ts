import createMiddleware from "next-intl/middleware"
import { NextResponse } from "next/server";
import { SUPPORTED_LOCALES } from "@/locales";


export default createMiddleware({
  // A list of all locales that are supported
  locales: SUPPORTED_LOCALES,

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: "vi",
  localePrefix: "always", // Always add the locale prefix, e.g. `/en/about`
})

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}

export function middleware(request: Request) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  // Lấy locale từ URL
  const locale = pathname.split("/")[1]; // Lấy phần đầu tiên của URL (e.g., "en" hoặc "vi")

  // Kiểm tra nếu locale không hợp lệ
  if (!["en", "vi"].includes(locale)) {
    // Lấy từ cookie
    const cookie = request.cookies.get("NEXT_LOCALE");
    const defaultLocale = cookie ? cookie.value : "vi"; // Nếu không có cookie, sử dụng ngôn ngữ mặc định
    const url = request.nextUrl.clone();

    // Thêm ngôn ngữ mặc định vào URL
    url.pathname = `/${defaultLocale}/${pathname}`;

    return NextResponse.redirect(url); // Chuyển hướng đến URL với ngôn ngữ mặc định
  }

  // Ghi locale hợp lệ vào cookie
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/", // Đảm bảo cookie áp dụng cho toàn bộ ứng dụng
    }
  );

  return response;
}