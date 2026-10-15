import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { serverEnv } from "@/lib/env.server";

/**
 * `/home-dev`: the landing page behind a password while the home is the
 * "Em breve" page (ANLN_HOME_COMMING_SOON). The password (ANLN_HOME_DEV_PASSWORD)
 * comes through the browser's Basic Auth prompt and opens a session cookie;
 * while it lasts, the proxy serves that visitor the landing page at `/` too,
 * so the links back to the home, the offer, the cart and the checkout work as
 * they will after launch.
 */
export const HOME_DEV_PATH = "/home-dev";
export const HOME_DEV_COOKIE = "anln_home_dev";
export const HOME_DEV_MAX_AGE = 60 * 60 * 24 * 30;

/**
 * The cookie holds a digest of the password, never the password itself.
 * Changing the password ends every open session.
 */
const sessionToken = (password: string) =>
  createHmac("sha256", password).update(HOME_DEV_COOKIE).digest("base64url");

function sameText(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Whether `/home-dev` exists at all: only with a password set. */
export const homeDevEnabled = () => serverEnv.homeDevPassword !== null;

/** Whether the request carries a valid session cookie. */
export function hasHomeDevSession(request: NextRequest) {
  const password = serverEnv.homeDevPassword;
  const cookie = request.cookies.get(HOME_DEV_COOKIE)?.value;
  return password !== null && cookie !== undefined && sameText(cookie, sessionToken(password));
}

/**
 * The session token when the request's Basic Auth has the right password,
 * null otherwise. The user name is ignored: the prompt asks for both, but
 * there is only one shared password.
 */
export function homeDevLogin(request: NextRequest) {
  const password = serverEnv.homeDevPassword;
  const header = request.headers.get("authorization");
  if (password === null || !header?.startsWith("Basic ")) return null;

  const credentials = Buffer.from(header.slice("Basic ".length), "base64").toString("utf8");
  const given = credentials.slice(credentials.indexOf(":") + 1);
  return sameText(given, password) ? sessionToken(password) : null;
}
