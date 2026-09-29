import { NextResponse, type NextRequest } from "next/server";
import {
  ATTRIBUTION_COOKIE,
  COOKIE_MAX_AGE,
  COUPON_COOKIE,
  attributionFromRequest,
  couponFromUrl,
} from "@/lib/attribution";
import { serverEnv } from "@/lib/env.server";
import { GONE_HTML, isGone } from "@/lib/legacy-urls";


/**
 * The store's feature switches, read on each request so that flipping one
 * takes a restart and not a rebuild (the pages behind them stay static):
 *
 * - ANLN_HOME_COMMING_SOON: `/` shows the "Em breve" page (a rewrite: the
 *   address stays `/`). Off, `/em-breve` itself sends visitors to the home.
 * - ANLN_PRECHECKOUT: `/carrinho` is the pre-checkout page. Off, it goes to
 *   the offer on the home, as the old WordPress cart URL always did.
 *
 * Returns null when the request goes on to its own page.
 */
function switchRoute(request: NextRequest): NextResponse | null {
  const { pathname, search } = request.nextUrl;
  // The query goes along: `?cupom=` and the UTMs still count on the next page.
  const to = (path: string, hash = "") => new URL(path + search + hash, request.url);

  if (pathname === "/" && serverEnv.homeComingSoon) {
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
export function proxy(request: NextRequest) {
  const url = request.nextUrl;

  // Conteúdo do WordPress antigo sem equivalente: 410 (ver legacy-urls.ts).
  if (isGone(url.pathname)) {
    return new NextResponse(GONE_HTML, {
      status: 410,
      headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
    });
  }

  const response = switchRoute(request) ?? NextResponse.next();
  const cookieOptions = {
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax" as const,
    secure: url.protocol === "https:",
  };

  const coupon = couponFromUrl(url);
  if (coupon) response.cookies.set(COUPON_COOKIE, coupon, cookieOptions);

  const attribution = attributionFromRequest(url, request.headers.get("referer"));
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
