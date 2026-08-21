import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { geolocation } from "@vercel/functions";
import { routing, type Locale } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const LOCALE_COOKIE = "NEXT_LOCALE";

function hasLocalePrefix(pathname: string) {
  return routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

function localeForCountry(country: string | undefined): Locale {
  // No geo data (e.g. local dev, or a host other than Vercel) falls back to
  // the site default rather than being treated as "definitely not Thailand".
  if (!country) return routing.defaultLocale;
  return country === "TH" ? "th" : "en";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // URL and cookie both take priority over geo-IP, and next-intl's own
  // middleware already handles both of those. Geo-IP only needs to run when
  // neither signal is present yet, e.g. a first-time visit to "/".
  if (!hasLocalePrefix(pathname) && !request.cookies.has(LOCALE_COOKIE)) {
    const { country } = geolocation(request);
    const locale = localeForCountry(country);

    if (locale !== routing.defaultLocale) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}${pathname}`;
      const response = NextResponse.redirect(url);
      response.cookies.set(LOCALE_COOKIE, locale);
      return response;
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
