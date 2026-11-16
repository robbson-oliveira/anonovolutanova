import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { publicEnv } from "@/lib/env";
import { RECOVERY_COOKIE, fetchRecoveryItems, isRecoveryToken } from "@/lib/commerce/recover-cart";

export const dynamic = "force-dynamic";

const noStore = {
  "Cache-Control": "private, no-store",
  "Referrer-Policy": "no-referrer",
};

/**
 * Trades the httpOnly recovery cookie for product ids and quantities.
 * The token stays on this request (cookie path `/carrinho`) and is cleared
 * here, whether or not the store answers. The body never includes it.
 */
export async function GET(request: Request) {
  const token = (await cookies()).get(RECOVERY_COOKIE)?.value ?? "";
  const secure = new URL(request.url).protocol === "https:";
  const clear = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/carrinho",
    maxAge: 0,
  };

  if (!publicEnv.cartRecoveryEnabled || !isRecoveryToken(token)) {
    const response = NextResponse.json({ ok: false }, { headers: noStore });
    response.cookies.set(RECOVERY_COOKIE, "", clear);
    return response;
  }

  const items = await fetchRecoveryItems(publicEnv.wpUrl, token);
  const response = NextResponse.json(items ? { ok: true, items } : { ok: false }, { headers: noStore });
  response.cookies.set(RECOVERY_COOKIE, "", clear);
  return response;
}
