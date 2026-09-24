import { NextResponse, type NextRequest } from "next/server";
import {
  ATTRIBUTION_COOKIE,
  COOKIE_MAX_AGE,
  COUPON_COOKIE,
  attributionFromRequest,
  couponFromUrl,
} from "@/lib/attribution";

/**
 * Roda antes de toda página (inclusive a home, que é o wireframe em HTML puro)
 * e guarda em cookie o que chega pela URL e precisa sobreviver até o checkout:
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
  const response = NextResponse.next();
  const url = request.nextUrl;
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
