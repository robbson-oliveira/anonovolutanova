import { NextResponse, type NextRequest } from "next/server";
import {
  ATTRIBUTION_COOKIE,
  COOKIE_MAX_AGE,
  COUPON_COOKIE,
  attributionFromRequest,
  couponFromUrl,
} from "@/lib/attribution";
import { serverEnv } from "@/lib/env.server";
import {
  HOME_DEV_COOKIE,
  HOME_DEV_MAX_AGE,
  HOME_DEV_PATH,
  hasHomeDevSession,
  homeDevEnabled,
  homeDevLogin,
} from "@/lib/home-dev";
import { GONE_HTML, isGone } from "@/lib/legacy-urls";
import { publicEnv } from "@/lib/env";
import {
  RECOVERY_COOKIE,
  RECOVERY_COOKIE_MAX_AGE,
  isRecoveryToken,
  scrubRecoveryReferrer,
  urlWithoutRecoveryToken,
} from "@/lib/commerce/recover-cart";


/**
 * The store's feature switches, read on each request so that flipping one
 * takes a restart and not a rebuild (the pages behind them stay static):
 *
 * - homeComingSoon: `/` shows the "Em breve" page (a rewrite: the address
 *   stays `/`). It is off for the public launch, so `/em-breve` sends visitors
 *   to the home.
 * - ANLN_PRECHECKOUT: `/carrinho` is the pre-checkout page. Off, it goes to
 *   the offer on the home, as the old WordPress cart URL always did.
 *
 * `homeDev` is a visitor logged in at `/home-dev`: for them the home is the
 * landing page even with ANLN_HOME_COMMING_SOON on.
 *
 * Returns null when the request goes on to its own page.
 */
function switchRoute(request: NextRequest, homeDev: boolean): NextResponse | null {
  const { pathname, search } = request.nextUrl;
  // The query goes along: `?cupom=` and the UTMs still count on the next page.
  const to = (path: string, hash = "") => new URL(path + search + hash, request.url);

  if (pathname === HOME_DEV_PATH && homeDev) {
    return NextResponse.rewrite(to("/"));
  }
  if (pathname === "/" && serverEnv.homeComingSoon && !homeDev) {
    return NextResponse.rewrite(to("/em-breve"));
  }
  if (pathname === "/em-breve" && !serverEnv.homeComingSoon) {
    return NextResponse.redirect(to("/"));
  }
  if ((pathname === "/carrinho" || pathname === "/cart") && !serverEnv.precheckout) {
    return NextResponse.redirect(to("/", "#oferta"));
  }
  if (pathname === "/cart") {
    return NextResponse.redirect(to("/carrinho"), 308);
  }
  return null;
}

/**
 * Roda antes de toda página e guarda em cookie o que chega pela URL e precisa
 * sobreviver até o checkout:
 *
 * - `?cupom=CODIGO`: o link de cada afiliada. O carrinho aplica sozinho quando
 *   tiver itens (CartProvider), para a seguidora que chega pelo Stories não
 *   precisar lembrar e digitar o código.
 * - UTMs, cliques pagos e referência externa: a origem que vai no pedido.
 *
 * Cookies legíveis pelo navegador (não httpOnly): quem os lê é o checkout.
 * Não guardam dado pessoal — só o código do cupom e a origem da visita.
 */
/**
 * A recovery link arrives as `/carrinho?rc=<token>`. Redirecting here, before
 * the document, is what keeps the token out of the first page view: GTM,
 * the pixel and `history` only ever see the address without it. Clearing the
 * query after load would already have sent it.
 *
 * The cookie is set only while restore is enabled, only for a well-formed
 * token, and only on `/carrinho` (the page and `/carrinho/recuperar`). It is
 * httpOnly and lasts two minutes. Invalid tokens are still stripped, so a
 * bad link opens the cart normally.
 */
function recoveryRedirect(request: NextRequest): NextResponse | null {
  const clean = urlWithoutRecoveryToken(request.nextUrl);
  if (!clean) return null;
  const response = NextResponse.redirect(clean, 307);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Robots-Tag", "noindex");
  const token = request.nextUrl.searchParams.get("rc") ?? "";
  if (publicEnv.cartRecoveryEnabled && isRecoveryToken(token)) {
    response.cookies.set(RECOVERY_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: clean.protocol === "https:",
      path: "/carrinho",
      maxAge: RECOVERY_COOKIE_MAX_AGE,
    });
  }
  return response;
}

export function proxy(request: NextRequest) {
  const recovered = recoveryRedirect(request);
  if (recovered) return recovered;

  const url = request.nextUrl;

  // Conteúdo do WordPress antigo sem equivalente: 410 (ver legacy-urls.ts).
  if (isGone(url.pathname)) {
    return new NextResponse(GONE_HTML, {
      status: 410,
      headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
    });
  }

  // `/home-dev` without a session asks for the password (browser prompt).
  const homeDevToken = url.pathname === HOME_DEV_PATH ? homeDevLogin(request) : null;
  const homeDev = homeDevToken !== null || hasHomeDevSession(request);
  if (url.pathname === HOME_DEV_PATH && homeDevEnabled() && !homeDev) {
    return new NextResponse("Acesso restrito.", {
      status: 401,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "WWW-Authenticate": 'Basic realm="Ano Novo, Luta Nova", charset="UTF-8"',
        "X-Robots-Tag": "noindex",
      },
    });
  }

  const response = switchRoute(request, homeDev) ?? NextResponse.next();
  const cookieOptions = {
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax" as const,
    secure: url.protocol === "https:",
  };

  if (homeDev) {
    // The same address now has two pages: keep shared caches out of it.
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("X-Robots-Tag", "noindex");
  }
  if (homeDevToken) {
    response.cookies.set(HOME_DEV_COOKIE, homeDevToken, {
      ...cookieOptions,
      maxAge: HOME_DEV_MAX_AGE,
      httpOnly: true,
    });
  }

  const coupon = couponFromUrl(url);
  if (coupon) response.cookies.set(COUPON_COOKIE, coupon, cookieOptions);

  const attribution = attributionFromRequest(url, scrubRecoveryReferrer(request.headers.get("referer")));
  if (attribution) {
    response.cookies.set(ATTRIBUTION_COOKIE, JSON.stringify(attribution), cookieOptions);
  }

  return response;
}

export const config = {
  // Páginas, não arquivos: fora ficam _next, api e qualquer caminho com
  // extensão (imagens, fontes, scripts, o wireframe e os assets dele).
  matcher: ["/((?!_next/|api/|.*\\.[a-zA-Z0-9]+$).*)"],
};
